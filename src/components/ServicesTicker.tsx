'use client';

/**
 * Thin "IN THE CHAIR TODAY" marquee that sits above the services
 * program page. Pulls working-barbers list from the schedule sheet.
 * Silent when no barbers working or schedule unknown — never shows a
 * fake stub. Marquee animation respects prefers-reduced-motion (falls
 * back to a static truncated list).
 */

interface Props {
  working: { firstName: string }[];
  scheduleKnown: boolean;
}

export function ServicesTicker({ working, scheduleKnown }: Props) {
  if (!scheduleKnown || working.length === 0) return null;

  // Ticker content — repeated a few times so the CSS translateX loop
  // never shows empty space on wide viewports.
  const names = working.map((w) => w.firstName.toUpperCase()).join(' · ');
  const segment = `IN THE CHAIR TODAY · ${names}`;
  const content = `${segment} · ${segment} · ${segment} · ${segment}`;

  return (
    <div
      className="services-ticker relative border-y border-line-strong bg-surface/50 overflow-hidden py-2 mb-10"
      aria-label={`Barbers working today: ${names}`}
    >
      <div className="services-ticker-track flex whitespace-nowrap">
        <span
          aria-hidden="true"
          className="font-headline text-[11px] md:text-xs font-bold tracking-[0.3em] text-text-muted px-3"
        >
          {content}
        </span>
      </div>
      {/* Soft edge fades so names slide in/out without a hard cut */}
      <span className="services-ticker-fade services-ticker-fade--left" aria-hidden="true" />
      <span className="services-ticker-fade services-ticker-fade--right" aria-hidden="true" />
    </div>
  );
}
