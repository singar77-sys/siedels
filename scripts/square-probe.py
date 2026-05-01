"""Probe Square API with the production token from sand.env.

Verifies:
  1. Token works (GET /v2/locations)
  2. Lists team members so we can map sheet first-names → Square team_member_id
  3. Reports current per-team-member booking availability (if visible via API)

Read-only. No writes.
"""
from pathlib import Path
import json
import urllib.request
import urllib.error

ENV = Path("C:/Users/Mark/Documents/Hunter Systems/siedels/sand.env")
lines = [l.strip() for l in ENV.read_text().splitlines() if l.strip()]
APP_ID, TOKEN = lines[0], lines[1]
assert APP_ID.startswith("sq0idp-"), f"expected production app id, got {APP_ID[:10]}..."

BASE = "https://connect.squareup.com/v2"
HDR = {
    "Square-Version": "2024-12-18",
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
}

def call(method, path, body=None):
    req = urllib.request.Request(BASE + path, method=method, headers=HDR)
    if body is not None:
        req.data = json.dumps(body).encode()
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode() or "{}")

print("=== /v2/locations ===")
s, j = call("GET", "/locations")
print(f"status: {s}")
for loc in j.get("locations", []):
    print(f"  id={loc['id']}  name={loc.get('name')}  status={loc.get('status')}")

print()
print("=== /v2/team-members/search (active) ===")
s, j = call("POST", "/team-members/search", {"query": {"filter": {"status": "ACTIVE"}}, "limit": 50})
print(f"status: {s}")
members = j.get("team_members", [])
print(f"count: {len(members)}")
print()
print(f"{'id':<30} {'first':<12} {'last':<15} {'is_owner':<8} {'bookable?'}")
for m in members:
    print(f"{m['id']:<30} {(m.get('given_name') or '')[:12]:<12} {(m.get('family_name') or '')[:15]:<15} {str(m.get('is_owner','')):<8} {m.get('status')}")

# Cross-reference with website names
print()
print("=== Match check vs website team ===")
website_first = ['Jim','Billy','Patrick','Matt','Sam','Krista','Pierre','Will','Chris','Ticia','Shannon']
square_first = {(m.get('given_name') or '').strip(): m['id'] for m in members}
for w in website_first:
    sid = square_first.get(w, '???')
    print(f"  {w:<12} -> Square id: {sid}")
