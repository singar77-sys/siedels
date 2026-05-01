"""Dry-run for the schedule → Square sync.

Reads the live Google Sheet, computes the per-barber 'block' intervals for the
upcoming week, prints what WOULD be created in Square. No writes.

Logic mirrors what the production cron will do (which lives in TypeScript).
"""
from pathlib import Path
from datetime import datetime, timedelta, timezone
import json
import re
import urllib.request
import urllib.error
import urllib.parse

# ────────────────────────────────────────────────────────────────────
# Config
# ────────────────────────────────────────────────────────────────────
ENV_FILE = Path("C:/Users/Mark/Documents/Hunter Systems/siedels/sand.env")
ENV = dict(line.split("=", 1) for line in ENV_FILE.read_text().splitlines() if "=" in line)
TOKEN = ENV["SQUARE_ACCESS_TOKEN"]
LOCATION_ID = ENV["SQUARE_LOCATION_ID"]
BLOCK_VAR_ID = ENV["SQUARE_BLOCK_SERVICE_VARIATION_ID"]

SHEET_ID = "1fyeoscOea4Xa2H-LIoFv96F-ILoBhnvL0KKzS3eC83Q"
SHEET_CSV = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv"
TZ_OFFSET = "-04:00"  # America/New_York (EDT in May). For prod, compute properly.

BASE = "https://connect.squareup.com/v2"
HDR = {"Square-Version": "2024-12-18", "Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

# Sheet first-name (case-insensitive) → Square team_member_id
TEAM_MAP = {
    "jim": "TMg6BhxTBejmD3Mu",
    "billy": "TMyZuF0ATa88VSIC",
    "matt": "TMXIK3PV7gw6Nfn9",
    "patrick": "TMczLNf1lpChKTW1",
    "krista": "TMF0l_MTlXDBUne0",
    "ticia": "TMY92J8fk1vopHLK",
    "pierre": "TMcYCni9gMFp1phL",
    "chris": "TMDYoGsYchG9Zx2M",
    "sam": "TMjH8V1ibNbrThWU",
    "shannon": "TMxS3SdfJAhEasf2",
    "will": "TMjfrDpWo7xEYLjG",
}

# ────────────────────────────────────────────────────────────────────
# Sheet parsing (mirror of src/lib/schedule.ts)
# ────────────────────────────────────────────────────────────────────
DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

def parse_csv(text):
    rows, row, cell, in_q = [], [], "", False
    i = 0
    while i < len(text):
        c = text[i]
        if in_q:
            if c == '"' and i+1 < len(text) and text[i+1] == '"':
                cell += '"'; i += 1
            elif c == '"': in_q = False
            else: cell += c
        else:
            if c == '"': in_q = True
            elif c == ",": row.append(cell); cell = ""
            elif c == "\n":
                row.append(cell); rows.append(row); row = []; cell = ""
            elif c == "\r": pass
            else: cell += c
        i += 1
    if cell or row: row.append(cell); rows.append(row)
    return rows

def parse_time_range(raw):
    """'8am-6pm' -> (8.0, 18.0); '10am-noon' -> (10.0, 12.0); 'noon-8pm' -> (12.0, 20.0).
    Returns None if not a recognizable time range."""
    s = raw.strip().lower().replace(" ", "")
    s = s.replace("–", "-").replace("—", "-")
    s = s.replace("noon", "12pm").replace("midnight", "12am")
    m = re.match(r"^(\d{1,2})(?::(\d{2}))?(am|pm)?-(\d{1,2})(?::(\d{2}))?(am|pm)?$", s)
    if not m: return None
    h1, m1, ap1, h2, m2, ap2 = m.groups()
    h1, h2 = int(h1), int(h2)
    m1 = int(m1) if m1 else 0
    m2 = int(m2) if m2 else 0
    # If only one am/pm given, assume same period or implied by ordering.
    if not ap1 and ap2: ap1 = ap2
    if not ap2 and ap1: ap2 = ap1
    if not ap1 and not ap2:
        # Bare numbers — assume morning→afternoon if h1<h2
        ap1, ap2 = "am", "pm"
    def to24(h, ap):
        if ap == "pm" and h != 12: return h + 12
        if ap == "am" and h == 12: return 0
        return h
    start = to24(h1, ap1) + m1/60.0
    end = to24(h2, ap2) + m2/60.0
    if end <= start: end += 12  # 8-3 implied 8am-3pm; if still bad, oh well
    return (start, end)

def classify(raw):
    t = raw.strip().lower()
    if not t or t in ("off", "r/o", "ro"): return ("off", None)
    rng = parse_time_range(raw)
    if rng: return ("working", rng)
    return ("offsite", raw.strip())  # e.g., "Ledgewood"

# ────────────────────────────────────────────────────────────────────
# Fetch sheet + Square existing blocks
# ────────────────────────────────────────────────────────────────────
print(f"Fetching sheet ...")
sheet_text = urllib.request.urlopen(SHEET_CSV, timeout=10).read().decode("utf-8")
rows = parse_csv(sheet_text)

day_row, date_row, hours_row = rows[0], rows[1], rows[2]
day_cols = [(c, day_row[c].strip()) for c in range(1, len(day_row)) if day_row[c].strip() in DAY_NAMES]

print("Sheet covers:")
for c, name in day_cols:
    print(f"  {name:<10} {date_row[c]:<12} shop={hours_row[c]}")

# Build per-day plan
plan = []  # list of {team_id, name, day, date_iso, start_iso, end_iso, reason}
for c, day_name in day_cols:
    date_str = date_row[c].strip()  # "4/27/2026"
    m = re.match(r"^(\d{1,2})/(\d{1,2})/(\d{4})$", date_str)
    if not m:
        print(f"  skip {day_name}: bad date {date_str}"); continue
    mm, dd, yyyy = m.groups()
    iso = f"{yyyy}-{int(mm):02d}-{int(dd):02d}"

    shop_rng = parse_time_range(hours_row[c])
    if not shop_rng:
        print(f"  skip {day_name}: bad shop hours {hours_row[c]}"); continue

    for r in range(3, len(rows)):
        name_raw = (rows[r][0] or "").strip()
        if not name_raw: continue
        first = name_raw.split()[0].lower()
        team_id = TEAM_MAP.get(first)
        if not team_id:
            print(f"  WARN: sheet name '{name_raw}' not in TEAM_MAP"); continue
        cell = rows[r][c] if c < len(rows[r]) else ""
        status, info = classify(cell)
        if status == "working":
            shift_start, shift_end = info
            # Block before shift starts
            if shift_start > shop_rng[0]:
                plan.append({"team": first, "team_id": team_id, "date": iso, "day": day_name,
                             "start": shop_rng[0], "end": shift_start,
                             "reason": f"pre-shift (works {cell})"})
            # Block after shift ends
            if shift_end < shop_rng[1]:
                plan.append({"team": first, "team_id": team_id, "date": iso, "day": day_name,
                             "start": shift_end, "end": shop_rng[1],
                             "reason": f"post-shift (works {cell})"})
        elif status == "off":
            plan.append({"team": first, "team_id": team_id, "date": iso, "day": day_name,
                         "start": shop_rng[0], "end": shop_rng[1],
                         "reason": f"off all day ({cell or 'blank'})"})
        elif status == "offsite":
            plan.append({"team": first, "team_id": team_id, "date": iso, "day": day_name,
                         "start": shop_rng[0], "end": shop_rng[1],
                         "reason": f"offsite at {info}"})

# ────────────────────────────────────────────────────────────────────
# Print plan
# ────────────────────────────────────────────────────────────────────
def fmt_h(h):
    hh = int(h); mm = int(round((h - hh) * 60))
    am = "a" if hh < 12 else "p"
    h12 = hh if hh <= 12 else hh - 12
    if h12 == 0: h12 = 12
    return f"{h12}:{mm:02d}{am}" if mm else f"{h12}{am}"

print()
print(f"=== PLAN: {len(plan)} blocks across {len(day_cols)} days, {len(set(p['team'] for p in plan))} barbers ===")
for p in plan:
    dur_h = p["end"] - p["start"]
    print(f"  {p['day'][:3]} {p['date']}  {p['team']:<8} {fmt_h(p['start']):>6}-{fmt_h(p['end']):<6} ({dur_h:>4.1f}h)  {p['reason']}")

# Now check existing INTERNAL-BLOCKED bookings for this week range
def call(method, path, body=None):
    req = urllib.request.Request(BASE + path, method=method, headers=HDR)
    if body is not None: req.data = json.dumps(body).encode()
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            txt = r.read().decode()
            return r.status, (json.loads(txt) if txt.strip() else {})
    except urllib.error.HTTPError as e:
        txt = e.read().decode()
        try: return e.code, json.loads(txt or '{}')
        except json.JSONDecodeError: return e.code, {"raw": txt[:300]}

# Compute date range for query
all_dates = sorted(set(p["date"] for p in plan))
if all_dates:
    start_iso = f"{all_dates[0]}T00:00:00{TZ_OFFSET}"
    end_iso = f"{all_dates[-1]}T23:59:59{TZ_OFFSET}"
    print()
    print(f"=== Existing Square bookings in this range ({start_iso} -> {end_iso}) ===")
    qp = f"?location_id={LOCATION_ID}&start_at_min={urllib.parse.quote(start_iso)}&start_at_max={urllib.parse.quote(end_iso)}&limit=200"
    s, j = call("GET", "/bookings" + qp)
    if s != 200:
        print(f"  search failed: {s} {json.dumps(j)[:200]}")
    else:
        existing = j.get("bookings", [])
        own = [b for b in existing if any(seg.get("service_variation_id") == BLOCK_VAR_ID for seg in b.get("appointment_segments", []))]
        other = [b for b in existing if b not in own]
        print(f"  Existing INTERNAL-BLOCKED bookings: {len(own)}")
        print(f"  Other bookings (real customer appts): {len(other)}")

print()
print("Dry-run complete. No writes performed.")
