# Siedel's — The Actual Fix List

> Distilled from 7 audit skills (Entries 21–27 in `hunter-fixes.md`). Stripped: everything related to custom domain (coming) and analytics (post-launch). What remains is code, copy, and strategic choices — no theater.

---

## 🔴 CRITICAL — fix before next deploy

**C1. `/services` FAQ contradicts itself on payment.**
- File: `src/app/services/page.tsx` lines 20–26
- "Do you take cards?" → "Cash only. There is an ATM on site."
- "What payment methods do you accept?" → "Cash and all major credit cards."
- On the same page. Loses the sale at the counter.
- **Fix:** delete the credit-card row. Keep cash-only. 2 minutes.

---

## 🟠 HIGH — real bugs, real consequences

**H1. Pierre's bio math is wrong.**
- `src/data/shop.ts` — Pierre: "26 years behind the chair. Barber school graduate, class of 2003."
- 2026 − 2003 = **23**, not 26.
- **Fix:** update one number. Pick the real one.

**H2. `/api/subscribe` is wide open.**
- `src/app/api/subscribe/route.ts` — only validation is `typeof body.email !== 'string'`.
- No rate limit, no honeypot, no email regex. One `curl` loop empties the Formspree quota.
- **Fix:** add honeypot + basic rate limit, OR delete the form entirely (see strategic decision S2).

**H3. Service prices live in 3 places.**
- `src/data/shop.ts` (source of truth)
- `src/app/services/page.tsx` lines 20–26 (FAQ hardcoded: "Haircut $32", "Fades $38", etc.)
- `src/app/services/page.tsx` line 16 (OG description hardcoded)
- Change one, the other two rot silently.
- **Fix:** bind FAQ + OG to the `services` array. Kill hardcoded prices.

**H4. `/schedule` copy contradicts code.**
- Body copy: "Updated weekly"
- Code: `export const revalidate = 1800` (30 min)
- **Fix:** replace "Updated weekly" with the existing `SCHEDULE LAST SYNCED {fetchedAt}` timestamp (already rendered below). Delete the weekly line.

**H5. JSON-LD hours scope missing Sunday.**
- `src/app/layout.tsx` lines 81–88 — only lists Mon–Sat.
- `src/data/shop.ts` hours array includes Sunday (Closed).
- Google treats omission as "no data" not "closed." Add it.
- **Fix:** add `{ dayOfWeek: 'Sunday', opens: '00:00', closes: '00:00' }` OR add it with an explicit closed marker per Schema.org spec.

**H6. `aggregateRating: 4.9 / 249` is hardcoded.**
- `src/app/layout.tsx` line 89.
- Will be wrong by next month. SEO ages like milk.
- **Fix:** either fetch from Google Places API at build, or set a monthly manual refresh reminder.

---

## 🟡 MEDIUM — code health, consistency, performance

**M1. Slug logic duplicated.**
- Same `name.split(' ')[0].toLowerCase()` in `/thanks/page.tsx` and `/thanks/[slug]/page.tsx`.
- Two barbers share a first name → silent collision.
- **Fix:** extract `slugFromName()` into `src/lib/utils.ts`. Handle collision.

**M2. HomeClient monolith duplicates the sub-routes.**
- Home page stuffs services + team + schedule + contact panels into one client component.
- Those routes also exist independently.
- The site ships itself twice. See strategic decision S1.

**M3. Material Symbols Outlined icon font blocks first paint.**
- `src/app/layout.tsx` line 99 — `<link rel="stylesheet">` for the whole Google icon foundry.
- Used for ~4 arrows.
- **Fix:** inline 4 SVGs. Delete the link.

**M4. Dual reactCompiler config in `next.config.ts`.**
- Has both `babel-plugin-react-compiler` AND `experimental.reactCompiler: true` (verify).
- Belt-and-suspenders — one will eventually fight the other.
- **Fix:** pick one, delete the other.

**M5. Square widget `<Script>` loads on every route.**
- `src/app/layout.tsx` lines 112–115 — loads the shop-level widget script globally, including on `/thanks/*` where it's not used.
- **Fix:** move the `<Script>` into the routes that actually render Square iframes, or wrap in intersection-based lazy load.

**M6. Two theme systems for one boolean.**
- `ThemeProvider` React component + inline pre-hydration localStorage IIFE.
- One of them is redundant.
- **Fix:** keep the inline script (kills the flicker), reduce the provider to a no-op or delete.

**M7. `/schedule` shows barbers but doesn't link to their bookings.**
- Roster table renders names, no anchor to `member.booking`.
- User sees who's working but can't one-tap-book.
- **Fix:** wrap each name in its `member.booking` link. Or decide it's availability-only (see S4).

**M8. `package.json` description is aspirational fanfic.**
- `"Siedels - Barber Marketplace Platform"` — there is no marketplace, there is no platform.
- **Fix:** `"Siedel's Barbershop — Medina, Ohio"`.

**M9. Phone format drift.**
- `PHONE_HREF = 'tel:3309520777'` (no country code)
- JSON-LD `telephone: '+13309520777'` (E.164)
- Ringcentral / iOS sometimes need the `+1`.
- **Fix:** standardize on `tel:+13309520777` everywhere.

**M10. `Shampoo + Style $25+` range-open price.**
- `src/data/shop.ts` line 238.
- JSON-LD claims `priceRange: "$5–$96"` (closed).
- **Fix:** commit to a number or a real closed range.

**M11. Staff count / type drift on `/team`.**
- Meta description: "11 barbers and stylists on staff"
- Page subtitle: "Eleven barbers"
- What's a "stylist" here? Pick one word.

**M12. Page title format drift.**
- Every route: `"<Page> | Siedel's Barbershop | Medina, Ohio"` (pipe)
- `/thanks` + `/thanks/[slug]`: `"Thanks — Siedel's Barbershop"` (em dash, no location)
- **Fix:** standardize on the pipe format, OR accept the dash as a deliberate "internal page" signal and document it.

---

## 🟢 LOW — polish, copy, launch prep

**L1. Copy slop (from stop-slop audit).**
Line-by-line rewrites:

| Where | Before | After |
|---|---|---|
| `/thanks` subtitle | Tap your barber. Drop a quick Google review. It helps the whole crew. | Pick your barber. Leave a review. |
| `/thanks/[slug]` body | Your review helps the whole crew. If {firstName} made your day, mention them by name. | If {firstName} made your day, mention them by name. |
| `/services` FAQ | There is an ATM on site. | We have an ATM. |

**L2. Privacy Policy route missing.**
- Needed if the newsletter form stays (Formspree TOS + CCPA/GDPR soft risk).
- Moot if the form dies (S2).

**L3. Address keyword drift.**
- `layout.tsx` keywords list has "Court Street" but not "N Court Street."
- Real searches use both. Add "N Court Street" to the keyword array.

**L4. Branded 404 page not verified.**
- Check `src/app/not-found.tsx` exists. Default Next.js 404 is functional but bland.

**L5. Favicon not verified in head.**
- `manifest.json` is linked. May be auto-generated from `/app/icon.png`. Verify in production.

**L6. Pre-ship grep.**
- Run `grep -ri "lorem\|TODO\|FIXME\|XXX" src/` before the next deploy. Catches leftover dev notes.

**L7. Image weight audit.**
- Verify portrait files in `/public/images/team/` are each < 200 KB.

---

## 🎯 STRATEGIC DECISIONS — not bugs, choices

None of these are wrong. Each one is a fork. Pick one side and commit.

**S1. HomeClient monolith vs sub-routes — pick one.**
- **Option A:** Keep home as a proper landing page (hero + CTAs pointing to sub-routes). Delete the in-page panels. `/team`, `/services`, etc. become the source of truth.
- **Option B:** Keep home as the one-pager and delete the sub-routes (or make them redirects to `/#team`, `/#services`, etc.).
- Can't have both without shipping the site twice.

**S2. Newsletter form — keep or kill.**
- **Keep:** add rate limit + honeypot + privacy policy. ~45 min work.
- **Kill:** delete the form, delete `/api/subscribe`, delete the Formspree dep. ~5 min work.
- Honest question: does the shop have an email funnel? If no, the form is cosmetic. Kill it.

**S3. `/contact` route — keep or fold.**
- **Keep:** make it the canonical "how to reach us" page. Fix the FAQ contradiction there too.
- **Fold:** fold address + phone + hours into a 200px hero strip on home. Delete `/contact`.
- Depends on S1.

**S4. `/schedule` — booking page or info page.**
- **Booking page:** link every barber name to their `member.booking`. Make it the primary conversion route.
- **Info page:** keep it as an availability view only. Remove any booking expectation from the copy.

**S5. Theme toggle — dual or single.**
- **Dual:** ship the light/dark toggle as-is. Fix M6 to have one implementation.
- **Single:** delete light mode. The shop has one mood. Less code, stronger brand.

---

## 🔥 HUNTER UPGRADES — not bugs, competitive features

None of these are required. All of them compound. Pick the top two and ship them.

**U1. Live `OPEN · CLOSES IN N MIN` pill in the hero.**
- Data already exists in `shop.ts hours`. Compute against `Date.now()`. Render server-side.
- ~1 hour of code. Every visitor knows immediately: is this shop real right now?

**U2. Next-available-slot above the fold.**
- Query Square availability across all 11 calendars at build. Render soonest open slot as the primary CTA.
- *"Next chair: Tony, 3:40pm today — book"* beats `BOOK NOW` by an order of magnitude.
- ~4 hours of code if Square's availability API cooperates.

**U3. Mobile sticky `[BOOK] [CALL]` bottom bar.**
- Fixed, 64px tall, below 768px viewport only.
- ~30 min of code. Every barbershop visitor is on a phone.

**U4. Pre-fill the Google review on `/thanks/[slug]`.**
- Currently deep-links to the review URL. Pass the barber's first name in the prefill param so the review opens with their name already mentioned.
- ~15 min of code.

**U5. Returning-visitor cookie for "Welcome back."**
- First visit books Tony → cookie remembers → next visit hero reads *"Welcome back. Tony's next slot is 4:20pm."*
- ~30 min. Edge-personalization for free.

---

## THE ONE-PAGE PUNCH LIST

For the next work session, in order:

- [ ] C1 — kill the credit-card FAQ row (2 min)
- [ ] H1 — fix Pierre's year math (2 min)
- [ ] H4 — delete "Updated weekly," promote the existing timestamp (3 min)
- [ ] H5 — add Sunday to JSON-LD hours (5 min)
- [ ] M3 — inline 4 SVGs, delete Material Symbols link (30 min)
- [ ] M8 — fix package.json description (1 min)
- [ ] M9 — standardize phone to `tel:+13309520777` (5 min)
- [ ] S2 — decide: keep or kill newsletter. Commit. (decision, then 5–45 min)
- [ ] H3 — bind FAQ + OG prices to `services` array (20 min)
- [ ] M1 — extract `slugFromName()` helper (10 min)
- [ ] L1 — apply the three copy rewrites (5 min)

**Total: under 2 hours of real work to clear the critical and high stack.**

The rest (M/L items + strategic decisions + hunter upgrades) can ship in a second session or across two weekends of 1-hour blocks.

---

**Master reference:** `hunter-fixes.md` — all 27 entries intact. This file is the surgery sheet.
