import { NextRequest, NextResponse } from 'next/server';
import { squareFetch, LOCATION_ID, TEAM_IDS, SERVICE_VARIATION_IDS, ID_TO_NAME } from '@/lib/square';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const { serviceName, staffName, date } = body as {
    serviceName: string;
    staffName: string | null;
    date: string; // YYYY-MM-DD
  };

  const variationId = SERVICE_VARIATION_IDS[serviceName];
  if (!variationId) return NextResponse.json({ error: 'Unknown service' }, { status: 400 });

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
  }

  const segmentFilter: Record<string, unknown> = { service_variation_id: variationId };
  if (staffName && TEAM_IDS[staffName]) {
    segmentFilter.team_member_id_filter = { any: [TEAM_IDS[staffName]] };
  }

  // Cover the full shop day in Eastern time (EDT = -04:00, May–Nov)
  const startAt = `${date}T08:00:00-04:00`;
  const endAt   = `${date}T20:30:00-04:00`;

  try {
    const res = await squareFetch('/v2/bookings/availability/search', {
      method: 'POST',
      body: JSON.stringify({
        query: {
          filter: {
            start_at_range: { start_at: startAt, end_at: endAt },
            location_id: LOCATION_ID,
            segment_filters: [segmentFilter],
          },
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[booking/availability] Square error:', data);
      return NextResponse.json({ error: 'Could not load availability' }, { status: 502 });
    }

    interface SquareSegment {
      team_member_id: string;
      service_variation_version: number;
    }
    interface SquareAvailability {
      start_at: string;
      appointment_segments: SquareSegment[];
    }

    const slots = (data.availabilities ?? [] as SquareAvailability[]).flatMap(
      (a: SquareAvailability) =>
        a.appointment_segments.map(seg => ({
          startAt:                 a.start_at,
          teamMemberId:            seg.team_member_id,
          teamMemberName:          ID_TO_NAME[seg.team_member_id] ?? seg.team_member_id,
          serviceVariationVersion: seg.service_variation_version,
        }))
    );

    return NextResponse.json({ slots });
  } catch (err) {
    console.error('[booking/availability]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
