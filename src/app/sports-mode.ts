// ── Master switch — set to true to re-enable ──────────────────────────────
const SPORTS_MODE_ENABLED = false;

export type TeamKey = 'guardians' | 'cavaliers' | 'browns';

export interface SportsVariant {
  bg: string;
  text: string;
  accent: string;
  accentHover: string;
}

export interface SportsTheme {
  team: TeamKey;
  name: string;
  shortName: string;
  tagline: string;
  hashtag: string;
  icon: string;
  /** Always-dark strip used for the game day banner */
  bannerBg: string;
  bannerAccent: string;
  /** Light mode colorway */
  light: SportsVariant;
  /** Dark mode colorway */
  dark: SportsVariant;
}

export const SPORTS_THEMES: Record<TeamKey, SportsTheme> = {

  // ── Cleveland Cavaliers ──────────────────────────────────────────────────
  // Exact palette: #6F2633 wine · #FFB81C gold · #041E42 navy · #000000 black
  cavaliers: {
    team: 'cavaliers',
    name: 'Cleveland Cavaliers',
    shortName: 'Cavs',
    tagline: 'Home game at Rocket Mortgage FieldHouse tonight.',
    hashtag: '#LetEmKnow',
    icon: 'sports_basketball',
    bannerBg: '#000000',
    bannerAccent: '#FFB81C',
    dark: {
      // Black + wine backgrounds, gold + navy accents, white text
      bg: '#000000',
      text: '#FFFFFF',
      accent: '#FFB81C',
      accentHover: '#E6A619',
    },
    light: {
      // White + gold backgrounds, wine + black accents, navy text
      bg: '#FFFFFF',
      text: '#041E42',
      accent: '#6F2633',
      accentHover: '#5A1F2A',
    },
  },

  // ── Cleveland Guardians ──────────────────────────────────────────────────
  // Palette: #00385D navy · #E50022 red · #FFFFFF white
  guardians: {
    team: 'guardians',
    name: 'Cleveland Guardians',
    shortName: 'Guardians',
    tagline: 'Home game at Progressive Field today.',
    hashtag: '#ForTheLand',
    icon: 'sports_baseball',
    bannerBg: '#00385D',
    bannerAccent: '#E50022',
    dark: {
      bg: '#001829',
      text: '#FFFFFF',
      accent: '#E50022',
      accentHover: '#C2001D',
    },
    light: {
      bg: '#EEF3F8',
      text: '#00385D',
      accent: '#E50022',
      accentHover: '#C2001D',
    },
  },

  // ── Cleveland Browns ─────────────────────────────────────────────────────
  // Palette: #311D00 brown · #FF3C00 orange · #FFFFFF white
  browns: {
    team: 'browns',
    name: 'Cleveland Browns',
    shortName: 'Browns',
    tagline: 'Home game at Huntington Bank Field today.',
    hashtag: '#DawgPound',
    icon: 'sports_football',
    bannerBg: '#311D00',
    bannerAccent: '#FF3C00',
    dark: {
      bg: '#1A0E00',
      text: '#FFFFFF',
      accent: '#FF3C00',
      accentHover: '#E63500',
    },
    light: {
      bg: '#FDF5EE',
      text: '#311D00',
      accent: '#FF3C00',
      accentHover: '#E63500',
    },
  },
};

// ── Guardians 2026 Home Schedule (Progressive Field) ──────────────────────
const GUARDIANS_2026: string[] = [
  '2026-04-03', '2026-04-06', '2026-04-07', '2026-04-08',
  '2026-04-16', '2026-04-17', '2026-04-18', '2026-04-19', '2026-04-20', '2026-04-21', '2026-04-22',
  '2026-04-27', '2026-04-28', '2026-04-29',
  '2026-05-08', '2026-05-09', '2026-05-10', '2026-05-11', '2026-05-12', '2026-05-13',
  '2026-05-15', '2026-05-16',
  '2026-05-25', '2026-05-26', '2026-05-30',
  '2026-06-08', '2026-06-09', '2026-06-12', '2026-06-13',
  '2026-06-27', '2026-06-29', '2026-06-30',
  '2026-07-03', '2026-07-04',
  '2026-07-18', '2026-07-20', '2026-07-21',
  '2026-08-01', '2026-08-02', '2026-08-05',
  '2026-08-15',
  '2026-08-28', '2026-08-29',
  '2026-09-05', '2026-09-19',
];

// ── Cavaliers 2025–26 Home Schedule (Rocket Mortgage FieldHouse) ──────────
const CAVALIERS_2025_26: string[] = [
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
];

// ── Browns 2025 Home Schedule (Huntington Bank Field) ─────────────────────
const BROWNS_2025: string[] = [
  '2025-09-07', '2025-09-21',
  '2025-10-19',
  '2025-11-16',
  '2025-12-07', '2025-12-21', '2025-12-28',
];

/**
 * Returns the active sports theme for a given date.
 * Priority on overlap: Browns > Cavaliers > Guardians.
 */
export function getSportsModeForDate(date: Date): SportsTheme | null {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const dateStr = `${y}-${m}-${d}`;

  if (!SPORTS_MODE_ENABLED) return null;
  if (BROWNS_2025.includes(dateStr)) return SPORTS_THEMES.browns;
  if (CAVALIERS_2025_26.includes(dateStr)) return SPORTS_THEMES.cavaliers;
  if (GUARDIANS_2026.includes(dateStr)) return SPORTS_THEMES.guardians;
  return null;
}
