import { Resend } from 'resend';

function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendGiftCardEmail(params: {
  to: string;
  code: string;
  faceValueCents: number;
  recipientName?: string;
  senderName?: string;
  giftMessage?: string;
}) {
  const resend  = getResend();
  const dollars = (params.faceValueCents / 100).toFixed(0);
  const to      = params.recipientName ? ` for ${params.recipientName}` : '';
  const from    = params.senderName    ? `From ${params.senderName}`    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Your Siedel's Gift Card</title>
<style>
  body{margin:0;padding:0;background:#0E0E0E;font-family:'Arial',sans-serif;}
  .wrap{max-width:560px;margin:0 auto;padding:40px 20px;}
  .card{background:#1A1A1A;border:1px solid #2A2A2A;padding:40px;}
  .eyebrow{font-size:11px;letter-spacing:0.3em;color:#888;margin-bottom:12px;text-transform:uppercase;}
  .logo{font-size:28px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:-0.02em;line-height:1;}
  .logo span{color:#E31B23;}
  .divider{border:none;border-top:1px solid #2A2A2A;margin:28px 0;}
  .amount-label{font-size:11px;letter-spacing:0.3em;color:#888;text-transform:uppercase;margin-bottom:8px;}
  .amount{font-size:56px;font-weight:900;color:#E31B23;line-height:1;margin-bottom:4px;}
  .subtitle{font-size:13px;color:#666;}
  .code-wrap{background:#0E0E0E;border:1px solid #2A2A2A;padding:20px 24px;margin:28px 0;text-align:center;}
  .code-label{font-size:10px;letter-spacing:0.35em;color:#666;text-transform:uppercase;margin-bottom:10px;}
  .code{font-size:26px;font-weight:700;color:#fff;letter-spacing:0.12em;font-family:'Courier New',monospace;}
  .message-box{background:#0E0E0E;border-left:3px solid #E31B23;padding:14px 18px;margin:20px 0;}
  .message-text{font-size:14px;color:#aaa;line-height:1.6;margin:0;}
  .from-text{font-size:12px;color:#666;margin-top:8px;}
  .steps{margin:28px 0;}
  .step{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;}
  .step-num{width:24px;height:24px;background:#E31B23;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:50%;}
  .step-text{font-size:13px;color:#aaa;line-height:1.5;padding-top:3px;}
  .footer{font-size:11px;color:#444;text-align:center;margin-top:32px;line-height:1.8;}
  .footer a{color:#666;text-decoration:none;}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <p class="eyebrow">Gift Card</p>
    <div class="logo">SIEDEL'S <span>BARBERSHOP</span></div>
    <hr class="divider" />

    <p class="amount-label">Gift Card Value</p>
    <p class="amount">$${dollars}</p>
    <p class="subtitle">Redeemable for any service${to}</p>

    <div class="code-wrap">
      <p class="code-label">Your Code</p>
      <p class="code">${params.code}</p>
    </div>

    <div style="text-align:center;margin:20px 0 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/gift/balance?code=${params.code}"
         style="display:inline-block;background:#E31B23;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;padding:12px 32px;">
        CHECK BALANCE ANYTIME →
      </a>
    </div>

    ${params.giftMessage ? `
    <div class="message-box">
      <p class="message-text">&ldquo;${params.giftMessage}&rdquo;</p>
      ${from ? `<p class="from-text">— ${params.senderName}</p>` : ''}
    </div>
    ` : ''}

    <hr class="divider" />

    <div class="steps">
      <p style="font-size:11px;letter-spacing:0.3em;color:#666;text-transform:uppercase;margin-bottom:16px;">How to Redeem</p>
      <div class="step">
        <div class="step-num">1</div>
        <p class="step-text">Come into Siedel's Barbershop at 982 N Court Street, Medina, Ohio.</p>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <p class="step-text">Show this email (phone or printed) or give your code at the counter.</p>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <p class="step-text">Good for any service, any barber. Partial redemptions leave a balance on the card.</p>
      </div>
    </div>

    <hr class="divider" />

    <p style="font-size:11px;color:#444;line-height:1.8;">
      This gift card does not expire. After 24 consecutive months of inactivity, a $2.50/month dormancy fee may be deducted from the remaining balance. Any use of the card resets the 24-month clock.
    </p>
  </div>

  <div class="footer">
    <p>SIEDEL&rsquo;S BARBERSHOP · 982 N COURT STREET · MEDINA, OH 44256</p>
    <p><a href="tel:+13309520777">(330) 952-0777</a></p>
    <p style="margin-top:16px;font-size:10px;color:#333;">
      Questions about your gift card? Reply to this email or call us.
    </p>
  </div>
</div>
</body>
</html>`;

  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL!,
    to:      params.to,
    subject: `Your $${dollars} Siedel's Barbershop Gift Card`,
    html,
  });
}

export async function sendBuyerReceiptEmail(params: {
  to: string;
  code: string;
  faceValueCents: number;
  recipientEmail: string;
  senderName?: string;
}) {
  const resend  = getResend();
  const dollars = (params.faceValueCents / 100).toFixed(0);

  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL!,
    to:      params.to,
    subject: `Your $${dollars} Siedel's Gift Card was delivered`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Gift Card Delivered</title>
<style>
  body{margin:0;padding:0;background:#0E0E0E;font-family:'Arial',sans-serif;}
  .wrap{max-width:560px;margin:0 auto;padding:40px 20px;}
  .card{background:#1A1A1A;border:1px solid #2A2A2A;padding:40px;}
  .eyebrow{font-size:11px;letter-spacing:0.3em;color:#888;margin-bottom:12px;text-transform:uppercase;}
  .logo{font-size:28px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:-0.02em;line-height:1;}
  .logo span{color:#E31B23;}
  .divider{border:none;border-top:1px solid #2A2A2A;margin:28px 0;}
  .body-text{font-size:14px;color:#aaa;line-height:1.7;margin:0 0 16px;}
  .code-wrap{background:#0E0E0E;border:1px solid #2A2A2A;padding:20px 24px;margin:28px 0;text-align:center;}
  .code-label{font-size:10px;letter-spacing:0.35em;color:#666;text-transform:uppercase;margin-bottom:10px;}
  .code{font-size:22px;font-weight:700;color:#fff;letter-spacing:0.12em;font-family:'Courier New',monospace;}
  .footer{font-size:11px;color:#444;text-align:center;margin-top:32px;line-height:1.8;}
  .footer a{color:#666;text-decoration:none;}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <p class="eyebrow">Gift Card Confirmation</p>
    <div class="logo">SIEDEL'S <span>BARBERSHOP</span></div>
    <hr class="divider" />
    <p class="body-text">
      Your $${dollars} gift card${params.senderName ? ` from ${params.senderName}` : ''} has been delivered to <strong style="color:#fff;">${params.recipientEmail}</strong>.
    </p>
    <p class="body-text">Keep this email as your record. The code below is the same one they received.</p>
    <div class="code-wrap">
      <p class="code-label">Gift Card Code</p>
      <p class="code">${params.code}</p>
    </div>
    <p style="font-size:12px;color:#555;line-height:1.7;">
      Good for any service at Siedel's Barbershop · 982 N Court Street, Medina, Ohio.<br />
      Questions? Reply to this email or call <a href="tel:+13309520777" style="color:#666;">(330) 952-0777</a>.
    </p>
  </div>
  <div class="footer">
    <p>SIEDEL'S BARBERSHOP · 982 N COURT STREET · MEDINA, OH 44256</p>
  </div>
</div>
</body>
</html>`,
  });
}

export async function sendShopNotificationEmail(params: {
  faceValueCents: number;
  buyerName?: string;
  buyerEmail?: string;
  recipientEmail?: string;
}) {
  const shopEmail = process.env.SHOP_NOTIFICATION_EMAIL;
  if (!shopEmail) return;

  const resend  = getResend();
  const dollars = (params.faceValueCents / 100).toFixed(0);
  const isGift  = !!params.recipientEmail;

  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL!,
    to:      shopEmail,
    subject: `New Gift Card Sale — $${dollars}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  body{margin:0;padding:0;background:#0E0E0E;font-family:'Arial',sans-serif;}
  .wrap{max-width:480px;margin:0 auto;padding:32px 20px;}
  .card{background:#1A1A1A;border:1px solid #2A2A2A;padding:32px;}
  .amount{font-size:52px;font-weight:900;color:#E31B23;line-height:1;margin:12px 0 4px;}
  .label{font-size:11px;letter-spacing:0.3em;color:#666;text-transform:uppercase;}
  .divider{border:none;border-top:1px solid #2A2A2A;margin:24px 0;}
  .row{font-size:13px;color:#aaa;margin-bottom:8px;}
  .row strong{color:#fff;}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <p class="label">New Sale · Siedel's Barbershop</p>
    <p class="amount">$${dollars}</p>
    <p style="font-size:13px;color:#666;margin:0 0 4px;">${isGift ? 'Gift card — sent to recipient' : 'Gift card — sent to buyer'}</p>
    <hr class="divider" />
    ${params.buyerName  ? `<p class="row"><strong>Buyer:</strong> ${params.buyerName}</p>` : ''}
    ${params.buyerEmail ? `<p class="row"><strong>Email:</strong> ${params.buyerEmail}</p>` : ''}
    ${params.recipientEmail ? `<p class="row"><strong>Sent to:</strong> ${params.recipientEmail}</p>` : ''}
    <hr class="divider" />
    <p style="font-size:11px;color:#444;">Powered by Hunter Systems</p>
  </div>
</div>
</body>
</html>`,
  });
}
