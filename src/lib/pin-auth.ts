import { createHmac, timingSafeEqual } from 'crypto';
import bcrypt from 'bcryptjs';
import { getDb } from './db';

export const COOKIE_NAME  = 'gc_auth';
const SESSION_MS   = 8 * 60 * 60 * 1000; // 8 hours
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 15 * 60 * 1000; // 15 minutes

export const BCRYPT_ROUNDS = 10;

function hmac(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('hex');
}

export async function findStaffByPin(
  pin: string
): Promise<{ id: string; name: string; pinHash: string } | null> {
  const sql   = getDb();
  const staff = await sql`SELECT id, name, pin_hash FROM staff WHERE active = TRUE`;
  for (const member of staff) {
    if (await bcrypt.compare(pin, member.pin_hash)) {
      return { id: member.id, name: member.name, pinHash: member.pin_hash };
    }
  }
  return null;
}

export function createAuthToken(
  staffId:   string,
  staffName: string,
  pinHash:   string
): string {
  const secret  = process.env.GIFT_CARD_PIN_SECRET!;
  const payload = Buffer.from(
    JSON.stringify({ ts: Date.now(), sid: staffId, sn: staffName, ph: pinHash })
  ).toString('base64url');
  const sig = hmac(payload, secret);
  return `${payload}.${sig}`;
}

export async function verifyAuthToken(
  token: string
): Promise<{ staffId: string; staffName: string } | null> {
  try {
    const secret = process.env.GIFT_CARD_PIN_SECRET!;
    const dot    = token.lastIndexOf('.');
    if (dot === -1) return null;
    const payload = token.slice(0, dot);
    const sig     = token.slice(dot + 1);
    const expected = hmac(payload, secret);
    if (!timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (Date.now() - data.ts > SESSION_MS) return null;
    // Verify staff is still active and their PIN hash hasn't changed
    const sql = getDb();
    const [staff] = await sql`
      SELECT id, name, pin_hash FROM staff WHERE id = ${data.sid} AND active = TRUE
    `;
    if (!staff) return null;
    if (staff.pin_hash !== data.ph) return null;
    return { staffId: staff.id, staffName: staff.name };
  } catch {
    return null;
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
