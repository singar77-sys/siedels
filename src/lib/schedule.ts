/**
 * Schedule integration — reads live Google Sheet and normalizes it
 * for the site.
 *
 * Sheet must remain "Anyone with the link" viewable.
 *
 * Format expected (rows):
 *   row 0: blank, Monday, blank, Tuesday, blank, Wednesday, ... Saturday
 *   row 1: blank, 2/23/2026, blank, 2/24/2026, ...
 *   row 2: blank, 8am-8pm, blank, 8am-6pm, ... (shop hours)
 *   row 3+: NAME, shift, blank, shift, blank, ...
 *
 * Time zone: America/New_York. "Today" is resolved in that TZ.
 */

const SHEET_ID = process.env.GOOGLE_SHEET_ID ?? '1fyeoscOea4Xa2H-LIoFv96F-ILoBhnvL0KKzS3eC83Q';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

export type ShiftStatus = 'working' | 'off' | 'offsite';

export interface Shift {
  status: ShiftStatus;
  /** Raw cell value from the sheet, e.g. "8am-6pm", "off", "Ledgewood". */
  raw: string;
  /** Normalized display string for working shifts, e.g. "8a–6p". Empty for off/offsite. */
  display: string;
  /** Where they are if offsite, e.g. "Ledgewood". */
  location?: string;
}

export interface DaySchedule {
  /** 0-indexed into the week. 0 = Monday */
  dayIndex: number;
  dayName: string;
  /** ISO date string yyyy-mm-dd parsed from the sheet. null if unparseable. */
  date: string | null;
  /** Shop open/close hours from the sheet's hours row. */
  shopHours: string;
  /** Map of lowercased first name → shift. */
  shifts: Map<string, Shift>;
}

export type WeekRelation = 'current' | 'upcoming' | 'past' | 'unknown';

export interface WeekSchedule {
  days: DaySchedule[];
  /** True if the sheet's week appears to cover today. */
  isCurrent: boolean;
  /** How this week relates to "now" — current, upcoming (future), past (stale). */
  relation: WeekRelation;
  /** Days between today and the start of the sheet's week. Negative = past. */
  daysUntilStart: number | null;
  /** True if we were unable to load the sheet at all. */
  stale: boolean;
  /** ISO timestamp of when we fetched. */
  fetchedAt: string;
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ────────────────────────────────────────────────
// CSV parsing — minimal, handles quoted cells with commas
// ────────────────────────────────────────────────
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cell += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(cell);
        cell = '';
      } else if (c === '\r') {
        // ignore
      } else if (c === '\n') {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = '';
      } else {
        cell += c;
      }
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

// ────────────────────────────────────────────────
// Shift normalization
// ────────────────────────────────────────────────
function classify(raw: string): Shift {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();

  if (!trimmed || lower === 'off' || lower === 'r/o' || lower === 'ro') {
    return { status: 'off', raw: trimmed, display: '' };
  }

  // Time-range pattern: "8am-6pm", "8a-6p", "noon-8pm", "10am-noon", "8:30am-6pm".
  // Requires a recognised time token on BOTH sides of the separator so stray
  // digits (dates, room numbers, etc.) don't land in the wrong bucket.
  const TIME_TOKEN = /(?:\d{1,2}(?::\d{2})?[ap]m?|noon|midnight)/i;
  const TIME_RANGE = new RegExp(`${TIME_TOKEN.source}\\s*[-–—]\\s*${TIME_TOKEN.source}`, 'i');
  if (TIME_RANGE.test(trimmed)) {
    return { status: 'working', raw: trimmed, display: prettifyTime(trimmed) };
  }

  // Anything else is treated as a location (e.g. "Ledgewood")
  return {
    status: 'offsite',
    raw: trimmed,
    display: '',
    location: trimmed,
  };
}

function prettifyTime(raw: string): string {
  // Normalize "8am-6pm" → "8a–6p", "noon-8pm" → "noon–8p", "8:30am-6pm" → "8:30a–6p"
  return raw
    .replace(/\s+/g, '')
    .replace(/–|—/g, '-')
    .replace(/am/gi, 'a')
    .replace(/pm/gi, 'p')
    .replace(/-/g, '–');
}

// ────────────────────────────────────────────────
// Date parsing from sheet "2/23/2026" format
// ────────────────────────────────────────────────
function parseSheetDate(raw: string): string | null {
  const m = raw.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const month = m[1].padStart(2, '0');
  const day = m[2].padStart(2, '0');
  const year = m[3];
  return `${year}-${month}-${day}`;
}

// ────────────────────────────────────────────────
// "Today" in America/New_York
// ────────────────────────────────────────────────
export function todayInMedina(): { iso: string; dayIndex: number; dayName: string } {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
  });
  const parts = fmt.formatToParts(now).reduce<Record<string, string>>((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  const iso = `${parts.year}-${parts.month}-${parts.day}`;
  const weekday = parts.weekday; // "Monday", etc.
  const idx = DAY_NAMES.indexOf(weekday);
  return { iso, dayIndex: idx, dayName: weekday };
}

// ────────────────────────────────────────────────
// Main fetcher
// ────────────────────────────────────────────────
export async function fetchSchedule(): Promise<WeekSchedule> {
  const fetchedAt = new Date().toISOString();

  let text: string;
  try {
    const res = await fetch(CSV_URL, {
      next: { revalidate: 1800 }, // 30 min ISR cache
      redirect: 'follow',
      // Abort after 8 s — prevents the Vercel static-generation worker
      // from hanging the full 60 s when Sheets is slow at build time.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    text = await res.text();
  } catch {
    return {
      days: [],
      isCurrent: false,
      relation: 'unknown',
      daysUntilStart: null,
      stale: true,
      fetchedAt,
    };
  }

  const rows = parseCsv(text);
  if (rows.length < 4) {
    return {
      days: [],
      isCurrent: false,
      relation: 'unknown',
      daysUntilStart: null,
      stale: true,
      fetchedAt,
    };
  }

  // Day columns: the header row has day names in columns 1, 3, 5, 7, 9, 11
  // Each day occupies one column; the blank columns in between are separators.
  const dayRow = rows[0];
  const dateRow = rows[1];
  const hoursRow = rows[2];

  const dayColumns: number[] = [];
  for (let c = 1; c < dayRow.length; c++) {
    const name = (dayRow[c] || '').trim();
    if (DAY_NAMES.includes(name)) dayColumns.push(c);
  }
  if (dayColumns.length === 0) {
    return {
      days: [],
      isCurrent: false,
      relation: 'unknown',
      daysUntilStart: null,
      stale: true,
      fetchedAt,
    };
  }

  const days: DaySchedule[] = dayColumns.map((col, i) => ({
    dayIndex: i,
    dayName: (dayRow[col] || '').trim(),
    date: parseSheetDate(dateRow[col] || ''),
    shopHours: (hoursRow[col] || '').trim(),
    shifts: new Map<string, Shift>(),
  }));

  // Staff rows start at index 3
  for (let r = 3; r < rows.length; r++) {
    const row = rows[r];
    const name = (row[0] || '').trim();
    if (!name) continue;
    const firstName = name.split(/\s+/)[0].toLowerCase();
    for (let i = 0; i < dayColumns.length; i++) {
      const col = dayColumns[i];
      const cell = row[col] || '';
      days[i].shifts.set(firstName, classify(cell));
    }
  }

  // Figure out the relationship between the sheet's week and "today".
  const today = todayInMedina();
  const isCurrent = days.some((d) => d.date === today.iso);

  // Find the Monday of the sheet's week (first parsed date)
  const firstDate = days.find((d) => d.date)?.date ?? null;
  let daysUntilStart: number | null = null;
  let relation: WeekRelation = 'unknown';

  if (firstDate) {
    const [fy, fm, fd] = firstDate.split('-').map(Number);
    const [ty, tm, td] = today.iso.split('-').map(Number);
    const sheetStart = Date.UTC(fy, fm - 1, fd);
    const todayUtc = Date.UTC(ty, tm - 1, td);
    daysUntilStart = Math.round((sheetStart - todayUtc) / 86400000);
    if (isCurrent) {
      relation = 'current';
    } else if (daysUntilStart > 0) {
      relation = 'upcoming';
    } else {
      relation = 'past';
    }
  }

  return { days, isCurrent, relation, daysUntilStart, stale: false, fetchedAt };
}

// ────────────────────────────────────────────────
// Today's working roster — for the homepage "IN TODAY" widget
// ────────────────────────────────────────────────
export interface WorkingMember {
  firstName: string;
  display: string;
  raw: string;
}

export function getWorkingToday(week: WeekSchedule): {
  shopHours: string | null;
  working: WorkingMember[];
  /** True only when we know the shop is closed today (Sunday). A stale
   *  or missing schedule sheet does NOT count as closed. */
  isClosed: boolean;
  /** True when the schedule sheet covers today. When false, isClosed
   *  alone can't be trusted — consumers should gate UI behind this. */
  scheduleKnown: boolean;
  dayName: string;
} {
  const today = todayInMedina();
  const day = week.days.find((d) => d.date === today.iso);

  if (!day) {
    return {
      shopHours: null,
      working: [],
      isClosed: today.dayName === 'Sunday',
      scheduleKnown: week.isCurrent,
      dayName: today.dayName,
    };
  }

  const working: WorkingMember[] = [];
  day.shifts.forEach((shift, firstName) => {
    if (shift.status === 'working') {
      working.push({ firstName, display: shift.display, raw: shift.raw });
    }
  });

  return {
    shopHours: day.shopHours,
    working,
    isClosed: false,
    scheduleKnown: true,
    dayName: today.dayName,
  };
}

/**
 * Flatten today's shifts into a plain object keyed by lowercase first name,
 * so it can safely cross the server→client boundary (Maps don't serialize).
 */
export function getTodayShiftsRecord(
  week: WeekSchedule
): Record<string, Shift> {
  const out: Record<string, Shift> = {};
  if (!week.isCurrent) return out;
  const today = todayInMedina();
  const day = week.days.find((d) => d.date === today.iso);
  if (!day) return out;
  day.shifts.forEach((shift, firstName) => {
    out[firstName] = shift;
  });
  return out;
}

/**
 * Serialize the full week's shifts into a plain, JSON-safe nested record so
 * it can cross the server→client boundary and be threaded into barber modals.
 * Returns { [lowercaseFirstName]: { [dayName]: Shift } }
 * Only populated when the week is current; empty otherwise.
 */
export function getWeekShiftsRecord(
  week: WeekSchedule
): Record<string, Record<string, Shift>> {
  const out: Record<string, Record<string, Shift>> = {};
  if (!week.isCurrent) return out;
  for (const day of week.days) {
    day.shifts.forEach((shift, firstName) => {
      if (!out[firstName]) out[firstName] = {};
      out[firstName][day.dayName] = shift;
    });
  }
  return out;
}
