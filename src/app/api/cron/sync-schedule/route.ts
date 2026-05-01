import { NextRequest, NextResponse } from 'next/server';
import { syncSchedule } from '@/lib/sync-square-schedule';

// Triggered weekly by Vercel Cron (vercel.json). Protected by CRON_SECRET.
// Reads the Google Sheet, reconciles INTERNAL-BLOCKED bookings in Square so
// that off / partial-shift / offsite time is unbookable for customers.
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const result = await syncSchedule();
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
