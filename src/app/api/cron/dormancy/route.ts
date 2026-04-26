import { NextRequest, NextResponse } from 'next/server';
import { applyDormancyFees } from '@/lib/gift-cards';

// Called monthly by Vercel Cron. Protected by CRON_SECRET.
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const count = await applyDormancyFees();
  return NextResponse.json({ ok: true, cardsCharged: count });
}
