import Image from 'next/image';
import { team, PHONE_HREF, type TeamMember } from '@/data/shop';
import { slugFromName } from '@/lib/utils';
import type { Shift } from '@/lib/schedule';

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
          {team.map((member, idx) => {
            const shift = getMemberShift(member.name);
            const isWorking = shift?.status === 'working';
            const isOff = shift?.status === 'off';
            const isOffsite = shift?.status === 'offsite';
            const isAnchor = idx === 0; // Jim — double-width
            return (
              <div
                key={member.name}
                className={`bg-surface border border-line-strong p-4 md:p-6 group hover:bg-surface-high transition-colors duration-500 cursor-pointer relative ${
                  isAnchor ? 'col-span-2 row-span-1' : ''
                }`}
                onClick={() => onSelectMember(member)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectMember(member); } }}
              >
                {shift && (
                  <div className="absolute top-3 right-3 z-10">
                    {isWorking && (
                      <div className="flex items-center gap-1.5 bg-red text-white px-2 py-1">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                        </span>
                        <span className="font-label text-[9px] tracking-widest font-bold">
                          IN · {shift.display.toUpperCase()}
                        </span>
                      </div>
                    )}
                    {isOff && (
                      <div className="bg-ink/80 border border-line-strong px-2 py-1">
                        <span className="font-label text-[9px] tracking-widest text-text-subtle">OFF TODAY</span>
                      </div>
                    )}
                    {isOffsite && (
                      <div className="bg-ink/80 border border-line-strong px-2 py-1">
                        <span className="font-label text-[9px] tracking-widest text-text-subtle">
                          {shift.location?.toUpperCase() ?? 'AWAY'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className={`${isAnchor ? 'aspect-[3/2]' : 'aspect-[3/4]'} overflow-hidden bg-surface-raised mb-4 relative ${!isWorking && shift ? 'opacity-60' : ''}`}>
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={`${member.name}, ${member.title} at Siedel's Barbershop in Medina, Ohio`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-top theme-photo group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-headline text-4xl md:text-5xl text-text-subtle">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className={`font-headline uppercase tracking-tight mb-1 text-text ${isAnchor ? 'text-xl md:text-2xl' : 'text-base md:text-xl'}`}>{member.name}</h3>
                <p className="font-label text-[8px] md:text-[10px] tracking-widest text-red mb-3">{member.title.toUpperCase()}</p>
                {isAnchor && member.bio && (
                  <p className="font-body text-xs text-text-muted leading-relaxed mb-4 line-clamp-2 hidden md:block">{member.bio}</p>
                )}
                <a
                  href={member.booking}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="block w-full py-3 border border-red text-red font-headline text-xs md:text-sm font-bold uppercase tracking-widest text-center hover:bg-red hover:text-white transition-all duration-300"
                >
                  BOOK
                </a>
              </div>
            );
          })}
          <div className="bg-red border border-red p-4 md:p-6 flex flex-col items-center justify-center text-center">
            <p className="font-headline text-lg md:text-2xl uppercase tracking-tight text-white mb-2">YOUR CHAIR<br />IS WAITING</p>
            <p className="font-body text-xs text-white/70 mb-6">Book online or call to reserve your chair.</p>
            <a
              href={PHONE_HREF}
              className="block w-full py-2 md:py-3 border border-white text-white font-headline text-xs md:text-sm font-bold uppercase tracking-widest text-center hover:bg-white hover:text-red transition-all duration-300"
            >
              CALL NOW
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
