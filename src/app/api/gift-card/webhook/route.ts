import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { generateCode, createGiftCard, lookupCardBySession } from '@/lib/gift-cards';
import { sendGiftCardEmail, sendBuyerReceiptEmail, sendShopNotificationEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const secret  = process.env.STRIPE_WEBHOOK_SECRET!;
  const body    = await req.text();
  const sig     = req.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session  = event.data.object as Stripe.Checkout.Session;
  const meta     = session.metadata ?? {};
  const faceValue = Number(meta.face_value ?? 0);

  if (!faceValue || !session.customer_email) {
    return NextResponse.json({ error: 'Missing session data' }, { status: 400 });
  }

  const deliverTo = meta.recipient_email || session.customer_email;

  // Idempotency — Stripe retries failed webhooks; re-send email if already fulfilled
  const existing = await lookupCardBySession(session.id);
  if (existing) {
    await sendGiftCardEmail({
      to:             deliverTo,
      code:           existing.code,
      faceValueCents: existing.face_value_cents,
      recipientName:  existing.recipient_name  || undefined,
      senderName:     existing.sender_name     || undefined,
      giftMessage:    existing.gift_message    || undefined,
    });
    return NextResponse.json({ received: true });
  }

  // Generate a unique code (retry on collision)
  let code = generateCode();
  let attempts = 0;
  while (attempts < 5) {
    try {
      await createGiftCard({
        code,
        faceValueCents:  faceValue,
        purchaserEmail:  session.customer_email,
        recipientName:   meta.to      || undefined,
        senderName:      meta.from    || undefined,
        giftMessage:     meta.message || undefined,
        stripeSessionId: session.id,
      });
      break;
    } catch (err: unknown) {
      // Unique constraint violation — try a new code
      if (err instanceof Error && err.message.includes('unique')) {
        code = generateCode();
        attempts++;
      } else {
        throw err;
      }
    }
  }

  await sendGiftCardEmail({
    to:             deliverTo,
    code,
    faceValueCents: faceValue,
    recipientName:  meta.to      || undefined,
    senderName:     meta.from    || undefined,
    giftMessage:    meta.message || undefined,
  });

  // Buyer receipt — only when card was sent to someone else
  if (meta.recipient_email && meta.recipient_email !== session.customer_email) {
    await sendBuyerReceiptEmail({
      to:             session.customer_email,
      code,
      faceValueCents: faceValue,
      recipientEmail: meta.recipient_email,
      senderName:     meta.from || undefined,
    });
  }

  // Shop notification
  await sendShopNotificationEmail({
    faceValueCents: faceValue,
    buyerName:      meta.from          || undefined,
    buyerEmail:     session.customer_email,
    recipientEmail: meta.recipient_email || undefined,
  });

  return NextResponse.json({ received: true });
}
