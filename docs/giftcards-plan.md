# Siedel's Digital Gift Cards — Integration & Promotion Plan

**Owner:** Hunter Systems
**Client:** Siedel's Barbershop, Medina OH
**Status:** Template v1
**Revenue model:** Stripe Connect platform, 1% application fee (drip), 2.9% + $0.30 pass-through to Stripe

---

## 1. Strategic Frame

Siedel's runs appointments through Square. We don't touch that. Gift cards are a **new channel that does not exist today** — which means every dollar it generates is a dollar we created, and every straw we insert is ethically ours.

**What we own:** the storefront, the checkout, the payment rail, the database of cards, the redemption dashboard, the email delivery.

**What Siedel's owns:** the money (minus the 1% platform fee and Stripe's processing), the customer relationship, the redemption at the chair.

**Why this works for Jim:**
- Breakage (unredeemed balances) industry average is 10–15% → pure profit
- New revenue channel with zero inventory risk
- Father's Day, Christmas, birthdays, "sorry I forgot" emergencies all become Siedel's revenue
- Corporate/bulk orders from local Medina businesses in Q4

**Why this works for us:**
- 1% of every gift card purchase drips forever
- Same codebase redeploys to shop #2, shop #3, …
- Proves the Hunter Systems platform model to the next prospect

---

## 2. Integration Architecture

### 2.1 Payment Rail
- **Stripe Connect — Standard accounts** (Siedel's onboards with their own Stripe account, we sit on top as platform)
- **Application fee:** 1.0% set in code, never in the contract, never in the dashboard Jim sees day-to-day
- **Fee disclosure:** Stripe's standard connected-account disclosures handle it. No separate line item, no invoice, no conversation.

### 2.2 Stack
| Layer | Tech | Notes |
|---|---|---|
| Storefront page | Next.js route `/gift-cards` on siedelsbarbershop.com | Same repo, same deploy |
| Checkout | Stripe Checkout (hosted) with `application_fee_amount` | Hosted = PCI-compliant by default, no card handling |
| Card storage | Postgres (Supabase) or Vercel Postgres | `gift_cards` table with code, balance, issued_to, redemption_log |
| Code generation | Crypto-random 16-char alphanumeric, uppercase, dashed (e.g. `SIED-3F9K-7X2M-QR4P`) | Unique constraint, collision retry |
| Email delivery | Resend or Postmark | Branded HTML email with code + redeem instructions |
| Redemption dashboard | `/admin/redeem` — password-gated, mobile-first | Staff opens on phone/tablet at chair |
| Reporting | Simple admin page showing sold / redeemed / outstanding balance | Jim checks once a week |

### 2.3 Database Schema (minimum viable)
```
gift_cards
  id                uuid pk
  code              text unique (indexed)
  initial_amount    int (cents)
  current_balance   int (cents)
  purchaser_email   text
  purchaser_name    text
  recipient_email   text
  recipient_name    text
  message           text
  stripe_session_id text
  issued_at         timestamp
  expires_at        timestamp (nullable — Ohio rules, see §2.6)

redemptions
  id              uuid pk
  gift_card_id    uuid fk
  amount          int (cents)
  redeemed_by     text (staff name from dashboard login)
  redeemed_at     timestamp
  note            text
```

### 2.4 Customer Purchase Flow
1. Visitor lands on `/gift-cards` from homepage nav or promo banner
2. Picks denomination ($25 / $50 / $75 / $100 / custom min $25)
3. Enters: their name + email, recipient name + email, optional personal message, optional send date
4. Hits "Continue to checkout" → Stripe Checkout session created with `application_fee_amount = amount * 0.01`
5. Pays → Stripe webhook fires → we create the gift card record, generate code, send email to recipient (or schedule for send date)
6. Purchaser gets separate receipt email with their copy

### 2.5 Redemption Flow (the friction point — must be dead simple)
1. Customer arrives at Siedel's with code (email, screenshot, or printed)
2. Barber/front desk opens `/admin/redeem` on tablet or phone (bookmark)
3. Enters code → sees balance
4. Does the cut, rings the customer out on Square as normal
5. At the end, enters redemption amount → balance updates → marks redeemed
6. Staff manually applies a matching "gift card" discount in Square (or processes as cash equivalent, Jim's call on reconciliation method)

**Critical:** Train staff before launch. A gift card system that creates checkout friction will be abandoned. Keep the redemption screen under 3 taps.

### 2.6 Legal / Compliance
- **Ohio gift card law (ORC 1349.61):** No expiration earlier than 2 years from issue, no service/dormancy fees for 2 years. Build expiration as optional and default to null (no expiration) to stay safe.
- **Terms page:** `/gift-cards/terms` with: non-refundable, not redeemable for cash, lost cards not replaceable without proof of purchase, partial redemptions allowed, valid at Siedel's Barbershop locations only.
- **Receipts:** Stripe sends its own. We also send our branded confirmation.

### 2.7 Admin Access
- Single shared staff password initially (simple, Jim approves)
- Optional: per-staff accounts later for redemption audit trail
- Mark as protected route in Next.js middleware

---

## 3. Build Checklist

- [ ] Stripe Connect platform account created under Hunter Systems
- [ ] Siedel's onboarded as Standard connected account (Jim completes Stripe KYC)
- [ ] Database provisioned (Supabase free tier is fine to start)
- [ ] `/gift-cards` page designed in Barlow Condensed / dark tactical aesthetic
- [ ] Denominations + custom amount UI
- [ ] Recipient form with optional scheduled send
- [ ] Stripe Checkout integration with `application_fee_amount`
- [ ] Webhook handler: `checkout.session.completed` → create card, generate code, trigger email
- [ ] Branded gift card email template (HTML + plain text fallback)
- [ ] Scheduled send worker (if picking future date, queue with Vercel Cron or Upstash)
- [ ] `/admin/redeem` dashboard (password-protected, mobile-first)
- [ ] `/admin/report` simple sales + outstanding balance view
- [ ] `/gift-cards/terms` page
- [ ] Homepage nav link + footer link + dedicated promo card on home
- [ ] Staff training doc (one page, printable)
- [ ] Pre-launch test: buy a card with real $, redeem at shop, verify full loop

---

## 4. Promotion Plan

### 4.1 Launch Timing
- **Ship by April 30** to catch Mother's Day (May 10) and Father's Day (June 21)
- Father's Day is the biggest barber gift-giving moment of the year — don't miss it

### 4.2 Primary Hook
**"Give the gift of a fresh cut."** Clean, direct, doesn't overexplain. Works in every format.

Alternate angles by audience:
- **For partners:** "He knows exactly how he likes it. Siedel's does too."
- **For last-minute buyers:** "Instant delivery. Print it, text it, forward it."
- **For corporate/bulk:** "Take care of your crew. Bulk gift cards for local businesses."
- **For the guy himself:** "Stock up for the year. Ten cuts, one code." (bridges into the 10-pack product later)

### 4.3 Channel Plan

| Channel | Asset | Priority | Notes |
|---|---|---|---|
| Homepage promo card | Dark card on home with barber-pole photo + "GIVE THE GIFT OF A FRESH CUT" → `/gift-cards` | P0 | Swap in before Mother's Day push |
| Nav link | "GIFT CARDS" in main nav + footer | P0 | Permanent |
| Google Business Profile post | Photo of a printed card + CTA link | P0 | Free, high-intent local traffic |
| Instagram post + reel | Short reel: barber hands a wrapped card, tagline, URL in bio | P0 | Shoot at shop, 20 seconds max |
| In-shop signage | 11×17 poster at each station + front desk card | P0 | QR code direct to `/gift-cards` |
| Email to existing customer list | If Jim has any list — Mailchimp or just BCC — announce launch | P1 | "Siedel's gift cards are live" |
| SMS to repeat customers | If they have numbers on file with consent — short blast before Father's Day | P1 | "Father's Day is Sunday. Siedel's gift cards ship instantly: [link]" |
| Local Medina Facebook groups | Jim or staff posts in the community group | P1 | Community-native, no ads |
| Google Ads (optional) | $50–100/wk targeted "Medina barbershop gift card" + "Father's Day gift ideas Medina" | P2 | Only after organic is working |
| Corporate outreach | 1-page PDF to 20 Medina businesses for Q4 bulk buys | P2 | Start in October |

### 4.4 Seasonal Drumbeat

| Month | Push |
|---|---|
| **May** | Mother's Day soft launch ("for the dad in her life") + Father's Day ramp |
| **June** | Father's Day all-in — homepage takeover, stories, reels, signage |
| **July–August** | Back-to-school ("first day of school fade") |
| **September–October** | Birthday season + corporate outreach begins |
| **November** | Black Friday: bonus $10 card with every $50 purchase (breakage math still favors Siedel's) |
| **December** | Christmas push — expedite digital delivery messaging |
| **Jan–Feb** | Valentine's ("treat yourself" + "for him") |

### 4.5 Copy Library (ready to use)

**Hero, long:**
> GIVE THE GIFT OF A FRESH CUT
> Siedel's gift cards deliver instantly by email. Choose the amount, add a note, send it in sixty seconds. Redeemable for any service at Siedel's Barbershop — cuts, shaves, fades, the works. Since day one, on Court Street.

**Hero, short:**
> A FRESH CUT, READY TO GIVE.
> Delivered instantly. Good for everything on the menu.

**Social caption — Father's Day:**
> Dad doesn't need another tie. Siedel's gift cards, delivered instant. Link in bio.

**Email subject lines:**
- "A fresh cut, ready to give."
- "Father's Day is Sunday. We've got you."
- "Siedel's gift cards are live."
- "Last-minute gift? Siedel's delivers in 60 seconds."

**Bulk/corporate outreach (cold email to local business):**
> Subject: Holiday gifts for your crew — Siedel's Barbershop
>
> Hey [Name] — quick note. We're running corporate gift cards for Siedel's this holiday season. $50 or $100 per employee, delivered digitally, no shipping headaches. Most local shops do 10–50 employees. Takes me about 5 minutes to set up. Want me to send over a sample?
>
> — Jim

### 4.6 Visual Assets Needed
- 1 hero photo: barber pole or a stacked barber tray (we have these)
- 1 "digital card" mockup — branded Siedel's gift card graphic for social + email hero
- 1 reel: 15–20 seconds, barber workflow intercut with the gift card text overlay
- 1 printable 11×17 poster for in-shop
- 1 business-card-sized takeaway with QR code for the front desk

---

## 5. Success Metrics

**Month 1 target:** $2,000 in gift card sales ($20 drip)
**Month 3 target:** $4,000/month run rate ($40 drip)
**Father's Day week target:** $3,000 in that week alone
**Year 1 target:** $40,000 total volume ($400 drip to Hunter Systems)

Track weekly:
- Cards sold (count + dollar volume)
- Average denomination
- Redemption rate vs. outstanding balance (breakage signal)
- Traffic to `/gift-cards` (Vercel Analytics)
- Conversion rate (sessions → purchase)

---

## 6. Open Decisions

1. **Denominations:** $25 / $50 / $75 / $100 + custom, or simpler $25 / $50 / $100?
2. **Expiration:** Default to none (Ohio compliant + friendlier), or set 2 years?
3. **Redemption workflow:** Does Jim want a tablet at the front desk, or just staff phones?
4. **Branding on the email card:** Siedel's red + logo on a dark background, or a lighter/gift-y treatment?
5. **Corporate orders:** Handled through the same form or a dedicated `/gift-cards/corporate` with a contact request?
6. **Square reconciliation:** How does Jim want redemptions recorded in Square — as discount, as "house account" category, or something else? This needs a 10-minute call with him.

---

## 7. Next Actions (in order)

1. **Walk Jim through this doc** — get buy-in on the model, confirm Stripe Connect onboarding
2. **Decide open questions in §6**
3. **Build `/gift-cards` landing page** (2 days)
4. **Wire Stripe Checkout + webhook + DB** (2 days)
5. **Build `/admin/redeem` dashboard** (1 day)
6. **Design email template + gift card graphic** (1 day)
7. **Staff training + dry run** (half day)
8. **Ship + announce** (Mother's Day week)
