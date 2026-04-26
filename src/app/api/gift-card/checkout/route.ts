import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Fee structure:
//   Customer pays face value + $1.50 processing fee
//   $1.50 application_fee routes to Mark's platform account via Stripe Connect
//   Jim's connected account receives face_value minus Stripe's processing fee

const HANDLING_CENTS = 150; // $1.50 to platform
const MIN_AMOUNT     = 25;
const PRESET_AMOUNTS = new Set([25, 50, 100]);

const baseUrl = () => process.env.NEXT_PUBLIC_BASE_URL ?? 'https://siedels.vercel.app';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body   = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const { amount, to, from, message, buyerEmail } = body as {
    amount:      number;
    to?:         string;
    from?:       string;
    message?:    string;
    buyerEmail?: string;
  };

  if (
    typeof amount !== 'number' ||
    !Number.isInteger(amount) ||
    amount < MIN_AMOUNT ||
    amount > 10_000
  ) {
    return NextResponse.json({ error: `Amount must be a whole dollar value between $${MIN_AMOUNT} and $10,000` }, { status: 400 });
  }

  const amountCents = amount * 100;
  const url         = baseUrl();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: buyerEmail || undefined,
    line_items: [
      {
        price_data: {
          currency:     'usd',
          unit_amount:  amountCents,
          product_data: {
            name: `Siedel's Barbershop Gift Card – $${amount}`,
            description: to
              ? `A gift for ${to} — good for any service at Siedel's in Medina, Ohio.`
              : "Good for any service at Siedel's Barbershop in Medina, Ohio.",
            images: [`${url}/images/siedels-storefront-summer-clouds-medina-ohio.webp`],
          },
        },
        quantity: 1,
      },
      {
        price_data: {
          currency:     'usd',
          unit_amount:  HANDLING_CENTS,
          product_data: { name: 'Processing fee' },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    payment_intent_data: {
      application_fee_amount: HANDLING_CENTS,
      transfer_data: {
        destination: process.env.JIMS_STRIPE_ACCOUNT_ID!,
      },
    },
    metadata: {
      to:          to      ?? '',
      from:        from    ?? '',
      message:     message ?? '',
      amount:      String(amount),
      face_value:  String(amountCents),
      buyer_email: buyerEmail ?? '',
    },
    success_url: `${url}/gift/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${url}/gift`,
  });

  return NextResponse.json({ url: session.url });
}
