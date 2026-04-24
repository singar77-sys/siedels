import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Fee structure (Jaworski method):
//   PLATFORM_PCT  → 10% of face value, visible to client as "platform fee"
//   HANDLING_CENTS → $1.50 flat per transaction, handling overhead (internal)
//   Total application_fee = HANDLING_CENTS + (amount_cents × PLATFORM_PCT)
//   Connected account (Jim's Stripe) receives: amount_cents − application_fee

const PLATFORM_PCT = 0.10;
const HANDLING_CENTS = 150;

const VALID_AMOUNTS = new Set([25, 50, 75, 100]);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const { amount, to, from, message } = body as {
    amount: number;
    to?: string;
    from?: string;
    message?: string;
  };

  if (!VALID_AMOUNTS.has(amount)) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  const amountCents = amount * 100;
  const applicationFeeCents = Math.round(amountCents * PLATFORM_PCT + HANDLING_CENTS);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://siedels.vercel.app';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: amountCents,
          product_data: {
            name: `Siedel's Barbershop Gift Card – $${amount}`,
            description: to
              ? `A gift for ${to} — redeemable for any service at Siedel's in Medina, Ohio.`
              : 'Redeemable for any service at Siedel\'s Barbershop in Medina, Ohio.',
            images: [`${baseUrl}/images/siedels-barbershop-storefront-medina-ohio.webp`],
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    application_fee_amount: applicationFeeCents,
    transfer_data: {
      destination: process.env.JIMS_STRIPE_ACCOUNT_ID!,
    },
    metadata: {
      to: to ?? '',
      from: from ?? '',
      message: message ?? '',
      amount: String(amount),
    },
    success_url: `${baseUrl}/gift/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/gift`,
  });

  return NextResponse.json({ url: session.url });
}
