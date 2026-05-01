"""One-time setup: create the system customer used for blocking bookings.

Idempotent — checks for existing first.
"""
from pathlib import Path
import json, urllib.request, urllib.error, uuid

ENV_PATH = Path("C:/Users/Mark/Documents/Hunter Systems/siedels/sand.env")
ENV = dict(line.split("=", 1) for line in ENV_PATH.read_text().splitlines() if "=" in line)
TOKEN = ENV["SQUARE_ACCESS_TOKEN"]
HDR = {"Square-Version": "2024-12-18", "Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}
BASE = "https://connect.squareup.com/v2"

def call(method, path, body=None):
    req = urllib.request.Request(BASE + path, method=method, headers=HDR)
    if body is not None: req.data = json.dumps(body).encode()
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            txt = r.read().decode(); return r.status, (json.loads(txt) if txt.strip() else {})
    except urllib.error.HTTPError as e:
        try: return e.code, json.loads(e.read().decode() or '{}')
        except: return e.code, {}

REF_ID = "INTERNAL-SCHEDULE-BLOCK-CUSTOMER"

print("Searching for existing block customer...")
s, j = call("POST", "/customers/search", {"query": {"filter": {"reference_id": {"exact": REF_ID}}}})
existing = j.get("customers", [])
if existing:
    cid = existing[0]["id"]
    print(f"  Already exists: {cid}")
else:
    print("Creating block customer...")
    body = {
        "idempotency_key": str(uuid.uuid4()),
        "given_name": "INTERNAL",
        "family_name": "SCHEDULE-BLOCK",
        "company_name": "Siedel's — Schedule Sync",
        "reference_id": REF_ID,
        "note": "System-managed: used as customer_id for INTERNAL-BLOCKED bookings created by the schedule sync cron. Do not delete or merge.",
    }
    s, j = call("POST", "/customers", body)
    print(f"  status: {s}")
    if s != 200:
        print(json.dumps(j, indent=2)[:600]); raise SystemExit(1)
    cid = j["customer"]["id"]
    print(f"  Created: {cid}")

# Append to env
print(f"\nAdding SQUARE_BLOCK_CUSTOMER_ID={cid} to sand.env")
text = ENV_PATH.read_text()
if "SQUARE_BLOCK_CUSTOMER_ID=" in text:
    print("  (key already present, skipping)")
else:
    ENV_PATH.write_text(text.rstrip() + f"\nSQUARE_BLOCK_CUSTOMER_ID={cid}\n")
    print("  appended.")
