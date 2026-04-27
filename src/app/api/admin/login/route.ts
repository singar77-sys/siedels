import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, ADMIN_COOKIE } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const body   = await req.json().catch(() => null);
  const secret = body?.secret as string | undefined;

  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = createAdminToken();
  const res   = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure:   true,
    sameSite: 'lax',
    maxAge:   24 * 60 * 60,
    path:     '/',
  });
  return res;
}
