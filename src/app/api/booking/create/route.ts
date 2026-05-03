import { NextRequest, NextResponse } from 'next/server';
import { squareFetch, LOCATION_ID, SERVICE_VARIATION_IDS } from '@/lib/square';

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+1${digits.slice(-10)}`;
}

function uid() {
  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const {
    serviceName,
    startAt,
    teamMemberId,
    serviceVariationVersion,
    customerName,
    customerPhone,
    customerEmail,
    note,
  } = body as {
    serviceName:             string;
    startAt:                 string;
    teamMemberId:            string;
    serviceVariationVersion: number;
    customerName:            string;
    customerPhone:           string;
    customerEmail?:          string;
    note?:                   string;
  };

  const variationId = SERVICE_VARIATION_IDS[serviceName];
  if (!variationId)           return NextResponse.json({ error: 'Unknown service' },         { status: 400 });
  if (!startAt || !teamMemberId || !customerName || !customerPhone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const phone   = normalizePhone(customerPhone);
  const [first, ...rest] = customerName.trim().split(' ');
  const last    = rest.join(' ') || undefined;

  try {
    // Find or create Square customer
    let customerId: string | undefined;

    const searchRes  = await squareFetch('/v2/customers/search', {
      method: 'POST',
      body: JSON.stringify({
        query: { filter: { phone_number: { exact: phone } } },
        limit: 1,
      }),
    });
    const searchData = await searchRes.json();

    if (searchData.customers?.length) {
      customerId = searchData.customers[0].id as string;
    } else {
      const createRes  = await squareFetch('/v2/customers', {
        method: 'POST',
        body: JSON.stringify({
          idempotency_key: uid(),
          given_name:      first,
          family_name:     last,
          phone_number:    phone,
          ...(customerEmail ? { email_address: customerEmail } : {}),
        }),
      });
      const createData = await createRes.json();
      customerId = createData.customer?.id as string | undefined;
    }

    if (!customerId) {
      return NextResponse.json({ error: 'Could not create customer profile' }, { status: 502 });
    }

    // Create the booking
    const bookPayload = {
      idempotency_key: uid(),
      booking: {
        start_at:      startAt,
        location_id:   LOCATION_ID,
        customer_id:   customerId,
        ...(note ? { customer_note: note } : {}),
        appointment_segments: [{
          service_variation_id:      variationId,
          service_variation_version: serviceVariationVersion,
          team_member_id:            teamMemberId,
        }],
      },
    };
    console.log('[booking/create] sending:', JSON.stringify(bookPayload).slice(0, 400));

    const bookRes  = await squareFetch('/v2/bookings', { method: 'POST', body: JSON.stringify(bookPayload) });
    const bookText = await bookRes.text();
    console.log(`[booking/create] Square status=${bookRes.status} body=${bookText.slice(0, 600)}`);
    const bookData = JSON.parse(bookText) as Record<string, unknown>;

    type SquareError = { category?: string; code?: string; detail?: string };
    const errs = Array.isArray(bookData.errors) ? (bookData.errors as SquareError[]) : [];
    if (!bookRes.ok || errs.length > 0) {
      errs.forEach((e, i) => {
        console.error(`[booking/create] err[${i}] cat=${e.category} code=${e.code} detail=${e.detail}`);
      });
      const first = errs[0] ?? {};
      const msg   = first.detail ?? 'Booking failed';
      const code  = first.code  ?? 'UNKNOWN';
      return NextResponse.json({ error: msg, code, errors: errs }, { status: 422 });
    }

    return NextResponse.json({
      bookingId: bookData.booking.id  as string,
      startAt:   bookData.booking.start_at as string,
    });
  } catch (err) {
    console.error('[booking/create]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
