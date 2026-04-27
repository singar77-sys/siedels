import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, COOKIE_NAME } from '@/lib/pin-auth';
import { chargeCard } from '@/lib/gift-cards';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value ?? '';
  const auth  = await verifyAuthToken(token);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body        = await req.json().catch(() => null);
  const cardId      = body?.cardId as string | undefined;
  const amountCents = body?.amountCents as number | undefined;

  if (!cardId || typeof amountCents !== 'number' || amountCents <= 0) {
    return NextResponse.json({ error: 'cardId and amountCents required' }, { status: 400 });
  }

  // Append staff name to POS session note for full attribution
  const baseNote = body?.note as string | undefined;
  const note     = baseNote ? `${baseNote} / ${auth.staffName}` : auth.staffName;

  try {
    const newBalance = await chargeCard(cardId, amountCents, note);
    return NextResponse.json({ ok: true, newBalanceCents: newBalance });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Charge failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
