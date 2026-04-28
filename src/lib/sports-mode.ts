/**
 * Sports mode — automatic Cleveland team palette on home game days.
 *
 * Returns a TeamMode (maps to data-team-mode CSS attribute) for today's
 * date, or null if no home game. Called server-side in layout.tsx and
 * passed as `forcedMode` to <TeamModeEasterEgg />.
 *
 * Priority on same-day overlap: Browns > Cavaliers > Guardians.
 *
 * Updating schedules:
 *   - Guardians: new season usually in November (schedule released)
 *   - Cavaliers: regular season in October; add playoff dates manually
 *   - Browns: NFL schedule releases in May — add 2026 home dates then
 */

import type { TeamMode } from '@/components/TeamModeEasterEgg';

// ── Cleveland Guardians 2026 (Progressive Field) ──────────────────────────
const GUARDIANS_2026: string[] = [
  // April
  '2026-04-03', '2026-04-06', '2026-04-07', '2026-04-08',
  '2026-04-16', '2026-04-17', '2026-04-18', '2026-04-19', '2026-04-20', '2026-04-21', '2026-04-22',
  '2026-04-27', '2026-04-28', '2026-04-29',
  // May
  '2026-05-08', '2026-05-09', '2026-05-10', '2026-05-11', '2026-05-12', '2026-05-13',
  '2026-05-15', '2026-05-16',
  '2026-05-25', '2026-05-26', '2026-05-30',
  // June
  '2026-06-08', '2026-06-09', '2026-06-12', '2026-06-13',
  '2026-06-27', '2026-06-29', '2026-06-30',
  // July
  '2026-07-03', '2026-07-04',
  '2026-07-18', '2026-07-20', '2026-07-21',
  // August
  '2026-08-01', '2026-08-02', '2026-08-05',
  '2026-08-15',
  '2026-08-28', '2026-08-29',
  // September
  '2026-09-05', '2026-09-19',
];

// ── Cleveland Cavaliers 2025–26 (Rocket Mortgage FieldHouse) ─────────────
// Regular season + playoffs. Add second-round home dates once the
// bracket and series outcomes are confirmed.
const CAVALIERS_2025_26: string[] = [
  // Regular season (all past)
  '2025-10-26', '2025-10-31',
  '2025-11-02', '2025-11-05', '2025-11-08', '2025-11-13', '2025-11-15',
  '2025-11-17', '2025-11-19', '2025-11-21', '2025-11-23', '2025-11-30',
  '2025-12-03', '2025-12-05', '2025-12-06', '2025-12-14',
  '2025-12-19', '2025-12-22', '2025-12-23', '2025-12-31',
  '2026-01-02', '2026-01-04', '2026-01-10', '2026-01-12',
  '2026-01-19', '2026-01-23', '2026-01-26', '2026-01-28',
  '2026-02-11', '2026-02-19', '2026-02-24',
  '2026-03-03', '2026-03-08', '2026-03-09',
  '2026-03-24', '2026-03-25', '2026-03-27',
  '2026-04-05', '2026-04-08', '2026-04-12',
  // 2026 playoffs — Round 1 vs. Toronto Raptors (2-2 series, CLE hosts G5/G7)
  '2026-04-18', // G1 ✓ CLE 126–113
  '2026-04-20', // G2 ✓ CLE 115–105
  '2026-04-29', // G5 — series tied 2-2
  '2026-05-03', // G7 — if needed
  // Round 2 home dates: add here once bracket + schedule are confirmed
];

// ── Cleveland Browns 2026 (Huntington Bank Field) ─────────────────────────
// NFL schedule releases in May 2026. Add home game dates here once known.
// 2025 season is past — commented out for reference.
const BROWNS_2026: string[] = [
  // 2025 (past): '2025-09-07', '2025-09-21', '2025-10-19',
  //              '2025-11-16', '2025-12-07', '2025-12-21', '2025-12-28'
  // Add 2026 home dates here when the NFL schedule drops (May 2026):
];

// ── Date helper — resolves "today" in Medina's timezone ──────────────────
function dateStrInMedina(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date).reduce<Record<string, string>>((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/**
 * Returns the TeamMode to auto-activate on game days, or null if no
 * Cleveland home game is scheduled for the given date.
 *
 * Priority on overlap: Browns > Cavaliers > Guardians.
 */
export function getSportsModeForDate(date: Date): TeamMode | null {
  const today = dateStrInMedina(date);
  if (BROWNS_2026.includes(today))        return 'browns';
  if (CAVALIERS_2025_26.includes(today))  return 'cavs';
  if (GUARDIANS_2026.includes(today))     return 'tribe';
  return null;
}
