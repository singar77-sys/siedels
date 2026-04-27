import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, COOKIE_NAME } from '@/lib/pin-auth';
import { creditCard } from '@/lib/gift-cards';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value ?? '';
  if (!verifyAuthToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { cardId, amountCents, note } = await req.json().catch(() => ({}));
  if (!cardId || !amountCents || amountCents <= 0) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const newBalance = await creditCard(cardId, Math.round(amountCents), note);
  return NextResponse.json({ newBalanceCents: newBalance });
}
