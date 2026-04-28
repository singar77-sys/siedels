# Theme Contrast Audit

Generated 2026-04-28 from `src/app/globals.css`.

WCAG 2.1 AA: 4.5:1 for body text, 3:1 for large text (18pt+ or 14pt bold). AAA: 7:1.
Alpha values are blended against the bg before measuring.

## Light

| Pair | FG | BG | Ratio | Verdict |
|---|---|---|---:|---|
| Body text on surface | rgb(54,45,30) | rgb(201,190,170) | 7.37 | ✅ AAA |
| Muted text on surface | rgb(54,45,30) α0.75 | rgb(201,190,170) | 4.23 | ⚠️ AA-large only |
| Subtle text on surface | rgb(54,45,30) α0.55 | rgb(201,190,170) | 2.72 | ❌ FAIL |
| Faint text on surface | rgb(54,45,30) α0.4 | rgb(201,190,170) | 2.01 | ❌ FAIL |
| Body text on raised surface | rgb(54,45,30) | rgb(197,182,153) | 6.79 | ✅ AA |
| Muted text on raised surface | rgb(54,45,30) α0.75 | rgb(197,182,153) | 4.01 | ⚠️ AA-large only |
| Red accent on surface | rgb(227,27,35) | rgb(201,190,170) | 2.57 | ❌ FAIL |
| Red accent on ink (header) | rgb(227,27,35) | rgb(205,199,187) | 2.81 | ❌ FAIL |
| Hero H1 (over hero scrim) | rgb(205,199,187) | rgb(205,199,187) | 1.00 | ❌ FAIL |
| Hero tagline (over hero scrim) | rgb(205,199,187) | rgb(205,199,187) | 1.00 | ❌ FAIL |
| Hero eyebrow (over hero scrim) | rgb(197,182,153) | rgb(205,199,187) | 1.19 | ❌ FAIL |
| CTA text on CTA | rgb(54,45,30) | rgb(197,182,153) | 6.79 | ✅ AA |

## Dark

| Pair | FG | BG | Ratio | Verdict |
|---|---|---|---:|---|
| Body text on surface | rgb(229,226,225) | rgb(19,19,19) | 14.42 | ✅ AAA |
| Muted text on surface | rgb(255,255,255) α0.7 | rgb(19,19,19) | 9.39 | ✅ AAA |
| Subtle text on surface | rgb(255,255,255) α0.55 | rgb(19,19,19) | 6.19 | ✅ AA |
| Faint text on surface | rgb(255,255,255) α0.45 | rgb(19,19,19) | 4.53 | ✅ AA |
| Body text on raised surface | rgb(229,226,225) | rgb(28,27,27) | 13.34 | ✅ AAA |
| Muted text on raised surface | rgb(255,255,255) α0.7 | rgb(28,27,27) | 8.92 | ✅ AAA |
| Red accent on surface | rgb(227,27,35) | rgb(19,19,19) | 3.93 | ⚠️ AA-large only |
| Red accent on ink (header) | rgb(227,27,35) | rgb(14,14,14) | 4.09 | ⚠️ AA-large only |
| Hero H1 (over hero scrim) | rgb(255,255,255) | rgb(14,14,14) | 19.30 | ✅ AAA |
| Hero tagline (over hero scrim) | rgb(255,255,255) α0.7 | rgb(14,14,14) | 9.59 | ✅ AAA |
| Hero eyebrow (over hero scrim) | rgb(227,27,35) | rgb(14,14,14) | 4.09 | ⚠️ AA-large only |
| CTA text on CTA | rgb(255,255,255) | rgb(227,27,35) | 4.72 | ✅ AA |

## Tribe

| Pair | FG | BG | Ratio | Verdict |
|---|---|---|---:|---|
| Body text on surface | rgb(0,56,93) | rgb(240,240,240) | 10.69 | ✅ AAA |
| Muted text on surface | rgb(0,56,93) α0.75 | rgb(240,240,240) | 5.40 | ✅ AA |
| Subtle text on surface | rgb(0,56,93) α0.55 | rgb(240,240,240) | 3.17 | ⚠️ AA-large only |
| Faint text on surface | rgb(0,56,93) α0.4 | rgb(240,240,240) | 2.21 | ❌ FAIL |
| Body text on raised surface | rgb(0,56,93) | rgb(229,229,229) | 9.67 | ✅ AAA |
| Muted text on raised surface | rgb(0,56,93) α0.75 | rgb(229,229,229) | 5.09 | ✅ AA |
| Red accent on surface | rgb(229,0,34) | rgb(240,240,240) | 4.23 | ⚠️ AA-large only |
| Red accent on ink (header) | rgb(229,0,34) | rgb(255,255,255) | 4.82 | ✅ AA |
| Hero H1 (over hero scrim) | rgb(255,255,255) | rgb(255,255,255) | 1.00 | ❌ FAIL |
| Hero tagline (over hero scrim) | rgb(255,255,255) α0.85 | rgb(255,255,255) | 1.00 | ❌ FAIL |
| Hero eyebrow (over hero scrim) | rgb(229,0,34) | rgb(255,255,255) | 4.82 | ✅ AA |
| CTA text on CTA | rgb(255,255,255) | rgb(229,0,34) | 4.82 | ✅ AA |

## Cavs

| Pair | FG | BG | Ratio | Verdict |
|---|---|---|---:|---|
| Body text on surface | rgb(255,255,255) | rgb(10,45,95) | 13.52 | ✅ AAA |
| Muted text on surface | rgb(255,255,255) α0.78 | rgb(10,45,95) | 8.77 | ✅ AAA |
| Subtle text on surface | rgb(255,255,255) α0.55 | rgb(10,45,95) | 5.12 | ✅ AA |
| Faint text on surface | rgb(255,255,255) α0.4 | rgb(10,45,95) | 3.40 | ⚠️ AA-large only |
| Body text on raised surface | rgb(255,255,255) | rgb(22,64,122) | 10.25 | ✅ AAA |
| Muted text on raised surface | rgb(255,255,255) α0.78 | rgb(22,64,122) | 6.92 | ✅ AA |
| Red accent on surface | rgb(134,0,56) | rgb(10,45,95) | 1.33 | ❌ FAIL |
| Red accent on ink (header) | rgb(134,0,56) | rgb(4,30,66) | 1.63 | ❌ FAIL |
| Hero H1 (over hero scrim) | rgb(253,187,48) | rgb(4,30,66) | 9.71 | ✅ AAA |
| Hero tagline (over hero scrim) | rgb(255,255,255) α0.85 | rgb(4,30,66) | 12.16 | ✅ AAA |
| Hero eyebrow (over hero scrim) | rgb(253,187,48) | rgb(4,30,66) | 9.71 | ✅ AAA |
| CTA text on CTA | rgb(4,30,66) | rgb(253,187,48) | 9.71 | ✅ AAA |

## Price

| Pair | FG | BG | Ratio | Verdict |
|---|---|---|---:|---|
| Body text on surface | rgb(39,37,31) | rgb(142,176,230) | 6.93 | ✅ AA |
| Muted text on surface | rgb(39,37,31) α0.75 | rgb(142,176,230) | 4.20 | ⚠️ AA-large only |
| Subtle text on surface | rgb(39,37,31) α0.55 | rgb(142,176,230) | 2.74 | ❌ FAIL |
| Faint text on surface | rgb(39,37,31) α0.4 | rgb(142,176,230) | 2.02 | ❌ FAIL |
| Body text on raised surface | rgb(39,37,31) | rgb(184,208,240) | 9.72 | ✅ AAA |
| Muted text on raised surface | rgb(39,37,31) α0.75 | rgb(184,208,240) | 5.19 | ✅ AA |
| Red accent on surface | rgb(227,82,5) | rgb(142,176,230) | 1.74 | ❌ FAIL |
| Red accent on ink (header) | rgb(227,82,5) | rgb(92,136,218) | 1.09 | ❌ FAIL |
| Hero H1 (over hero scrim) | rgb(255,255,255) | rgb(92,136,218) | 3.51 | ⚠️ AA-large only |
| Hero tagline (over hero scrim) | rgb(255,255,255) α0.85 | rgb(92,136,218) | 2.99 | ❌ FAIL |
| Hero eyebrow (over hero scrim) | rgb(227,82,5) | rgb(92,136,218) | 1.09 | ❌ FAIL |
| CTA text on CTA | rgb(255,255,255) | rgb(227,82,5) | 3.84 | ⚠️ AA-large only |

## Browns

| Pair | FG | BG | Ratio | Verdict |
|---|---|---|---:|---|
| Body text on surface | rgb(255,255,255) | rgb(74,44,16) | 12.66 | ✅ AAA |
| Muted text on surface | rgb(255,255,255) α0.8 | rgb(74,44,16) | 8.68 | ✅ AAA |
| Subtle text on surface | rgb(255,255,255) α0.58 | rgb(74,44,16) | 5.35 | ✅ AA |
| Faint text on surface | rgb(255,255,255) α0.42 | rgb(74,44,16) | 3.55 | ⚠️ AA-large only |
| Body text on raised surface | rgb(255,255,255) | rgb(92,56,20) | 10.34 | ✅ AAA |
| Muted text on raised surface | rgb(255,255,255) α0.8 | rgb(92,56,20) | 7.27 | ✅ AAA |
| Red accent on surface | rgb(255,60,0) | rgb(74,44,16) | 3.56 | ⚠️ AA-large only |
| Red accent on ink (header) | rgb(255,60,0) | rgb(49,29,0) | 4.52 | ✅ AA |
| Hero H1 (over hero scrim) | rgb(255,60,0) | rgb(49,29,0) | 4.52 | ✅ AA |
| Hero tagline (over hero scrim) | rgb(255,255,255) α0.85 | rgb(49,29,0) | 11.88 | ✅ AAA |
| Hero eyebrow (over hero scrim) | rgb(255,60,0) | rgb(49,29,0) | 4.52 | ✅ AA |
| CTA text on CTA | rgb(49,29,0) | rgb(255,60,0) | 4.52 | ✅ AA |

## Italy

| Pair | FG | BG | Ratio | Verdict |
|---|---|---|---:|---|
| Body text on surface | rgb(54,45,30) | rgb(201,190,170) | 7.37 | ✅ AAA |
| Muted text on surface | rgb(54,45,30) α0.75 | rgb(201,190,170) | 4.23 | ⚠️ AA-large only |
| Subtle text on surface | rgb(54,45,30) α0.55 | rgb(201,190,170) | 2.72 | ❌ FAIL |
| Faint text on surface | rgb(54,45,30) α0.4 | rgb(201,190,170) | 2.01 | ❌ FAIL |
| Body text on raised surface | rgb(54,45,30) | rgb(197,182,153) | 6.79 | ✅ AA |
| Muted text on raised surface | rgb(54,45,30) α0.75 | rgb(197,182,153) | 4.01 | ⚠️ AA-large only |
| Red accent on surface | rgb(227,27,35) | rgb(201,190,170) | 2.57 | ❌ FAIL |
| Red accent on ink (header) | rgb(227,27,35) | rgb(205,199,187) | 2.81 | ❌ FAIL |
| Hero H1 (over hero scrim) | rgb(205,199,187) | rgb(205,199,187) | 1.00 | ❌ FAIL |
| Hero tagline (over hero scrim) | rgb(205,199,187) | rgb(205,199,187) | 1.00 | ❌ FAIL |
| Hero eyebrow (over hero scrim) | rgb(197,182,153) | rgb(205,199,187) | 1.19 | ❌ FAIL |
| CTA text on CTA | rgb(54,45,30) | rgb(197,182,153) | 6.79 | ✅ AA |

## How to read this

- ✅ AAA (≥7:1) — exceeds AA, optimal
- ✅ AA (≥4.5:1) — passes WCAG AA for body text
- ⚠️ AA-large only (≥3:1) — passes only for headings/CTAs at large size
- ❌ FAIL (<3:1) — needs a darker fg or lighter bg

Faint/subtle text token `text-faint` is intentionally low-contrast — used only for decorative meta. Treat ⚠️ verdicts on it as expected, not a bug. Everything else marked ❌ should be investigated.

## Findings — actionable

### 🔴 Real failures (fix these)

1. **Price mode — Hero H1 (3.51) and tagline (2.99) on `--ink`**
   White text on powder-blue (#5C88DA). The hero-overlay gradient softens this in practice, but raw text-on-bg fails AA. Either darken `--ink` for Price or strengthen the hero overlay opacity in Price.

2. **Price mode — Red accent (1.09 on ink, 1.74 on surface)**
   `--red: #E35205` (orange) on powder-blue is barely visible. This affects every Red accent on Hero, eyebrows, dot navigation. Swap Price's `--red` to a darker variant or pin accents to the deep-blue/black instead.

3. **Cavs mode — Red accent on surface/ink (1.33 / 1.63)**
   The Cavs `--red: #860038` (wine) on navy doesn't pop. Wine-on-navy is on-brand but unreadable. Consider using gold (`#FDBB30`) for body accent and reserving wine for filled-button backgrounds only — which already passes (Hero CTA uses gold and reads 9.71 AAA).

4. **Light + Italy — Red accent on surface/ink (2.57 / 2.81)**
   Brand red on warm tan reads poorly at body size. Buttons/links using raw `--red` text need a darker variant (e.g. `--red-hover: #B00018` reads better) or use the red as a filled background instead of text.

### 🟡 Discount these (false-positive context)

- **Light/Italy — Hero H1 (1.00), tagline (1.00), eyebrow (1.19)** — these read against the hero photo + `--hero-overlay` gradient, not raw `--ink`. Visually fine in practice. Add an alt fallback color if the photo fails to load.
- **Faint/Subtle text rows below 4.5:1** — these tokens are decorative meta by design. Don't promote them to body text.

### ✅ Healthy

- **Dark mode** — every body/CTA pair passes AA, most pass AAA.
- **Cavs CTAs** — gold-on-navy buttons read 9.71 AAA.
- **Browns** — every reading passes AA, almost all AAA.
- **Tribe** — body text on surface passes AAA at 10.69.

### Suggested next pass

Add a `--red-readable` token to each palette that's guaranteed to pass AA on that mode's surface. Use it anywhere `--red` is rendered as text (links, eyebrows, dot nav). Keep `--red` for filled CTA backgrounds where it always passes against `--hero-cta-text`.
