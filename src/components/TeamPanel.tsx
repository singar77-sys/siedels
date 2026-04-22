import { team, PHONE_HREF, type TeamMember } from '@/data/shop';
import { slugFromName } from '@/lib/utils';
import type { Shift } from '@/lib/schedule';
import { BaseballCard } from './BaseballCard';

interface ScheduleTodayProps {
  shopHours: string | null;
  working: { firstName: string; display: string; raw: string }[];
  isClosed: boolean;
  dayName: string;
}

interface TeamPanelProps {
  onSelectMember: (member: TeamMember) => void;
  scheduleIsCurrent: boolean;
  scheduleToday: ScheduleTodayProps;
  todayShifts: Record<string, Shift>;
}

export function TeamPanel({ onSelectMember, scheduleIsCurrent, scheduleToday, todayShifts }: TeamPanelProps) {
  const getMemberShift = (memberName: string): Shift | null => {
    if (!scheduleIsCurrent) return null;
    const firstName = slugFromName(memberName);
    return todayShifts[firstName] ?? null;
  };

  return (
    <section className="min-w-full h-full snap-start grid-bg overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-8 py-16 md:py-24 w-full">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 md:mb-14">
          <div className="border-l-4 border-red pl-6 md:pl-8">
            <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">THE CREW</p>
            <h2 className="font-headline text-4xl md:text-6xl uppercase tracking-tight leading-[0.88]">
              MEET THE<br /><span className="text-stroke">SPECIALISTS</span>
            </h2>
            <p className="font-body text-base md:text-lg text-text-muted max-w-xl mt-4">
              Every skill level, from fades to full-service shaves.
            </p>
          </div>
          {scheduleIsCurrent && !scheduleToday.isClosed && scheduleToday.working.length > 0 && (
            <div className="flex items-center gap-3 bg-surface border border-red/40 px-5 py-4">
              <span className="relative flex h-2.5 w-2.5 flex-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red" />
              </span>
              <p className="font-label text-[11px] tracking-[0.3em] text-red whitespace-nowrap">
                IN TODAY · {scheduleToday.dayName.toUpperCase()}
                {scheduleToday.shopHours && (
                  <span className="text-text-subtle ml-2">· {scheduleToday.shopHours.toUpperCase()}</span>
                )}
              </p>
            </div>
          )}
        </div>

        {scheduleIsCurrent && scheduleToday.isClosed && scheduleToday.dayName === 'Sunday' && (
          <div className="mb-10 md:mb-14 bg-surface border border-line-strong p-5 md:p-6">
            <p className="font-label text-[11px] tracking-[0.3em] text-text-subtle mb-2">CLOSED TODAY</p>
            <p className="font-body text-sm text-text-muted">
              Siedel&apos;s is closed on Sundays. We&apos;ll be back Monday morning.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {team.map((member, idx) => (
            <BaseballCard
              key={member.name}
              member={member}
              idx={idx}
              shift={getMemberShift(member.name)}
              onSelect={onSelectMember}
            />
          ))}
          {/* CTA slot — same aspect as a card so the grid stays tidy */}
          <div className="card-86 scheme-red flex flex-col items-center justify-center text-center p-4 bg-red border-red">
            <p className="font-headline text-base md:text-lg uppercase tracking-tight text-white mb-1 leading-tight">YOUR CHAIR<br />IS WAITING</p>
            <p className="font-body text-[10px] text-white/70 mb-3">Call to reserve</p>
            <a
              href={PHONE_HREF}
              onClick={(e) => e.stopPropagation()}
              className="block w-full py-2 border border-white text-white font-headline text-[11px] font-bold uppercase tracking-widest text-center hover:bg-white hover:text-red transition-all duration-300"
            >
              CALL NOW
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
