import twilio from 'twilio';

function getTwilio() {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error('Twilio credentials not set');
  return twilio(sid, token);
}

export async function sendBookingAlertSMS(params: {
  barberPhone: string;
  barberName:  string;
  customerName:  string;
  customerPhone: string;
  serviceName:   string;
  startAt:       string;
}) {
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!from) return;

  const dateStr = new Date(params.startAt).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday:  'short',
    month:    'short',
    day:      'numeric',
    hour:     'numeric',
    minute:   '2-digit',
    hour12:   true,
  });

  const body =
    `📅 New booking at Siedel's\n` +
    `Service: ${params.serviceName}\n` +
    `Client: ${params.customerName} · ${params.customerPhone}\n` +
    `When: ${dateStr}`;

  const client = getTwilio();
  await client.messages.create({
    from,
    to:   params.barberPhone,
    body,
  });
}
