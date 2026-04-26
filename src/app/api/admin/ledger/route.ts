import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, COOKIE_NAME } from '@/lib/pin-auth';
import { getLedgerData } from '@/lib/gift-cards';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value ?? '';
  if (!verifyAuthToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getLedgerData();
  return NextResponse.json(data);
}
