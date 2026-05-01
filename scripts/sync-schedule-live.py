"""Live schedule sync: read Google Sheet, reconcile INTERNAL-BLOCKED bookings in Square.

Idempotent. Safe to re-run.
  - Computes planned blocks for the sheet's current week
  - Fetches existing INTERNAL-BLOCKED bookings in that date range
  - Diffs: cancels orphans, creates missing, leaves matches alone
  - Skips dates in the past (don't re-block already-elapsed time)

Usage:
  python sync-schedule-live.py                   # dry-run by default
  python sync-schedule-live.py --apply           # actually write
"""
import sys
from pathlib import Path
from datetime import datetime, timedelta, timezone, date as date_cls
import json
import re
import urllib.request, urllib.error, urllib.parse
import uuid

APPLY = "--apply" in sys.argv

# ── Config ──────────────────────────────────────────────────────────
ENV = dict(line.split("=", 1) for line in Path("C:/Users/Mark/Documents/Hunter Systems/siedels/sand.env").read_text().splitlines() if "=" in line)
TOKEN = ENV["SQUARE_ACCESS_TOKEN"]
LOC = ENV["SQUARE_LOCATION_ID"]
BLOCK_VAR = ENV["SQUARE_BLOCK_SERVICE_VARIATION_ID"]
BLOCK_CUSTOMER = ENV["SQUARE_BLOCK_CUSTOMER_ID"]

SHEET_ID = "1fyeoscOea4Xa2H-LIoFv96F-ILoBhnvL0KKzS3eC83Q"
SHEET_CSV = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv"
TZ_OFFSET = "-04:00"  # America/New_York EDT in May. TODO: handle DST in TS port.

BASE = "https://connect.squareup.com/v2"
HDR = {"Square-Version": "2024-12-18", "Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

TEAM_MAP = {
    "jim": "TMg6BhxTBejmD3Mu", "billy": "TMyZuF0ATa88VSIC", "matt": "TMXIK3PV7gw6Nfn9",
    "patrick": "TMczLNf1lpChKTW1", "krista": "TMF0l_MTlXDBUne0", "ticia": "TMY92J8fk1vopHLK",
    "pierre": "TMcYCni9gMFp1phL", "chris": "TMDYoGsYchG9Zx2M", "sam": "TMjH8V1ibNbrThWU",
    "shannon": "TMxS3SdfJAhEasf2", "will": "TMjfrDpWo7xEYLjG",
}

# ── Helpers ─────────────────────────────────────────────────────────
def call(method, path, body=None):
    req = urllib.request.Request(BASE + path, method=method, headers=HDR)
    if body is not None: req.data = json.dumps(body).encode()
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            txt = r.read().decode(); return r.status, (json.loads(txt) if txt.strip() else {})
    except urllib.error.HTTPError as e:
        txt = e.read().decode()
        try: return e.code, json.loads(txt or '{}')
        except: return e.code, {"raw": txt[:500]}

def parse_csv(text):
    rows, row, cell, in_q = [], [], "", False
    i = 0
    while i < len(text):
        c = text[i]
        if in_q:
            if c == '"' and i+1 < len(text) and text[i+1] == '"': cell += '"'; i += 1
            elif c == '"': in_q = False
            else: cell += c
        else:
            if c == '"': in_q = True
            elif c == ",": row.append(cell); cell = ""
            elif c == "\n": row.append(cell); rows.append(row); row = []; cell = ""
            elif c == "\r": pass
            else: cell += c
        i += 1
    if cell or row: row.append(cell); rows.append(row)
    return rows

def parse_time_range(raw):
    s = raw.strip().lower().replace(" ", "").replace("–","-").replace("—","-")
    s = s.replace("noon","12pm").replace("midnight","12am")
    m = re.match(r"^(\d{1,2})(?::(\d{2}))?(am|pm)?-(\d{1,2})(?::(\d{2}))?(am|pm)?$", s)
    if not m: return None
    h1,m1,ap1,h2,m2,ap2 = m.groups()
    h1,h2 = int(h1), int(h2)
    m1 = int(m1) if m1 else 0
    m2 = int(m2) if m2 else 0
    if not ap1 and ap2: ap1 = ap2
    if not ap2 and ap1: ap2 = ap1
    if not ap1 and not ap2: ap1, ap2 = "am", "pm"
    def to24(h, ap):
        if ap == "pm" and h != 12: return h + 12
        if ap == "am" and h == 12: return 0
        return h
    start = to24(h1, ap1) + m1/60.0
    end = to24(h2, ap2) + m2/60.0
    if end <= start: end += 12
    return (start, end)

def classify(raw):
    t = raw.strip().lower()
    if not t or t in ("off", "r/o", "ro"): return ("off", None)
    rng = parse_time_range(raw)
    if rng: return ("working", rng)
    return ("offsite", raw.strip())

def hours_to_iso(date_iso, hours_float):
    h = int(hours_float)
    m = int(round((hours_float - h) * 60))
    if m == 60: h += 1; m = 0
    return f"{date_iso}T{h:02d}:{m:02d}:00{TZ_OFFSET}"

def fmt_h(h):
    hh = int(h); mm = int(round((h - hh) * 60))
    if mm == 60: hh += 1; mm = 0
    am = "a" if hh < 12 else "p"
    h12 = hh if hh <= 12 else hh - 12
    if h12 == 0: h12 = 12
    return f"{h12}:{mm:02d}{am}" if mm else f"{h12}{am}"

# ── 1. Read sheet, build planned blocks ─────────────────────────────
print(f"[{'APPLY' if APPLY else 'DRY-RUN'}] Fetching sheet ...")
sheet_text = urllib.request.urlopen(SHEET_CSV, timeout=10).read().decode("utf-8")
rows = parse_csv(sheet_text)
day_row, date_row, hours_row = rows[0], rows[1], rows[2]
day_cols = [(c, day_row[c].strip()) for c in range(1, len(day_row)) if day_row[c].strip() in DAY_NAMES]

now_local = datetime.now(timezone.utc).astimezone(timezone(timedelta(hours=-4)))
today = now_local.date()

planned = []  # tuples of (team_id, date_iso, start_iso, end_iso, duration_min, label)
for c, day_name in day_cols:
    m = re.match(r"^(\d{1,2})/(\d{1,2})/(\d{4})$", date_row[c].strip())
    if not m: continue
    mm, dd, yyyy = m.groups()
    date_iso = f"{yyyy}-{int(mm):02d}-{int(dd):02d}"
    d_obj = date_cls(int(yyyy), int(mm), int(dd))
    if d_obj < today:
        # Skip past dates — don't try to sync time that's already elapsed
        continue
    shop_rng = parse_time_range(hours_row[c])
    if not shop_rng: continue

    for r in range(3, len(rows)):
        name_raw = (rows[r][0] or "").strip()
        if not name_raw: continue
        first = name_raw.split()[0].lower()
        team_id = TEAM_MAP.get(first)
        if not team_id: continue
        cell = rows[r][c] if c < len(rows[r]) else ""
        status, info = classify(cell)
        intervals = []
        if status == "working":
            ss, se = info
            if ss > shop_rng[0]: intervals.append((shop_rng[0], ss, f"pre-shift ({cell})"))
            if se < shop_rng[1]: intervals.append((se, shop_rng[1], f"post-shift ({cell})"))
        elif status == "off":
            intervals.append((shop_rng[0], shop_rng[1], f"off ({cell or 'blank'})"))
        elif status == "offsite":
            intervals.append((shop_rng[0], shop_rng[1], f"offsite ({info})"))
        for start_h, end_h, label in intervals:
            dur_min = int(round((end_h - start_h) * 60))
            block_start = datetime.fromisoformat(hours_to_iso(date_iso, start_h))
            if block_start <= now_local:
                continue  # skip blocks already in the past
            planned.append({
                "team_id": team_id,
                "team_first": first,
                "date": date_iso,
                "day_name": day_name,
                "start_iso": hours_to_iso(date_iso, start_h),
                "end_iso": hours_to_iso(date_iso, end_h),
                "start_h": start_h, "end_h": end_h,
                "duration_min": dur_min,
                "label": label,
            })

print(f"  planned blocks: {len(planned)}")

# ── 2. Fetch existing INTERNAL-BLOCKED bookings in date range ──────
all_dates = sorted(set(p["date"] for p in planned))
if not all_dates:
    print("  no future dates to sync. exit.")
    raise SystemExit(0)

start_q = f"{all_dates[0]}T00:00:00{TZ_OFFSET}"
end_q = f"{all_dates[-1]}T23:59:59{TZ_OFFSET}"
existing = []
cursor = None
while True:
    qp = f"?location_id={LOC}&start_at_min={urllib.parse.quote(start_q)}&start_at_max={urllib.parse.quote(end_q)}&limit=200"
    if cursor: qp += f"&cursor={urllib.parse.quote(cursor)}"
    s, j = call("GET", "/bookings" + qp)
    if s != 200: print(f"  list err {s}: {json.dumps(j)[:200]}"); raise SystemExit(1)
    existing.extend(j.get("bookings", []))
    cursor = j.get("cursor")
    if not cursor: break

ours = []
others = []
for b in existing:
    segs = b.get("appointment_segments", [])
    if any(seg.get("service_variation_id") == BLOCK_VAR for seg in segs) and b.get("status") == "ACCEPTED":
        ours.append(b)
    elif b.get("status") == "ACCEPTED":
        others.append(b)
print(f"  existing INTERNAL-BLOCKED bookings (active): {len(ours)}")
print(f"  other active bookings (real customer appts): {len(others)}")

# ── 3. Diff: identify creates and cancels ───────────────────────────
def key_for(team_id, start_iso, dur_min):
    return f"{team_id}|{start_iso}|{dur_min}"

planned_keys = {key_for(p["team_id"], p["start_iso"], p["duration_min"]): p for p in planned}
existing_keys = {}
for b in ours:
    seg = b["appointment_segments"][0]
    existing_keys[key_for(seg["team_member_id"], b["start_at"].replace("Z", "+00:00"), seg["duration_minutes"])] = b

# Square returns start_at in UTC ("Z"), our planned are in local TZ. Normalize for compare.
def to_utc_iso(local_iso):
    # Parse "2026-04-27T08:00:00-04:00" → UTC ISO with Z
    dt = datetime.fromisoformat(local_iso)
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

planned_keys = {key_for(p["team_id"], to_utc_iso(p["start_iso"]), p["duration_min"]): p for p in planned}
existing_keys = {}
for b in ours:
    seg = b["appointment_segments"][0]
    existing_keys[key_for(seg["team_member_id"], b["start_at"], seg["duration_minutes"])] = b

to_create = [planned_keys[k] for k in planned_keys if k not in existing_keys]
to_cancel = [existing_keys[k] for k in existing_keys if k not in planned_keys]
to_keep_n = sum(1 for k in planned_keys if k in existing_keys)

print()
print(f"=== Reconcile ===")
print(f"  keep:   {to_keep_n}")
print(f"  create: {len(to_create)}")
print(f"  cancel: {len(to_cancel)}")

if not APPLY:
    print()
    print("Would CREATE:")
    for p in to_create[:60]:
        print(f"  {p['day_name'][:3]} {p['date']}  {p['team_first']:<8} {fmt_h(p['start_h'])}-{fmt_h(p['end_h'])} ({p['duration_min']}m) {p['label']}")
    if to_cancel:
        print("Would CANCEL:")
        for b in to_cancel[:20]:
            seg = b["appointment_segments"][0]
            print(f"  id={b['id']} tm={seg['team_member_id']} start={b['start_at']} dur={seg['duration_minutes']}m")
    print("\nDry-run. Re-run with --apply to actually write.")
    raise SystemExit(0)

# ── 4. APPLY ────────────────────────────────────────────────────────
print()
print(f"=== APPLYING — creating {len(to_create)}, cancelling {len(to_cancel)} ===")
created = 0; cancelled = 0; errors = []
for p in to_create:
    body = {
        "idempotency_key": str(uuid.uuid4()),
        "booking": {
            "location_id": LOC,
            "customer_id": BLOCK_CUSTOMER,
            "start_at": p["start_iso"],
            "appointment_segments": [{
                "team_member_id": p["team_id"],
                "service_variation_id": BLOCK_VAR,
                "service_variation_version": 1,
                "duration_minutes": p["duration_min"],
            }],
        },
    }
    s, j = call("POST", "/bookings", body)
    if s in (200, 201):
        created += 1
        print(f"  + {p['day_name'][:3]} {p['date']} {p['team_first']:<8} {fmt_h(p['start_h'])}-{fmt_h(p['end_h'])} {p['label']}")
    else:
        err = (j.get("errors", [{}])[0] or {}).get("detail", json.dumps(j)[:120])
        errors.append({"create": p, "err": err})
        print(f"  ! FAIL {p['team_first']} {p['date']} {p['start_iso']}: {err}")

for b in to_cancel:
    s, j = call("POST", f"/bookings/{b['id']}/cancel", {"idempotency_key": str(uuid.uuid4()), "booking_version": b["version"]})
    if s == 200:
        cancelled += 1
        print(f"  - cancelled {b['id']}")
    else:
        err = (j.get("errors", [{}])[0] or {}).get("detail", json.dumps(j)[:120])
        errors.append({"cancel": b["id"], "err": err})
        print(f"  ! cancel FAIL {b['id']}: {err}")

print()
print(f"=== Done. created={created} cancelled={cancelled} errors={len(errors)} ===")
if errors:
    print(json.dumps(errors[:5], indent=2))
