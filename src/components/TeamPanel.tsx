import { team, PHONE_HREF, type TeamMember } from '@/data/shop';
import { slugFromName } from '@/lib/utils';
import type { Shift } from '@/lib/schedule';
import { BaseballCard } from './BaseballCard';

interface ScheduleTodayProps {
  shopHours: string | null;
  working: { firstName: string; display: string; raw: string }[];
  isClosed: boolean;
  scheduleKnown: boolean;
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
    <section className="w-full flex-none h-full snap-start grid-bg overflow-hidden">
      <div className="max-w-screen-2xl mx-auto h-full px-4 md:px-8 py-5 md:py-8 w-full flex flex-col">

        {/* ── HEADER — matches ServicesPanel / GalleryPanel exactly ── */}
        <div className="flex-none">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-4 md:mb-5">
            <div className="border-l-4 border-red pl-4 md:pl-6">
              <p className="font-label text-[10px] tracking-[0.3em] text-red mb-1">THE CREW</p>
              <h2 className="font-headline text-2xl md:text-4xl uppercase tracking-tight leading-[0.9]">
                MEET THE <span className="text-stroke">TEAM</span>
              </h2>
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
            <div className="mb-4 md:mb-5 bg-surface border border-line-strong p-3 md:p-4">
              <p className="font-label text-[10px] tracking-[0.3em] text-text-subtle mb-1">CLOSED TODAY</p>
              <p className="font-body text-xs text-text-muted">
                Siedel&apos;s is closed on Sundays. We&apos;ll be back Monday morning.
              </p>
            </div>
          )}
        </div>

        {/* ── CARD GRID — scrolls within the pinned frame ── */}
        <div className="no-scrollbar flex-1 min-h-0 overflow-y-auto pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
            {team.map((member) => (
              <BaseballCard
                key={member.name}
                member={member}
                shift={getMemberShift(member.name)}
                onSelect={onSelectMember}
              />
            ))}
            {/* CTA slot — same aspect as a card so the grid stays tidy.
                Inline style for bg/border because .card-86 (in baseball-card.css,
                imported after Tailwind) sets background:var(--surface) and a
                text-colored border, which would otherwise beat bg-red/border-red
                utilities at the same specificity. Inline wins everywhere and
                follows the active --red token through every theme/team palette. */}
            <div
              className="card-86 scheme-red flex flex-col items-center justify-center text-center p-4"
              style={{ background: 'var(--red)', borderColor: 'var(--red)' }}
            >
              <p className="font-headline text-base md:text-lg uppercase tracking-tight text-white mb-1 leading-tight">YOUR CHAIR<br />IS WAITING</p>
              <p className="font-body text-[11px] text-white/85 mb-3">Call to reserve</p>
              <a
                href={PHONE_HREF}
                onClick={(e) => e.stopPropagation()}
                className="block w-full min-h-11 py-3 border border-white text-white font-headline text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center hover:bg-white hover:text-red transition-all duration-300"
              >
                CALL NOW
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
