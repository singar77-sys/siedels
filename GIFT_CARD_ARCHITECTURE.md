# Gift Card System — Architecture

## Overview

Fully custom gift card system built on Stripe Connect and Neon Postgres. Customers purchase cards online; barbers redeem them in-person via a PIN-gated POS page. No third-party gift card platform.

---

## Money Flow

```
Customer pays $X + $1.50 fee
        │
        ▼
Stripe Checkout Session
        │
        ├── $1.50 application_fee ──► Mark's platform account (Hunter Systems)
        │
        └── $X - Stripe processing fee ──► Jim's connected Stripe account
```

Stripe processing fee on the face value (2.9% + $0.30) is absorbed by Jim's account — the customer is only charged the flat $1.50 handling fee on top.

---

## Database Tables

### `gift_cards`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `code` | TEXT | `SIED-XXXX-XXXX-XXXX`, unique |
| `face_value_cents` | INT | Original purchase amount |
| `balance_cents` | INT | Current spendable balance |
| `status` | TEXT | `active` / `depleted` |
| `purchaser_email` | TEXT | Buyer's email from Stripe checkout |
| `recipient_name` | TEXT | Optional gift recipient name |
| `sender_name` | TEXT | Buyer's name (from form) |
| `gift_message` | TEXT | Optional personal note |
| `stripe_session_id` | TEXT | Used for idempotency on webhook retry |
| `purchased_at` | TIMESTAMP | |
| `last_activity_at` | TIMESTAMP | Used for dormancy fee calculation |

### `gift_card_transactions`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `card_id` | UUID | FK → gift_cards |
| `type` | TEXT | `purchase` / `redemption` / `credit` / `dormancy_fee` |
| `amount_cents` | INT | Positive = credit, negative = debit |
| `balance_after_cents` | INT | Running balance snapshot |
| `note` | TEXT | e.g. `POS-XXXXXXXX / Jim` for redemptions |
| `created_at` | TIMESTAMP | |

### `staff`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | TEXT | Display name (e.g. `Jim`) |
| `pin_hash` | TEXT | `SHA256(pin)` — never stored plaintext |
| `active` | BOOL | Set `FALSE` to immediately invalidate sessions |
| `created_at` | TIMESTAMP | |

Managed via `db/seed-staff.sql`. To change a PIN or deactivate a barber, update the row directly in Neon — the session token embeds the PIN hash and is validated against the DB on every request, so the change takes effect immediately.

### `pin_attempts`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `ip` | TEXT | Source IP |
| `succeeded` | BOOL | |
| `attempted_at` | TIMESTAMP | |

---

## Purchase Flow

```
Customer (GiftPanel)
    │  POST /api/gift-card/checkout
    │  { amount, from, buyerEmail, recipientEmail? }
    ▼
checkout/route.ts
    │  Creates Stripe Checkout Session
    │  customer_email = buyerEmail (pre-fills Stripe form)
    │  line_items: [face value, $1.50 processing fee]
    │  metadata: { to, from, amount, face_value, buyer_email, recipient_email }
    ▼
Stripe Checkout (hosted page)
    │  Customer enters card details
    ▼
Stripe fires checkout.session.completed
    ▼
webhook/route.ts
    │  Verifies Stripe signature
    │  Checks idempotency (lookupCardBySession) — safe to retry
    │  Calls createGiftCard() → inserts gift_cards + purchase transaction
    │  deliverTo = meta.recipient_email || session.customer_email
    └► sendGiftCardEmail(deliverTo, code, faceValue, ...)
```

**Gift routing:** if the buyer checked "This is a gift for someone else" and entered a recipient email, the card is emailed to the recipient directly. The Stripe receipt still goes to the buyer.

---

## Balance Check Flow (Customer-Facing)

```
Customer visits /gift/balance
    │  POST /api/gift-card/balance
    │  { code }
    ▼
balance/route.ts
    │  Rate limit: 10 requests/min per IP (DB-backed)
    │  lookupCard(code) — read-only
    └► Returns { code, balanceCents, faceValueCents, status, recipientName, lastActivityAt }
```

No authentication required. Code is the only credential for read access.

---

## Redemption Flow (Staff-Facing)

```
Barber visits /redeem
    ▼
PIN Screen
    │  POST /api/pin/login { pin }
    │  IP lockout: 5 failures in 15 min → locked 15 min
    │  Looks up staff row by SHA256(pin) WHERE active = TRUE
    │  Correct PIN → HMAC-signed session token, httpOnly cookie (8hr TTL)
    │  Returns { ok, staffName } — UI shows name on all subsequent screens
    │  sessionId generated client-side: POS-XXXXXXXX (safe alphabet, 8 chars)
    ▼
Lookup Screen
    │  POST /api/redeem/lookup { code }
    │  Requires valid gc_auth cookie
    │  verifyAuthToken: checks HMAC + TTL + staff.active + pin_hash match
    └► Returns card id, balance, status, recipientName
    ▼
Charge Screen
    │  POST /api/redeem/charge { cardId, amountCents, note: "POS-XXXXXXXX" }
    │  Requires valid gc_auth cookie
    │  note is augmented server-side: "POS-XXXXXXXX / Jim"
    │  ATOMIC: UPDATE WHERE balance_cents >= amount (no race condition)
    └► Returns { ok, newBalanceCents }
    ▼
Confirm Screen — shows charged amount + new balance
```

---

## Security Model

### Authentication layers
| Endpoint | Auth |
|---|---|
| `POST /api/gift-card/balance` | None (rate limited) |
| `POST /api/gift-card/checkout` | None (public purchase) |
| `POST /api/redeem/lookup` | PIN session cookie |
| `POST /api/redeem/charge` | PIN session cookie |
| `POST /api/pin/login` | IP lockout after 5 failures |

### Session token
HMAC-SHA256 signed, base64url encoded. Payload: `{ ts, sid, sn, ph }` where `sid` = staff UUID, `sn` = staff name, `ph` = SHA256 of their PIN. On every request `verifyAuthToken` fetches the staff row and checks both `active = TRUE` and that `pin_hash` still matches `ph`. Changing a PIN or deactivating a barber takes effect on the next API call — no waiting for TTL expiry. 8-hour TTL, `httpOnly`/`secure`/`sameSite=lax`.

### Atomic charge
The charge UPDATE uses `WHERE balance_cents >= amountCents` in a single statement. Two simultaneous charges on the same card — only one wins. No SELECT-then-UPDATE pattern.

### Rate limiting
All rate limiting is DB-backed via the `rate_limit_hits` table — persistent across Vercel cold starts and edge node restarts.

| Endpoint | Limit |
|---|---|
| Balance check | 10 req/min per IP |
| Checkout | 5 req/min per IP |
| PIN login | 5 failures/15min per IP (via `pin_attempts`) |

### Known limitations
- No PIN change audit log — who changed a PIN and when is not recorded (future: `pin_history` table)
- No short-lived signed URLs for balance links (acceptable for current scale)

---

## Future Work

| Item | Priority | Notes |
|---|---|---|
| Per-staff PINs or logins | ~~High~~ **Done** | `staff` table with SHA256'd PINs. Each barber has their own credential. Transactions note `POS-XXXXXXXX / Name`. Deactivating or changing a PIN takes effect immediately. |
| Admin audit log | High | Log PIN changes, manual credits, any admin action with timestamp + IP |
| PIN change history | Medium | Add `pin_history` table: changed_at, changed_by_ip. Answers "who changed Jim's PIN last month?" |
| Dormancy fee legal review | Blocker | **Do not enable the cron job until verified against Ohio gift card law and applicable federal regs.** |

---

## Dormancy Fee

Implemented but **not yet enabled** — requires legal review before the cron is activated (see Future Work above).

Logic: $2.50/month applied to cards with no activity for 24+ consecutive months. Each fee is logged as a `dormancy_fee` transaction. Any redemption or credit resets the 24-month clock (`last_activity_at`).

**Important:** the fee is charged once per cron run. The cron must be scheduled monthly — if run daily, a dormant card would lose $2.50/day until depleted. Verify the schedule before enabling.

**Example lifecycle:**
```
Purchase $50       → balance: $50.00
Spend $35          → balance: $15.00  (clock resets)
24 months pass
Month 1 fee        → balance: $12.50
Month 2 fee        → balance: $10.00
Customer returns, spends $5 → balance:  $5.00  (clock resets — no more fees for 24 months)
```

---

## Code Format

`SIED-XXXX-XXXX-XXXX` — 12 characters from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (no 0, 1, I, O to avoid visual ambiguity). 32 characters × 12 positions = 32¹² ≈ **1.15 quintillion** combinations.

---

## Key Files

| File | Purpose |
|---|---|
| `src/components/GiftPanel.tsx` | Purchase UI |
| `src/app/api/gift-card/checkout/route.ts` | Stripe session creation |
| `src/app/api/gift-card/webhook/route.ts` | Post-payment fulfillment |
| `src/app/api/gift-card/balance/route.ts` | Customer balance check |
| `src/app/redeem/page.tsx` | Staff POS UI |
| `src/app/api/redeem/lookup/route.ts` | PIN-gated card lookup |
| `src/app/api/redeem/charge/route.ts` | PIN-gated charge |
| `src/app/api/pin/login/route.ts` | PIN auth + session cookie |
| `src/lib/gift-cards.ts` | DB operations (create, charge, credit, dormancy, ledger) |
| `src/lib/pin-auth.ts` | `findStaffByPin`, token create/verify (async), lockout logic |
| `db/seed-staff.sql` | Template for adding barbers to the `staff` table |
| `src/lib/rate-limit.ts` | DB-backed sliding-window rate limiter |
| `src/lib/email.ts` | Gift card email, buyer receipt, shop notification |
| `db/schema.sql` | Full DB schema + migration comments |
