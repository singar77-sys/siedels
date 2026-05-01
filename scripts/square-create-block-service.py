"""One-time setup: create the INTERNAL-BLOCKED service in Square catalog.

Customer-invisible (available_for_booking=false). Only used for blocking team-member
time via the sync cron. Idempotent — checks if it already exists first.
"""
from pathlib import Path
import json
import urllib.request, urllib.error
import uuid

ENV = Path("C:/Users/Mark/Documents/Hunter Systems/siedels/sand.env")
APP_ID, TOKEN = [l.strip() for l in ENV.read_text().splitlines() if l.strip()][:2]
BASE = "https://connect.squareup.com/v2"
HDR = {"Square-Version": "2024-12-18", "Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

def call(method, path, body=None):
    req = urllib.request.Request(BASE + path, method=method, headers=HDR)
    if body is not None: req.data = json.dumps(body).encode()
    try:
        with urllib.request.urlopen(req, timeout=20) as r: return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e: return e.code, json.loads(e.read().decode() or '{}')

# 1. Check if it already exists
print("Checking for existing INTERNAL-BLOCKED service...")
s, j = call("POST", "/catalog/search-catalog-items", {"text_filter": "INTERNAL-BLOCKED"})
existing = [it for it in j.get('items', []) if it['item_data']['name'] == 'INTERNAL-BLOCKED']
if existing:
    it = existing[0]
    var = it['item_data']['variations'][0]
    print(f"  Already exists: item={it['id']} variation={var['id']}")
    print(f"  -> Save these IDs in env: SQUARE_BLOCK_SERVICE_ITEM_ID, SQUARE_BLOCK_SERVICE_VARIATION_ID")
    raise SystemExit(0)

# 2. Get all active team member IDs
print("Fetching active team members...")
s, j = call("POST", "/team-members/search", {"query": {"filter": {"status": "ACTIVE"}}, "limit": 50})
team_ids = [m['id'] for m in j.get('team_members', [])]
print(f"  Found {len(team_ids)} active team members")

# 3. Create the service via UpsertCatalogObject
print("Creating INTERNAL-BLOCKED service...")
item_idem = str(uuid.uuid4())
var_idem = str(uuid.uuid4())
body = {
    "idempotency_key": item_idem,
    "object": {
        "type": "ITEM",
        "id": "#block-item",
        "item_data": {
            "name": "INTERNAL-BLOCKED",
            "description": "System-managed: blocks team-member time per the schedule sheet. Hidden from customers. Do not delete.",
            "product_type": "APPOINTMENTS_SERVICE",
            "available_online": False,
            "available_for_pickup": False,
            "variations": [
                {
                    "type": "ITEM_VARIATION",
                    "id": "#block-var",
                    "item_variation_data": {
                        "item_id": "#block-item",
                        "name": "Block",
                        "pricing_type": "FIXED_PRICING",
                        "price_money": {"amount": 0, "currency": "USD"},
                        "available_for_booking": False,
                        "service_duration": 3600000,  # 1hr default; we override per booking
                        "team_member_ids": team_ids,
                    }
                }
            ]
        }
    }
}
s, j = call("POST", "/catalog/object", body)
print(f"  status: {s}")
if s != 200:
    print(json.dumps(j, indent=2)[:1500])
    raise SystemExit(1)

obj = j['catalog_object']
var = obj['item_data']['variations'][0]
print(f"  Created item: {obj['id']}")
print(f"  Created variation: {var['id']}")
print()
print("Add these to your env (sand.env or as separate vars):")
print(f"  SQUARE_BLOCK_SERVICE_ITEM_ID={obj['id']}")
print(f"  SQUARE_BLOCK_SERVICE_VARIATION_ID={var['id']}")
