import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/admin-auth';
import { getLedgerData } from '@/lib/gift-cards';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value ?? '';
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getLedgerData();
  return NextResponse.json(data);
}
