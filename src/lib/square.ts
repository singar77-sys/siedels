export const SQUARE_BASE_URL = 'https://connect.squareup.com';
export const SQUARE_VERSION  = '2024-11-20';
export const LOCATION_ID     = 'LFC0T5CC7MY0S';

export function squareFetch(path: string, init: RequestInit = {}) {
  return fetch(`${SQUARE_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization:    `Bearer ${process.env.SQUARE_ACCESS_TOKEN!}`,
      'Content-Type':   'application/json',
      'Square-Version': SQUARE_VERSION,
    },
  });
}

// Barber display name → Square team_member_id
export const TEAM_IDS: Record<string, string> = {
  'Billy Rodriguez':  'TMzccz3JgkqWYXul',
  'Chris Hodge':      'TMDYoGsYchG9Zx2M',
  'Jim LaMarca':      'TMg6BhxTBejmD3Mu',
  'Krista Foecking':  'TMF0l_MTlXDBUne0',
  'Matt Hayes':       'TMXIK3PV7gw6Nfn9',
  'Patrick Muranko':  'TMczLNf1lpChKTW1',
  'Pierre Wright':    'TMcYCni9gMFp1phL',
  'Sam Sickle':       'TMjH8V1ibNbrThWU',
  'Shannon Hadick':   'TMxS3SdfJAhEasf2',
  'Ticia Husak':      'TMY92J8fk1vopHLK',
  'Will Dillon':      'TMjfrDpWo7xEYLjG',
};

// Square team_member_id → display name
export const ID_TO_NAME = Object.fromEntries(
  Object.entries(TEAM_IDS).map(([name, id]) => [id, name])
);

// Service name (matches shop.ts) → duration in minutes
export const SERVICE_DURATIONS: Record<string, number> = {
  'Haircut':                         30,
  'Razor / Foil Fade':               30,
  'Haircut + Beard Trim':            50,
  'Haircut + Face Shave':            55,
  'Full Service Shave':              30,
  'Head Shave':                      35,
  'Beard Trim':                      20,
  'Shoulder Length Cut + Rough Dry': 30,
  'Duo Haircut':                     60,
  'Trio Haircut':                    90,
};

// Service name (matches shop.ts) → Square catalog variation ID
export const SERVICE_VARIATION_IDS: Record<string, string> = {
  'Haircut':                         'KRVP7PV2YVVVPPIMUB52D5YP',
  'Razor / Foil Fade':               'U5XYIQ2KEQJQDNTKC3PGGB2E',
  'Haircut + Beard Trim':            'PU52P4KF5F6F6SKGEQAHP6ME',
  'Haircut + Face Shave':            'YZBFWCNUWQLQK6BCVHKML6PV',
  'Full Service Shave':              'VAIRKNZYT7IDGOYAMHYJCE55',
  'Head Shave':                      'B22WVZABU4OERJJZUJPD4IC2',
  'Beard Trim':                      'X2U6BUQCAOKZ5P4GO2WP6LGH',
  'Shoulder Length Cut + Rough Dry': '44EQKWLAE6VC7NBCVTQX7GD7',
  'Duo Haircut':                     'JYOCJMVGZHX7A75WVJ6BZAWP',
  'Trio Haircut':                    'WSIHRQOHFTVO5WAMGOGMJX2F',
};
