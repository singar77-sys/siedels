"""Test if team-member-booking-profile UPDATE is also gated by subscription tier.
If this works, we have a partial workaround: toggle is_bookable per barber.
"""
from pathlib import Path
import json, urllib.request, urllib.error

ENV = dict(line.split("=", 1) for line in Path("C:/Users/Mark/Documents/Hunter Systems/siedels/sand.env").read_text().splitlines() if "=" in line)
TOKEN = ENV["SQUARE_ACCESS_TOKEN"]
HDR = {"Square-Version": "2024-12-18", "Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}
BASE = "https://connect.squareup.com/v2"
def call(method, path, body=None):
    req = urllib.request.Request(BASE + path, method=method, headers=HDR)
    if body is not None: req.data = json.dumps(body).encode()
    try:
        with urllib.request.urlopen(req, timeout=20) as r: return r.status, json.loads(r.read().decode() or '{}')
    except urllib.error.HTTPError as e:
        try: return e.code, json.loads(e.read().decode() or '{}')
        except: return e.code, {}

# Read Matt's profile
MATT = "TMXIK3PV7gw6Nfn9"
print("Read Matt's booking profile:")
s, j = call("GET", f"/bookings/team-member-booking-profiles/{MATT}")
print(f"  status: {s}")
print(f"  body: {json.dumps(j.get('team_member_booking_profile', j), indent=2)[:400]}")

# Try to update is_bookable to its current value (no actual change, just test write)
print()
print("Try update (no-op):")
current = j.get("team_member_booking_profile", {})
body = {"team_member_booking_profile": {"is_bookable": current.get("is_bookable", True), "display_name": current.get("display_name", "")}}
s, j = call("PUT", f"/bookings/team-member-booking-profiles/{MATT}", body)
print(f"  status: {s}")
print(f"  body: {json.dumps(j, indent=2)[:600]}")
