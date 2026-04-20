import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { fetchSchedule, todayInMedina } from '@/lib/schedule';
import { team, PHONE, PHONE_HREF } from '@/data/shop';
import { slugFromName } from '@/lib/utils';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "This Week's Schedule | Siedel's Barbershop | Medina, Ohio",
  description:
    "See which barbers are working this week at Siedel's Barbershop in Medina, Ohio. Live schedule updated weekly.",
  alternates: { canonical: '/schedule' },
  openGraph: {
    title: "This Week's Schedule | Siedel's Barbershop",
    description: "See which barbers are working this week at Siedel's Barbershop in Medina, Ohio.",
    images: [{ url: '/images/siedels-barbershop-medina-ohio.webp', width: 1920, height: 1080, alt: "Siedel's Barbershop in Medina Ohio" }],
  },
};

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function SchedulePage() {
  const week = await fetchSchedule();
  const today = todayInMedina();

  // Build an ordered staff list: use the order from shop.ts data so the page
  // matches the team grid. Fall back to alphabetical for anyone in the sheet
  // we don't know about.
  const orderedFirstNames: string[] = [];
  const seen = new Set<string>();
  team.forEach((m) => {
    const fn = slugFromName(m.name);
    if (!seen.has(fn)) {
      orderedFirstNames.push(fn);
      seen.add(fn);
    }
  });
  // Append any extra names from the sheet that aren't in shop.ts
  const sheetNames = new Set<string>();
  week.days.forEach((d) => d.shifts.forEach((_, n) => sheetNames.add(n)));
  Array.from(sheetNames)
    .sort()
    .forEach((n) => {
      if (!seen.has(n)) {
        orderedFirstNames.push(n);
        seen.add(n);
      }
    });

  // Only render staff who actually appear in the sheet
  const staff = orderedFirstNames.filter((n) => sheetNames.has(n));

  return (
    <>
      <Nav />
      <main id="main" className="grid-bg min-h-screen pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="border-l-4 border-red pl-6 md:pl-8 mb-10 md:mb-14">
            <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">
              {week.relation === 'upcoming' ? 'NEXT WEEK' : 'WEEKLY ROSTER'}
            </p>
            <h1 className="font-headline text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
              {week.relation === 'upcoming' ? 'COMING' : 'THIS'}<br />
              <span className="text-stroke">{week.relation === 'upcoming' ? 'UP' : 'WEEK'}</span>
            </h1>
            <p className="font-body text-base md:text-lg text-text-muted max-w-2xl mt-6">
              Who&apos;s in the chair, when.
            </p>
          </div>

          {week.stale && (
            <div className="mb-8 bg-surface border border-red/40 p-5">
              <p className="font-label text-[11px] tracking-[0.3em] text-red mb-2">SCHEDULE UNAVAILABLE</p>
              <p className="font-body text-sm text-text-muted">
                We can&apos;t load the schedule right now. Please call{' '}
                <a href={PHONE_HREF} className="text-red hover:underline">
                  {PHONE}
                </a>{' '}
                for today&apos;s hours.
              </p>
            </div>
          )}

          {!week.stale && week.relation === 'upcoming' && week.daysUntilStart !== null && (
            <div className="mb-8 bg-surface border border-red/40 p-5">
              <p className="font-label text-[11px] tracking-[0.3em] text-red mb-2">NEXT WEEK&apos;S SCHEDULE</p>
              <p className="font-body text-sm text-text-muted">
                Showing the week starting {week.daysUntilStart === 1 ? 'tomorrow' : `in ${week.daysUntilStart} days`}. For today&apos;s hours call{' '}
                <a href={PHONE_HREF} className="text-red hover:underline">
                  {PHONE}
                </a>
                .
              </p>
            </div>
          )}

          {!week.stale && week.relation === 'past' && (
            <div className="mb-8 bg-surface border border-red/40 p-5">
              <p className="font-label text-[11px] tracking-[0.3em] text-red mb-2">SCHEDULE UPDATING</p>
              <p className="font-body text-sm text-text-muted">
                This week&apos;s schedule is being updated. Call{' '}
                <a href={PHONE_HREF} className="text-red hover:underline">
                  {PHONE}
                </a>{' '}
                to confirm today&apos;s availability.
              </p>
            </div>
          )}

          {!week.stale && week.days.length > 0 && (
            <div className="bg-surface border border-line-strong overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-red/40">
                    <th className="sticky left-0 bg-surface z-10 text-left p-4 font-label text-[10px] tracking-widest text-text-subtle border-r border-line-strong">
                      BARBER
                    </th>
                    {week.days.map((d) => {
                      const isToday = d.date === today.iso;
                      return (
                        <th
                          key={d.dayName}
                          className={`text-left p-4 font-label tracking-widest border-r border-line-strong last:border-r-0 ${
                            isToday ? 'bg-red text-white' : 'text-white'
                          }`}
                        >
                          <div className="font-black text-sm tracking-widest">
                            {d.dayName.substring(0, 3).toUpperCase()}
                          </div>
                          <div className={`text-[10px] mt-0.5 ${isToday ? 'text-white/85' : 'text-text-muted'}`}>
                            {formatDate(d.date)}
                          </div>
                          <div className={`text-[10px] mt-1 font-normal normal-case tracking-normal ${isToday ? 'text-white/85' : 'text-text-subtle'}`}>
                            {d.shopHours}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {staff.map((firstName, idx) => {
                    // Find matching team member for name display + booking link
                    const member = team.find(
                      (m) => slugFromName(m.name) === firstName
                    );
                    const displayName = member?.name.toUpperCase() ?? firstName.toUpperCase();
                    const zebra = idx % 2 === 0 ? 'bg-surface' : 'bg-ink/50';
                    return (
                      <tr key={firstName} className={`border-b border-line-strong last:border-b-0 ${zebra}`}>
                        <td className={`sticky left-0 z-10 p-4 font-headline text-sm md:text-base font-black uppercase tracking-tight text-white border-r border-line-strong whitespace-nowrap ${zebra}`}>
                          <span className="inline-block w-1 h-5 bg-red mr-3 align-middle" />
                          {displayName}
                        </td>
                        {week.days.map((d) => {
                          const shift = d.shifts.get(firstName);
                          const isToday = d.date === today.iso;
                          const cellBase = `p-4 border-r border-line-strong last:border-r-0 ${
                            isToday ? 'bg-red/15' : ''
                          }`;
                          if (!shift) {
                            return (
                              <td key={d.dayName} className={cellBase}>
                                <span className="text-text-faint">—</span>
                              </td>
                            );
                          }
                          if (shift.status === 'working') {
                            return (
                              <td key={d.dayName} className={cellBase}>
                                <span className="font-headline text-base font-bold text-white whitespace-nowrap">
                                  {shift.display}
                                </span>
                              </td>
                            );
                          }
                          if (shift.status === 'off') {
                            return (
                              <td key={d.dayName} className={cellBase}>
                                <span className="font-label text-[10px] tracking-widest text-text-faint">
                                  OFF
                                </span>
                              </td>
                            );
                          }
                          // offsite
                          return (
                            <td key={d.dayName} className={cellBase}>
                              <span className="font-label text-[10px] tracking-widest text-text-subtle">
                                {shift.location?.toUpperCase() ?? 'AWAY'}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="font-label text-[10px] tracking-widest text-text-subtle">
              SCHEDULE LAST SYNCED {new Date(week.fetchedAt).toLocaleString('en-US', { timeZone: 'America/New_York' })}
            </p>
            <Link
              href="/team"
              className="font-label text-[10px] tracking-widest text-red hover:text-red-hover transition-colors"
            >
              ← MEET THE CREW
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
