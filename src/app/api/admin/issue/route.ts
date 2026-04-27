import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, COOKIE_NAME } from '@/lib/pin-auth';
import { generateCode, createGiftCard } from '@/lib/gift-cards';
import { sendGiftCardEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value ?? '';
  if (!verifyAuthToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { faceValueCents, recipientName, senderName, purchaserEmail, sendEmail } =
    await req.json().catch(() => ({}));

  if (!faceValueCents || faceValueCents < 2500) {
    return NextResponse.json({ error: 'Minimum $25' }, { status: 400 });
  }

  let code = generateCode();
  for (let i = 0; i < 5; i++) {
    try {
      await createGiftCard({
        code,
        faceValueCents,
        purchaserEmail: purchaserEmail?.trim() || 'in-person',
        recipientName:  recipientName?.trim()  || undefined,
        senderName:     senderName?.trim()     || undefined,
      });
      break;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('unique') && i < 4) {
        code = generateCode();
      } else {
        throw err;
      }
    }
  }

  if (sendEmail && purchaserEmail?.trim()) {
    await sendGiftCardEmail({
      to:             purchaserEmail.trim(),
      code,
      faceValueCents,
      recipientName:  recipientName?.trim() || undefined,
      senderName:     senderName?.trim()    || undefined,
    });
  }

  return NextResponse.json({ code, faceValueCents });
}
