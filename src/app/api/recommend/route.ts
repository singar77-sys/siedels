import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { services } from '@/data/shop';

const client = new Anthropic();

const SERVICE_LIST = services
  .map((s) => `- ${s.name} (${s.price}): ${s.tagline}. ${s.description.slice(0, 120)}`)
  .join('\n');

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const query = body?.query?.trim();
  if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 });

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: `You are a booking assistant for Siedel's Barbershop in Medina, Ohio. Pick the single best service from this list for what the customer describes. Respond with JSON only — no markdown, no extra text.

Services:
${SERVICE_LIST}

Response format: {"name":"exact service name","reason":"one short sentence explaining why this fits"}`,
      messages: [{ role: 'user', content: query }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : '';
    const parsed = JSON.parse(text);
    const match = services.find((s) => s.name === parsed.name);
    if (!match) return NextResponse.json({ error: 'No match' }, { status: 422 });

    return NextResponse.json({ service: match, reason: parsed.reason });
  } catch (err) {
    console.error('[recommend]', err);
    return NextResponse.json({ error: 'Recommendation failed' }, { status: 500 });
  }
}
