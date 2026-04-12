import Link from 'next/link';
import { team, PHONE, PHONE_HREF } from '@/data/shop';
import type { SerializableWeekSchedule, WeekRelation } from '@/lib/schedule';

function getClientTodayIso(): string {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = fmt.formatToParts(new Date()).reduce<Record<string, string>>((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function formatShortDate(iso: string | null): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

interface SchedulePanelProps {
  scheduleWeek: SerializableWeekSchedule;
  scheduleRelation: WeekRelation;
  scheduleDaysUntilStart: number | null;
}

export function SchedulePanel({ scheduleWeek, scheduleRelation, scheduleDaysUntilStart }: SchedulePanelProps) {
  const todayIso = getClientTodayIso();

  return (
    <section className="min-w-full h-full snap-start grid-bg overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-24 w-full">
        <div className="border-l-4 border-red pl-8 mb-10 md:mb-14">
          <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">
            {scheduleRelation === 'upcoming' ? 'NEXT WEEK' : 'WEEKLY ROSTER'}
          </p>
          <h2 className="font-headline text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
            {scheduleRelation === 'upcoming' ? 'COMING' : 'THIS'}<br />
            <span className="text-stroke">{scheduleRelation === 'upcoming' ? 'UP' : 'WEEK'}</span>
          </h2>
          <p className="font-body text-base md:text-lg text-text-muted max-w-2xl mt-6">
            Who&apos;s in the chair, when. Updated weekly. Walk-ins welcome every day but Sunday.
          </p>
        </div>

        {scheduleWeek.stale && (
          <div className="mb-8 bg-surface border border-red/40 p-5">
            <p className="font-label text-[11px] tracking-[0.3em] text-red mb-2">SCHEDULE UNAVAILABLE</p>
            <p className="font-body text-sm text-text-muted">
              Call <a href={PHONE_HREF} className="text-red hover:underline">{PHONE}</a> for today&apos;s hours.
            </p>
          </div>
        )}

        {!scheduleWeek.stale && scheduleRelation === 'upcoming' && scheduleDaysUntilStart !== null && (
          <div className="mb-8 bg-surface border border-red/40 p-5">
            <p className="font-label text-[11px] tracking-[0.3em] text-red mb-2">NEXT WEEK&apos;S SCHEDULE</p>
            <p className="font-body text-sm text-text-muted">
              Showing the week starting {scheduleDaysUntilStart === 1 ? 'tomorrow' : `in ${scheduleDaysUntilStart} days`}. For today&apos;s hours call{' '}
              <a href={PHONE_HREF} className="text-red hover:underline">{PHONE}</a>.
            </p>
          </div>
        )}

        {!scheduleWeek.stale && scheduleWeek.days.length > 0 && (
          <div className="bg-surface border border-line-strong overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-red/40">
                  <th className="sticky left-0 bg-surface z-10 text-left p-4 font-label text-[10px] tracking-widest text-text-subtle border-r border-line-strong">
                    BARBER
                  </th>
                  {scheduleWeek.days.map((d) => {
                    const isToday = d.date === todayIso;
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
                          {formatShortDate(d.date)}
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
                {team.map((member, idx) => {
                  const firstName = member.name.split(/\s+/)[0].toLowerCase();
                  const hasData = scheduleWeek.days.some((d) => d.shifts[firstName]);
                  if (!hasData) return null;
                  const zebra = idx % 2 === 0 ? 'bg-surface' : 'bg-ink/50';
                  return (
                    <tr key={firstName} className={`border-b border-line-strong last:border-b-0 ${zebra}`}>
                      <td className={`sticky left-0 z-10 p-4 font-headline text-sm md:text-base font-black uppercase tracking-tight text-white border-r border-line-strong whitespace-nowrap ${zebra}`}>
                        <span className="inline-block w-1 h-5 bg-red mr-3 align-middle" />
                        {member.name.toUpperCase()}
                      </td>
                      {scheduleWeek.days.map((d) => {
                        const shift = d.shifts[firstName];
                        const isToday = d.date === todayIso;
                        const cellBase = `p-4 border-r border-line-strong last:border-r-0 ${isToday ? 'bg-red/15' : ''}`;
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
                              <span className="font-label text-[10px] tracking-widest text-text-faint">OFF</span>
                            </td>
                          );
                        }
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
            UPDATES EVERY 30 MINUTES · SCHEDULE LAST SYNCED {new Date(scheduleWeek.fetchedAt).toLocaleString('en-US', { timeZone: 'America/New_York' })}
          </p>
          <Link
            href="/schedule"
            className="font-label text-[10px] tracking-widest text-red hover:text-red-hover transition-colors"
          >
            FULL SCHEDULE PAGE →
          </Link>
        </div>
      </div>
    </section>
  );
}
