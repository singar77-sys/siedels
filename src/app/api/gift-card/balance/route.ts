import { NextRequest, NextResponse } from 'next/server';
import { lookupCard } from '@/lib/gift-cards';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const code = String(body.code ?? '').trim().toUpperCase();
  if (!code) return NextResponse.json({ error: 'Code is required' }, { status: 400 });

  const card = await lookupCard(code);
  if (!card) return NextResponse.json({ error: 'Gift card not found' }, { status: 404 });

  return NextResponse.json({
    code:           card.code,
    balanceCents:   card.balance_cents,
    faceValueCents: card.face_value_cents,
    status:         card.status,
    recipientName:  card.recipient_name,
    lastActivityAt: card.last_activity_at,
  });
}
