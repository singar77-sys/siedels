# File Summaries

Read these before reaching for the actual files — most questions are answered here.

---

## `src/app/globals.css`

1654-line design system. **Do not read this file for token values — they're listed below.**

**CSS variables (key ones):**
- `--ink` — primary dark text color
- `--surface` — background surface color
- `--red: #E31B23` — Siedel's brand red
- `--text` — body text color
- Dual theme: light (warm tan palette) and dark, toggled via `[data-theme]` or `.dark` class

**Feature systems baked into this file:**

**Team sport modes** (toggled by JS class on `<body>`):
- `.tribe` — Cleveland Guardians palette
- `.cavs` — Cavaliers palette
- `.price` — retro Cavs (Price-era) palette
- `.browns` — Browns palette

**Easter eggs:**
- `.italy` — pizza cursor, Lobster font, Italian flag color accents
- `.sacrifix` — (mystery mode)
- `.lgbtq` — pride palette

**Weather effects** (JS-driven class on `<body>`):
- `.snow`, `.rain`, `.fog`, `.lightning`

**Gallery Wall:** proximity-reactive halftone spotlight effect — an SVG filter applied to gallery images that reacts to mouse proximity.

**Baseball card flip animations:** 1986 Topps homage — used for the team member cards. Front shows headshot, back shows stats/bio. Triggered by click/touch.

**Honeycomb background:** SVG honeycomb grid pattern with a CSS `@keyframes` breathing pulse animation. Used as the site background texture.

---

## `src/data/shop.ts`

352-line constants file — single source of truth for all shop data. **Read this instead of asking about any shop facts.**

**Key constants:**
- `TEAM_COUNT = 11`
- `RATING = '4.9'`
- `REVIEW_COUNT = '249'`

**Team members (11 total):** Each has:
- `name`, `title`, `image` (public path), `bookingUrl` (Square), `bio`, `specialties: string[]`

**Services (12 total):**
- Price range: `$23` – `$96`
- Each has: `name`, `price`, `description`, `includes: string[]`, `duration` (minutes)

**Other data:**
- `PHONE`, `ADDRESS`, social links (Instagram, Facebook, Google)
- `HOURS` — weekly schedule object
- `TESTIMONIALS` — 10 customer quotes with name/rating
- `GALLERY_ITEMS` — 18 items with image path + caption

**Square booking:** Each team member has their own booking URL. The generic "book now" CTA uses the shop's base Square URL.

---

## `src/components/HomeClient.tsx`

338-line client component — the entire site is a horizontal-scroll single-page layout.

**5 panels (left → right):**
1. `HOME` — hero section
2. `TEAM` — team grid with baseball card flip modals
3. `SERVICES` — service cards with pricing
4. `WORK` — gallery / portfolio
5. `CONTACT` — contact form + hours + map

**Navigation:**
- Desktop: progress track nav (vertical dots/labels on the right edge, highlights active panel)
- Mobile: bottom navigation bar (icon + label for each panel)
- Keyboard: left/right arrow keys scroll between panels
- Scroll snapping via CSS `scroll-snap-type`

**Panel tracking:** `IntersectionObserver` watches panel elements and updates active panel state as they scroll into view.

**Modals:**
- Team member modal — opens on card click, shows baseball card flip (front: photo, back: bio + specialties + booking link)
- Service modal — opens on service card click, shows full service details (includes, duration, book CTA)

**Data source:** All team/service/gallery data comes from `src/data/shop.ts`. Do not hardcode any names, prices, or booking URLs — always import from shop.ts.
