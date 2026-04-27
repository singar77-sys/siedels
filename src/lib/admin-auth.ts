import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_COOKIE = 'gc_admin';
const SESSION_MS = 24 * 60 * 60 * 1000; // 24 hours

function hmac(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('hex');
}

export function createAdminToken(): string {
  const secret  = process.env.ADMIN_SECRET!;
  const payload = Buffer.from(JSON.stringify({ ts: Date.now() })).toString('base64url');
  const sig     = hmac(payload, secret);
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string): boolean {
  try {
    const secret = process.env.ADMIN_SECRET!;
    const dot    = token.lastIndexOf('.');
    if (dot === -1) return false;
    const payload  = token.slice(0, dot);
    const sig      = token.slice(dot + 1);
    const expected = hmac(payload, secret);
    if (!timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return Date.now() - data.ts <= SESSION_MS;
  } catch {
    return false;
  }
}
