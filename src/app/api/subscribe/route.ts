import { NextRequest, NextResponse } from 'next/server';

const FORMSPREE_URL = process.env.FORMSPREE_URL ?? 'https://formspree.io/f/meepnyaj';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || typeof body.email !== 'string') {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  const res = await fetch(FORMSPREE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: body.email,
      _subject: "Siedel's — New email signup",
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Submission failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
