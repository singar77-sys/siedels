/**
 * Open-Meteo integration for Medina, Ohio.
 *
 * Free, no API key. Current-conditions endpoint includes WMO weather
 * codes plus an is_day flag that lets us pick a theme default. We
 * cache the upstream response for 15 minutes via Next's ISR layer.
 */

export const MEDINA_LAT = 41.1445;
export const MEDINA_LON = -81.8637;
export const REVALIDATE_SECONDS = 900; // 15 min

export type WeatherEffect = 'snow' | 'rain' | 'fog' | 'clear';

export interface WeatherCurrent {
  temperature_2m: number;
  weather_code: number;
  is_day: 0 | 1;
  precipitation: number;
  snowfall: number;
  cloud_cover: number;
  visibility: number;
}

export interface WeatherResponse {
  ok: boolean;
  current: WeatherCurrent | null;
  fetchedAt: string;
}

// WMO weather code groups — https://open-meteo.com/en/docs
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);
const FOG_CODES = new Set([45, 48]);
const RAIN_CODES = new Set([
  51, 53, 55, 56, 57, // drizzle / freezing drizzle
  61, 63, 65, 66, 67, // rain / freezing rain
  80, 81, 82,         // rain showers
  95, 96, 99,         // thunderstorm (treat as rain + lightning)
]);

export function pickEffect(current: WeatherCurrent | null): WeatherEffect {
  if (!current) return 'clear';
  if (current.snowfall > 0 || SNOW_CODES.has(current.weather_code)) return 'snow';
  if (FOG_CODES.has(current.weather_code) || current.visibility < 1000) return 'fog';
  if (current.precipitation > 0 || RAIN_CODES.has(current.weather_code)) return 'rain';
  return 'clear';
}

export async function fetchWeather(): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: String(MEDINA_LAT),
    longitude: String(MEDINA_LON),
    current: [
      'temperature_2m',
      'weather_code',
      'is_day',
      'precipitation',
      'snowfall',
      'cloud_cover',
      'visibility',
    ].join(','),
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const fetchedAt = new Date().toISOString();
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as { current?: WeatherCurrent };
    if (!data.current) throw new Error('no current block');
    return { ok: true, current: data.current, fetchedAt };
  } catch {
    return { ok: false, current: null, fetchedAt };
  }
}
