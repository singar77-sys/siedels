import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/admin-auth';
import { creditCard } from '@/lib/gift-cards';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value ?? '';
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { cardId, amountCents, note } = await req.json().catch(() => ({}));
  if (!cardId || !amountCents || amountCents <= 0) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const newBalance = await creditCard(cardId, Math.round(amountCents), note);
  return NextResponse.json({ newBalanceCents: newBalance });
}
