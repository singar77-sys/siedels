import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, COOKIE_NAME } from '@/lib/pin-auth';
import { lookupCard } from '@/lib/gift-cards';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value ?? '';
  if (!verifyAuthToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const code = body?.code as string | undefined;
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });

  const card = await lookupCard(code);
  if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

  return NextResponse.json({
    id:            card.id,
    code:          card.code,
    balanceCents:  card.balance_cents,
    faceValueCents: card.face_value_cents,
    status:        card.status,
    recipientName: card.recipient_name,
  });
}
