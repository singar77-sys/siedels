import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, COOKIE_NAME } from '@/lib/pin-auth';
import { getDb } from '@/lib/db';
import { sendGiftCardEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value ?? '';
  if (!verifyAuthToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { cardId } = await req.json().catch(() => ({}));
  if (!cardId) return NextResponse.json({ error: 'cardId required' }, { status: 400 });

  const sql = getDb();
  const [card] = await sql`SELECT * FROM gift_cards WHERE id = ${cardId}`;
  if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

  await sendGiftCardEmail({
    to:             card.purchaser_email,
    code:           card.code,
    faceValueCents: card.face_value_cents,
    recipientName:  card.recipient_name || undefined,
    senderName:     card.sender_name    || undefined,
    giftMessage:    card.gift_message   || undefined,
  });

  return NextResponse.json({ sent: true, to: card.purchaser_email });
}
