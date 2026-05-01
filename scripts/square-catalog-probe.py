"""Probe Square catalog + bookings to understand the 'block team time' model."""
from pathlib import Path
import json
import urllib.request, urllib.error

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

print("=== /v2/catalog/list?types=ITEM,ITEM_VARIATION ===")
s, j = call("GET", "/catalog/list?types=ITEM,ITEM_VARIATION")
print(f"status: {s}")
items = [o for o in j.get('objects', []) if o['type'] == 'ITEM']
varis = [o for o in j.get('objects', []) if o['type'] == 'ITEM_VARIATION']
print(f"items: {len(items)}, variations: {len(varis)}")
print()
print("ITEMS (services):")
for it in items:
    d = it.get('item_data', {})
    print(f"  {it['id']}  '{d.get('name','')}'  product_type={d.get('product_type')}  category={d.get('category_id','')}")
    for v in d.get('variations', []):
        vd = v.get('item_variation_data', {})
        price = vd.get('price_money', {})
        print(f"    -> var {v['id']}  '{vd.get('name','')}'  ${price.get('amount',0)/100 if price else '?'}  duration={vd.get('service_duration')}ms team_ids={vd.get('team_member_ids',[])}")

print()
print("=== /v2/bookings/business-booking-profile ===")
s, j = call("GET", "/bookings/business-booking-profile")
print(f"status: {s}")
print(json.dumps(j.get('business_booking_profile', {}), indent=2)[:1500])

print()
print("=== /v2/bookings/location-booking-profiles ===")
s, j = call("GET", "/bookings/location-booking-profiles")
print(f"status: {s}")
for p in j.get('location_booking_profiles', [])[:3]:
    print(json.dumps(p, indent=2)[:600])

print()
print("=== /v2/bookings (recent) ===")
s, j = call("GET", "/bookings?limit=5")
print(f"status: {s}")
print(f"booking count returned: {len(j.get('bookings', []))}")
for b in j.get('bookings', [])[:3]:
    segs = b.get('appointment_segments', [])
    print(f"  booking {b.get('id')[:14]}... start={b.get('start_at','?')[:16]} status={b.get('status')} customer={b.get('customer_id','none')[:14]}")
    for sg in segs:
        print(f"    seg: tm={sg.get('team_member_id','?')[:14]} svc_var={sg.get('service_variation_id','?')[:14]} dur={sg.get('duration_minutes')}min")
