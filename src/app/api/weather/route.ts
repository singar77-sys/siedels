import { fetchWeather } from '@/lib/weather';

// Cache upstream response for 15 minutes. Clients hit our edge; we
// hit Open-Meteo at most once per window.
export const revalidate = 900;

export async function GET() {
  const data = await fetchWeather();
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
    },
  });
}
