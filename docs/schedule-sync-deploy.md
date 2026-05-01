# Schedule → Square Sync — Deploy Notes

Automated weekly sync that reads the Google Sheet schedule and creates/cancels
`INTERNAL-BLOCKED` bookings in Square so off-time, partial shifts, and offsite
days are unbookable for customers.

## Files

| Path | Purpose |
|---|---|
| [src/lib/sync-square-schedule.ts](../src/lib/sync-square-schedule.ts) | Core sync logic — reads sheet, computes blocks, reconciles with Square |
| [src/app/api/cron/sync-schedule/route.ts](../src/app/api/cron/sync-schedule/route.ts) | Vercel Cron handler |
| [vercel.json](../vercel.json) | Cron schedule entry |
| [scripts/sync-schedule-live.py](../scripts/sync-schedule-live.py) | Standalone sync (mirror of TS lib) — run locally for ad-hoc syncs |
| [scripts/sync-schedule-dryrun.py](../scripts/sync-schedule-dryrun.py) | Dry-run preview — no writes |

## Cron schedule

Runs **Mondays 14:00 UTC** = 10:00 EDT / 09:00 EST. Gives Jim the morning to
update the sheet for the new week before the sync fires.

```json
{ "path": "/api/cron/sync-schedule", "schedule": "0 14 * * 1" }
```

Re-running mid-week is safe (idempotent — kept matches do nothing).

## Vercel env vars to add

Settings → Environment Variables → add for **Production** + **Preview**:

| Key | Value |
|---|---|
| `SQUARE_ACCESS_TOKEN` | From `sand.env` |
| `SQUARE_LOCATION_ID` | `LFC0T5CC7MY0S` |
| `SQUARE_BLOCK_SERVICE_VARIATION_ID` | `NOD4R6U65N6JYBTYKTLOADT3` |
| `SQUARE_BLOCK_CUSTOMER_ID` | `8SQWH6FY60WC434DWNPZ5A4W9W` |
| `CRON_SECRET` | Already set for the existing dormancy cron — same value works |

## How blocks are computed

For each barber × each day in the sheet:

| Sheet cell | Block created |
|---|---|
| `8am-6pm` (matches shop hours) | none |
| `9am-2pm` (works partial) | block before (8a–9a) + block after (2p–6p) |
| `Off` / `off` / `r/o` / `ro` | block whole shop hours |
| `Ledgewood` (or any non-time) | block whole shop hours (offsite) |
| (blank) | block whole shop hours |

Only future blocks are created — anything starting in the past is skipped.

## Reverting

To stop blocking and let barbers be bookable for all shop hours by default:

1. Remove the `/api/cron/sync-schedule` entry from `vercel.json`
2. One-shot cancel current blocks: `python scripts/sync-schedule-live.py --apply`
   with the sheet temporarily cleared, **or** manually cancel blocks in Square dashboard.
3. To fully tear down: delete the `INTERNAL-BLOCKED` catalog item and the
   `INTERNAL SCHEDULE-BLOCK` system customer.
