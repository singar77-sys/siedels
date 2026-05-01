/**
 * Schedule sync: Google Sheet → Square INTERNAL-BLOCKED bookings.
 *
 * Reads the live sheet (via fetchSchedule), computes per-barber off/partial
 * blocks for the sheet's week, reconciles against existing INTERNAL-BLOCKED
 * bookings in Square, creates missing, cancels orphans.
 *
 * Idempotent — safe to re-run.
 */
import { fetchSchedule } from '@/lib/schedule';

const SQUARE_BASE = 'https://connect.squareup.com/v2';
const SQUARE_VERSION = '2024-12-18';

// Sheet first-name (lowercased) → Square team_member_id.
// Kept here rather than in shop.ts because it's only relevant to this sync.
const TEAM_MAP: Record<string, string> = {
  jim: 'TMg6BhxTBejmD3Mu',
  billy: 'TMyZuF0ATa88VSIC',
  matt: 'TMXIK3PV7gw6Nfn9',
  patrick: 'TMczLNf1lpChKTW1',
  krista: 'TMF0l_MTlXDBUne0',
  ticia: 'TMY92J8fk1vopHLK',
  pierre: 'TMcYCni9gMFp1phL',
  chris: 'TMDYoGsYchG9Zx2M',
  sam: 'TMjH8V1ibNbrThWU',
  shannon: 'TMxS3SdfJAhEasf2',
  will: 'TMjfrDpWo7xEYLjG',
};

interface PlannedBlock {
  teamId: string;
  teamFirst: string;
  date: string; // yyyy-mm-dd
  dayName: string;
  startUtcIso: string; // "2026-05-02T12:00:00Z"
  durationMin: number;
  label: string;
}

interface SquareBooking {
  id: string;
  version: number;
  status: string;
  start_at: string; // ends with Z
  customer_id?: string;
  appointment_segments?: Array<{
    team_member_id: string;
    service_variation_id: string;
    duration_minutes: number;
  }>;
}

// ── Time-zone math for America/New_York (handles DST automatically) ─────
function nycOffsetHours(year: number, month1: number, day: number): number {
  // Probe noon UTC on the given date — see what local-hour NYC reports.
  // If NYC sees 7 (EST), offset is -5. If 8 (EDT), offset is -4.
  const probe = new Date(Date.UTC(year, month1 - 1, day, 12, 0, 0));
  const nycHour = parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      hour12: false,
    })
      .formatToParts(probe)
      .find((p) => p.type === 'hour')!.value,
    10,
  );
  // formatToParts can return "24" for midnight UTC sometimes; clamp.
  const localHour = nycHour === 24 ? 0 : nycHour;
  return localHour - 12;
}

function nycLocalToUtcIso(dateIso: string, hoursFloat: number): string {
  const [y, m, d] = dateIso.split('-').map(Number);
  const offsetH = nycOffsetHours(y, m, d);
  const localH = Math.floor(hoursFloat);
  const localMin = Math.round((hoursFloat - localH) * 60);
  const utcDate = new Date(Date.UTC(y, m - 1, d, localH - offsetH, localMin, 0));
  return utcDate.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function parseTimeRange(raw: string): [number, number] | null {
  let s = raw.trim().toLowerCase().replace(/\s+/g, '').replace(/[–—]/g, '-');
  s = s.replace(/noon/g, '12pm').replace(/midnight/g, '12am');
  const m = /^(\d{1,2})(?::(\d{2}))?(am|pm)?-(\d{1,2})(?::(\d{2}))?(am|pm)?$/.exec(s);
  if (!m) return null;
  const [, h1s, m1s, ap1Raw, h2s, m2s, ap2Raw] = m;
  let ap1 = ap1Raw, ap2 = ap2Raw;
  const h1 = parseInt(h1s, 10);
  const h2 = parseInt(h2s, 10);
  const min1 = m1s ? parseInt(m1s, 10) : 0;
  const min2 = m2s ? parseInt(m2s, 10) : 0;
  if (!ap1 && ap2) ap1 = ap2;
  if (!ap2 && ap1) ap2 = ap1;
  if (!ap1 && !ap2) {
    ap1 = 'am';
    ap2 = 'pm';
  }
  const to24 = (h: number, ap: string) => {
    if (ap === 'pm' && h !== 12) return h + 12;
    if (ap === 'am' && h === 12) return 0;
    return h;
  };
  const start = to24(h1, ap1) + min1 / 60;
  let end = to24(h2, ap2) + min2 / 60;
  if (end <= start) end += 12;
  return [start, end];
}

// ── Square API client ──────────────────────────────────────────────────
type SquareResponse = {
  bookings?: SquareBooking[];
  booking?: SquareBooking;
  cursor?: string;
  errors?: Array<{ category?: string; code?: string; detail?: string; field?: string }>;
};

async function sq(method: string, path: string, body?: unknown): Promise<{ status: number; data: SquareResponse }> {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) throw new Error('SQUARE_ACCESS_TOKEN not set');
  const res = await fetch(SQUARE_BASE + path, {
    method,
    headers: {
      'Square-Version': SQUARE_VERSION,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data: SquareResponse = {};
  try {
    data = (await res.json()) as SquareResponse;
  } catch {
    data = {};
  }
  return { status: res.status, data };
}

// ── Main sync ──────────────────────────────────────────────────────────
export async function syncSchedule(): Promise<{
  ok: boolean;
  planned: number;
  kept: number;
  created: number;
  cancelled: number;
  errors: string[];
}> {
  const locationId = process.env.SQUARE_LOCATION_ID;
  const blockVar = process.env.SQUARE_BLOCK_SERVICE_VARIATION_ID;
  const blockCustomer = process.env.SQUARE_BLOCK_CUSTOMER_ID;
  if (!locationId || !blockVar || !blockCustomer) {
    throw new Error('Missing SQUARE_LOCATION_ID / SQUARE_BLOCK_SERVICE_VARIATION_ID / SQUARE_BLOCK_CUSTOMER_ID');
  }

  const week = await fetchSchedule();
  if (week.stale || week.days.length === 0) {
    return { ok: false, planned: 0, kept: 0, created: 0, cancelled: 0, errors: ['sheet stale or empty'] };
  }

  const nowUtc = new Date();

  // Build planned blocks
  const planned: PlannedBlock[] = [];
  for (const day of week.days) {
    if (!day.date) continue;
    const [y, m, d] = day.date.split('-').map(Number);
    const dayDate = new Date(Date.UTC(y, m - 1, d));
    if (dayDate.getTime() < nowUtc.getTime() - 86400_000) continue; // skip dates strictly before today (UTC)

    const shopRange = parseTimeRange(day.shopHours);
    if (!shopRange) continue;
    const [shopStart, shopEnd] = shopRange;

    for (const [first, shift] of day.shifts) {
      const teamId = TEAM_MAP[first];
      if (!teamId) continue;
      const intervals: Array<[number, number, string]> = [];
      if (shift.status === 'working') {
        const r = parseTimeRange(shift.raw);
        if (r) {
          const [ss, se] = r;
          if (ss > shopStart) intervals.push([shopStart, ss, `pre-shift (${shift.raw})`]);
          if (se < shopEnd) intervals.push([se, shopEnd, `post-shift (${shift.raw})`]);
        }
      } else if (shift.status === 'off') {
        intervals.push([shopStart, shopEnd, `off (${shift.raw || 'blank'})`]);
      } else if (shift.status === 'offsite') {
        intervals.push([shopStart, shopEnd, `offsite (${shift.location || shift.raw})`]);
      }
      for (const [s, e, label] of intervals) {
        const startUtc = nycLocalToUtcIso(day.date, s);
        if (new Date(startUtc).getTime() <= nowUtc.getTime()) continue; // skip past
        planned.push({
          teamId,
          teamFirst: first,
          date: day.date,
          dayName: day.dayName,
          startUtcIso: startUtc,
          durationMin: Math.round((e - s) * 60),
          label,
        });
      }
    }
  }

  // Fetch existing INTERNAL-BLOCKED bookings in date range
  const dates = [...new Set(planned.map((p) => p.date))].sort();
  if (dates.length === 0) {
    return { ok: true, planned: 0, kept: 0, created: 0, cancelled: 0, errors: [] };
  }
  const startQ = nycLocalToUtcIso(dates[0], 0);
  const endQ = nycLocalToUtcIso(dates[dates.length - 1], 24); // end of last day

  const existing: SquareBooking[] = [];
  let cursor: string | undefined;
  do {
    const params = new URLSearchParams({
      location_id: locationId,
      start_at_min: startQ,
      start_at_max: endQ,
      limit: '200',
    });
    if (cursor) params.set('cursor', cursor);
    const { status, data } = await sq('GET', `/bookings?${params}`);
    if (status !== 200) {
      return {
        ok: false,
        planned: planned.length,
        kept: 0,
        created: 0,
        cancelled: 0,
        errors: [`list bookings failed: ${status} ${JSON.stringify(data).slice(0, 200)}`],
      };
    }
    for (const b of data.bookings || []) existing.push(b);
    cursor = data.cursor;
  } while (cursor);

  const ours = existing.filter(
    (b) =>
      b.status === 'ACCEPTED' &&
      (b.appointment_segments || []).some((s) => s.service_variation_id === blockVar),
  );

  // Diff
  const keyOf = (teamId: string, startUtc: string, durMin: number) => `${teamId}|${startUtc}|${durMin}`;
  const plannedMap = new Map(planned.map((p) => [keyOf(p.teamId, p.startUtcIso, p.durationMin), p]));
  const existingMap = new Map<string, SquareBooking>();
  for (const b of ours) {
    const seg = b.appointment_segments![0];
    existingMap.set(keyOf(seg.team_member_id, b.start_at, seg.duration_minutes), b);
  }
  const toCreate = [...plannedMap.entries()].filter(([k]) => !existingMap.has(k)).map(([, p]) => p);
  const toCancel = [...existingMap.entries()].filter(([k]) => !plannedMap.has(k)).map(([, b]) => b);
  const kept = [...plannedMap.keys()].filter((k) => existingMap.has(k)).length;

  const errors: string[] = [];
  let created = 0;
  let cancelled = 0;

  for (const p of toCreate) {
    const { status, data } = await sq('POST', '/bookings', {
      idempotency_key: crypto.randomUUID(),
      booking: {
        location_id: locationId,
        customer_id: blockCustomer,
        start_at: p.startUtcIso,
        appointment_segments: [
          {
            team_member_id: p.teamId,
            service_variation_id: blockVar,
            service_variation_version: 1,
            duration_minutes: p.durationMin,
          },
        ],
      },
    });
    if (status === 200 || status === 201) {
      created++;
    } else {
      const detail = data?.errors?.[0]?.detail || JSON.stringify(data).slice(0, 120);
      errors.push(`create ${p.teamFirst} ${p.date} ${p.startUtcIso}: ${detail}`);
    }
  }

  for (const b of toCancel) {
    const { status, data } = await sq('POST', `/bookings/${b.id}/cancel`, {
      idempotency_key: crypto.randomUUID(),
      booking_version: b.version,
    });
    if (status === 200) {
      cancelled++;
    } else {
      const detail = data?.errors?.[0]?.detail || JSON.stringify(data).slice(0, 120);
      errors.push(`cancel ${b.id}: ${detail}`);
    }
  }

  return { ok: errors.length === 0, planned: planned.length, kept, created, cancelled, errors };
}
