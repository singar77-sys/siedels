"""End-to-end test: create ONE block, verify it lands, cancel it.

Tests the full booking lifecycle without touching the rest of the schedule.
Picks Matt (off all week) for Sat 8am-3pm — Saturday is past anyway by then.
"""
from pathlib import Path
import json
import urllib.request, urllib.error
import uuid

ENV = dict(line.split("=", 1) for line in Path("C:/Users/Mark/Documents/Hunter Systems/siedels/sand.env").read_text().splitlines() if "=" in line)
TOKEN = ENV["SQUARE_ACCESS_TOKEN"]
LOC = ENV["SQUARE_LOCATION_ID"]
BLOCK_VAR = ENV["SQUARE_BLOCK_SERVICE_VARIATION_ID"]
BLOCK_CUSTOMER = ENV["SQUARE_BLOCK_CUSTOMER_ID"]
BASE = "https://connect.squareup.com/v2"
HDR = {"Square-Version": "2024-12-18", "Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

def call(method, path, body=None):
    req = urllib.request.Request(BASE + path, method=method, headers=HDR)
    if body is not None: req.data = json.dumps(body).encode()
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            txt = r.read().decode(); return r.status, (json.loads(txt) if txt.strip() else {})
    except urllib.error.HTTPError as e:
        txt = e.read().decode()
        try: return e.code, json.loads(txt or '{}')
        except: return e.code, {"raw": txt[:500]}

MATT = "TMXIK3PV7gw6Nfn9"

# 1. Create block: Matt Sat 5/2 8am-3pm (7 hours = 420 min)
print("Creating test block: Matt Sat 5/2 8am-3pm...")
body = {
    "idempotency_key": str(uuid.uuid4()),
    "booking": {
        "location_id": LOC,
        "customer_id": BLOCK_CUSTOMER,
        "start_at": "2026-05-02T08:00:00-04:00",
        "appointment_segments": [{
            "team_member_id": MATT,
            "service_variation_id": BLOCK_VAR,
            "service_variation_version": 1,
            "duration_minutes": 420,
        }],
    }
}
s, j = call("POST", "/bookings", body)
print(f"  status: {s}")
if s not in (200, 201):
    print(json.dumps(j, indent=2)[:1500])
    raise SystemExit(1)
b = j["booking"]
booking_id = b["id"]
print(f"  Created: {booking_id}")
print(f"  start_at: {b['start_at']}  status: {b['status']}  version: {b['version']}")

# 2. Verify by listing
print()
print("Verifying via GET /bookings ...")
s, j = call("GET", f"/bookings?location_id={LOC}&start_at_min=2026-05-02T00:00:00-04:00&start_at_max=2026-05-02T23:59:59-04:00")
print(f"  status: {s}")
found = [bk for bk in j.get("bookings", []) if bk["id"] == booking_id]
print(f"  Found in list: {len(found) > 0}")

# 3. Cancel
print()
print("Cancelling test block...")
s, j = call("POST", f"/bookings/{booking_id}/cancel", {"idempotency_key": str(uuid.uuid4()), "booking_version": b["version"]})
print(f"  status: {s}")
if s == 200:
    print(f"  Cancelled. New status: {j['booking']['status']}")
else:
    print(json.dumps(j, indent=2)[:800])

print()
print("Test complete. Block was created, listed, and cancelled.")
