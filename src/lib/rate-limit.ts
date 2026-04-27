import { getDb } from './db';

export async function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const sql    = getDb();
  const cutoff = new Date(Date.now() - windowMs).toISOString();
  const [row]  = await sql`
    SELECT COUNT(*)::int AS count FROM rate_limit_hits
    WHERE key = ${key} AND hit_at > ${cutoff}
  `;
  return row.count >= limit;
}

export async function recordHit(key: string): Promise<void> {
  const sql = getDb();
  await sql`INSERT INTO rate_limit_hits (key) VALUES (${key})`;
}
