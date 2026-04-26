import { NextRequest, NextResponse } from 'next/server';
import { createAuthToken, isLockedOut, recordAttempt, COOKIE_NAME } from '@/lib/pin-auth';

export async function POST(req: NextRequest) {
  const ip   = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const body = await req.json().catch(() => null);
  const pin  = body?.pin as string | undefined;

  if (!pin) return NextResponse.json({ error: 'PIN required' }, { status: 400 });

  if (await isLockedOut(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 }
    );
  }

  const correct = pin === process.env.GIFT_CARD_PIN;
  await recordAttempt(ip, correct);

  if (!correct) {
    return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 });
  }

  const token = createAuthToken();
  const res   = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   true,
    sameSite: 'lax',
    maxAge:   8 * 60 * 60,
    path:     '/',
  });
  return res;
}
