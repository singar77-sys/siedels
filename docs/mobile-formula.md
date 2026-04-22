# Mobile Formula — Siedel's Barbershop

The pattern established in the home + contact pass. Apply this when mobilizing remaining pages (services, team).

---

## Core Constraints

| Dimension | Value | Why |
|-----------|-------|-----|
| Mobile header height | `h-[6rem]` (96px) | Logo is 2.23:1 — at width 180 it's 81px tall |
| Bottom nav height | `h-14` (56px) | 6 tabs × flex-1, BOOK in red |
| Available viewport | `dvh - 152px` | 96px header + 56px bottom nav |
| Min tap target | `44px` | `min-h-[44px]` on all interactive elements |
| Mobile horizontal padding | `px-4` (16px) | `px-8` is thumb-unfriendly at 375px |

---

## Layout Primitives

### One-Thing-Per-Viewport
Each snap panel should lead with its main payload at the top of the scroll. Header and eyebrow copy compress on mobile to give content priority:
- Eyebrow labels: `mb-2 md:mb-4` (not mb-6)
- Section headings: `text-3xl md:text-6xl` (not text-4xl on mobile)
- Section padding: `py-8 md:py-24` (not py-16 as baseline)

### Card Stack Pattern
On mobile, every multi-column grid becomes a single vertical stack of cards:
```
grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16
```
Each card gets:
- `bg-surface border-l-4 border-red p-5 md:p-6`
- Full-width on mobile
- `min-h-[44px]` on all tappable elements

### CTA Buttons on Mobile
Always full-width on mobile, auto-width on sm+:
```
flex flex-col gap-3 sm:flex-row sm:gap-4
```
Individual buttons:
```
flex items-center justify-center ... min-h-[44px]
```
Remove `inline-flex` for mobile-full-width buttons; use `flex` instead.

---

## Navigation

### Home Page (snap-scroll)
- Bottom sticky nav: 5 panel tabs (dots + labels) + red BOOK button
- No hamburger — bottom nav IS the mobile nav
- `PANEL_SHORT` maps full labels to 4-char abbreviations
- Desktop footer is `hidden md:flex`; mobile footer is the bottom nav

### Sub-pages (/contact, /services, /team)
- Nav.tsx top bar remains (80px, acceptable)
- Sticky bottom BOOK NOW button (fixed, z-50) with `pb-20 md:pb-0` on `<main>`
- Pattern: `fixed bottom-0 left-0 right-0 z-50 p-3 bg-ink/95 backdrop-blur-sm`

---

## Typography Scale on Mobile

| Element | Mobile | Desktop |
|---------|--------|---------|
| Hero h1 | `text-5xl` (3rem) | `text-8xl` (6rem) |
| Page hero h1 | `text-3xl` | `text-7xl` |
| Panel h2 | `text-3xl` | `text-6xl` |
| Body | `text-base` | `text-xl` |
| Eyebrow | `text-[11px]` | unchanged |

---

## Spacing Scale on Mobile

| Spacing | Mobile class | Desktop class |
|---------|-------------|---------------|
| Panel top padding | `pt-4` | `pt-32` |
| Panel bottom padding | `pb-8` | `pb-24` |
| Section vertical padding | `py-8` | `py-24` |
| Horizontal content padding | `px-4` | `px-8` |
| Heading → content gap | `mb-4` | `mb-8` |
| Eyebrow → heading | `mb-3` | `mb-6` |

---

## Background Effects on Mobile

- **Halftone gallery spotlight**: Works fine on mobile; already uses `is-static` class on touch devices (GalleryPanel.tsx)
- **Ken Burns**: Runs on all — fine, GPU-composited
- **Review ticker**: `hidden md:block` — scrolling marquee is broken-feeling on mobile, cut it
- **Weather ambience**: Unchanged — ambient, not interactive

---

## TODO: Remaining Pages

- [ ] **`/services`** — Apply card stack to service list; sticky BOOK button; `ServicesList.tsx` has `px-8` that needs `px-4 md:px-8`; FAQ accordion tap targets need min-h-[44px]
- [ ] **`/team`** — TeamGrid card sizing on mobile; 3-col grid may be too cramped; consider 2-col on mobile with `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- [ ] **Thanks pages** — Low priority; mostly text; verify no overflow

---

## Checklist Before Shipping Any Page

- [ ] No horizontal scroll (check `overflow-x` at 375px, 390px, 430px)
- [ ] All interactive elements ≥ 44px tall
- [ ] Hero/page title not clipped at top
- [ ] `px-4 md:px-8` on all content containers
- [ ] CTAs full-width on mobile
- [ ] No ticker or heavy horizontal scroll components visible on mobile
- [ ] Sticky BOOK button present on sub-pages
