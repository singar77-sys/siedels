import { createHmac, createHash, timingSafeEqual } from 'crypto';
import { getDb } from './db';

export const COOKIE_NAME = 'gc_auth';
const SESSION_MS = 8 * 60 * 60 * 1000; // 8 hours
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function hashPin(pin: string): string {
  return createHash('sha256').update(pin).digest('hex');
}

function hmac(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('hex');
}

export function createAuthToken(): string {
  const pin    = process.env.GIFT_CARD_PIN!;
  const secret = process.env.GIFT_CARD_PIN_SECRET!;
  const payload = Buffer.from(JSON.stringify({ ts: Date.now(), ph: hashPin(pin) })).toString('base64url');
  const sig     = hmac(payload, secret);
  return `${payload}.${sig}`;
}

export function verifyAuthToken(token: string): boolean {
  try {
    const secret = process.env.GIFT_CARD_PIN_SECRET!;
    const pin    = process.env.GIFT_CARD_PIN!;
    const dot    = token.lastIndexOf('.');
    if (dot === -1) return false;
    const payload = token.slice(0, dot);
    const sig     = token.slice(dot + 1);
    const expected = hmac(payload, secret);
    if (!timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (Date.now() - data.ts > SESSION_MS) return false;
    if (data.ph !== hashPin(pin)) return false; // PIN changed → logged out
    return true;
  } catch {
    return false;
  }
}

export async function isLockedOut(ip: string): Promise<boolean> {
  const sql    = getDb();
  const cutoff = new Date(Date.now() - LOCKOUT_MS).toISOString();
  const [row]  = await sql`
    SELECT COUNT(*)::int AS count FROM pin_attempts
    WHERE ip = ${ip} AND succeeded = FALSE AND attempted_at > ${cutoff}
  `;
  return row.count >= MAX_ATTEMPTS;
}

export async function recordAttempt(ip: string, succeeded: boolean): Promise<void> {
  const sql = getDb();
  await sql`INSERT INTO pin_attempts (ip, succeeded) VALUES (${ip}, ${succeeded})`;
}
