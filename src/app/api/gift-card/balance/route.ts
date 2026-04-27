import { NextRequest, NextResponse } from 'next/server';
import { lookupCard } from '@/lib/gift-cards';

const rl = new Map<string, { count: number; resetAt: number }>();
function isLimited(ip: string): boolean {
  const now = Date.now();
  const e = rl.get(ip);
  if (!e || now > e.resetAt) { rl.set(ip, { count: 1, resetAt: now + 60_000 }); return false; }
  if (e.count >= 10) return true;
  e.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (isLimited(ip)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

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
