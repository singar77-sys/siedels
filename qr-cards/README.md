# Siedel's Review QR Cards

11 QR codes, one per barber. Each scans to that barber's thank-you page, which drives Google reviews with per-barber attribution.

## URLs each QR encodes

| Barber | URL |
|---|---|
| Jim LaMarca | `https://www.siedels.com/thanks/jim` |
| Pierre Wright | `https://www.siedels.com/thanks/pierre` |
| Matt Hayes | `https://www.siedels.com/thanks/matt` |
| Ticia Husak | `https://www.siedels.com/thanks/ticia` |
| Krista Foecking | `https://www.siedels.com/thanks/krista` |
| Patrick Muranko | `https://www.siedels.com/thanks/patrick` |
| Will Dillon | `https://www.siedels.com/thanks/will` |
| Shannon Hadick | `https://www.siedels.com/thanks/shannon` |
| Chris Hodge | `https://www.siedels.com/thanks/chris` |
| Billy Rodriguez | `https://www.siedels.com/thanks/billy` |
| Sam Sickle | `https://www.siedels.com/thanks/sam` |

## When the custom domain goes live

Re-run the generator with the new base URL, or use any free QR generator and paste the new URLs. The `/thanks/[slug]` routes will work the same on the new domain.

## Print spec

**Recommended card size:** 3.5" × 2" (standard business card)
- QR code: ~1.5" × 1.5" left or center
- Text block on the right or below

**Card copy (use with the brand voice):**

```
DROP A REVIEW
───────────────
SCAN → ONE TAP TO GOOGLE
CUT BY [BARBER NAME]

SIEDEL'S BARBERSHOP
982 N COURT STREET · MEDINA, OH
CASH ONLY · ATM ON SITE
```

**Print vendors:**
- Vistaprint — 500 cards, gloss or matte, ~$20
- Moo — 100 cards, premium cotton stock, ~$40
- Local Medina printer for same-day

## Workflow

1. Each barber keeps 5-10 cards at their station
2. After the cut, hand the customer one: "If you had a good time, scan this"
3. Customer scans → lands on their personalized thanks page
4. Taps the red "LEAVE A GOOGLE REVIEW" button
5. Google review form opens in their phone's Maps app
6. They leave a review, often mentioning the barber by name

## Attribution

The thank-you page appends `#ref=[barber-slug]` to the Google review URL. While Google doesn't pass this to you directly, you'll be able to infer barber attribution from:

- Review timestamps (correlate with barber's shifts)
- Direct mentions in review text (customers prompted to name the barber)
- Google Analytics events on the `/thanks/[slug]` pages (which barber's page gets the most clicks to Google)
