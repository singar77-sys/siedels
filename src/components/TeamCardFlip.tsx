'use client';

import { useEffect, useState } from 'react';
import { BaseballCard } from './BaseballCard';
import { Logo } from './Logo';
import { getYears, type TeamMember } from '@/data/shop';
import type { Shift } from '@/lib/schedule';

/**
 * Modal content for a team member — the card flips from front to
 * back on open. Click again to flip back. CSS handles the 3D
 * rotation; this component wires up state + auto-flip timer.
 */

const DAY_ABBREVS = [
  { name: 'Monday',    abbr: 'MON' },
  { name: 'Tuesday',   abbr: 'TUE' },
  { name: 'Wednesday', abbr: 'WED' },
  { name: 'Thursday',  abbr: 'THU' },
  { name: 'Friday',    abbr: 'FRI' },
  { name: 'Saturday',  abbr: 'SAT' },
] as const;

interface Props {
  member: TeamMember;
  shift: Shift | null;
  /** { [dayName]: Shift } for the week in the sheet. Empty object when sheet unavailable. */
  weekShifts: Record<string, Shift>;
  onBook?: () => void;
}

export function TeamCardFlip({ member, shift, weekShifts, onBook }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [todayName, setTodayName] = useState('');

  // Auto-flip to the back ~700ms after open so the user sees the
  // front first, then the card turns over in front of them.
  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = reduced ? 0 : 700;
    const t = setTimeout(() => setFlipped(true), delay);
    return () => clearTimeout(t);
  }, []);

  // Detect today's day name client-side (avoids hydration mismatch)
  useEffect(() => {
    setTodayName(
      new Date().toLocaleDateString('en-US', { weekday: 'long', timeZone: 'America/New_York' })
    );
  }, []);

  const role = member.role;
  const yearsNum = getYears(member);
  const firstName = member.name.split(' ')[0].toUpperCase();
  const since = member.startedYear;

  return (
    <div className="card-flip-stage">
      <button
        type="button"
        aria-label={flipped ? 'Flip to front' : 'Flip to back'}
        onClick={() => setFlipped((f) => !f)}
        className={`card-flip ${flipped ? 'flipped' : ''}`}
      >
        {/* FRONT — reuses the small baseball card markup at modal size */}
        <div className="card-flip-face card-flip-front">
          <BaseballCard
            member={member}
            shift={shift}
            interactive={false}
          />
        </div>

        {/* BACK — stats, schedule, bio, book */}
        <div className="card-flip-face card-flip-back">
          <div className="card-back">
            <div className="card-back-header">
              <div>
                <p className="card-back-label">SIEDEL&apos;S BARBERSHOP · MEDINA, OH</p>
                <h2 className="card-back-name">{member.name.toUpperCase()}</h2>
                <p className="card-back-role">{role.toUpperCase()}</p>
              </div>
              <div className="card-back-number">
                <span>NO.</span>
                <strong>{yearsNum}</strong>
              </div>
            </div>

            <div className="card-back-stats card-back-stats-2">
              <div className="card-back-stat">
                <span className="card-back-stat-label">YEARS</span>
                <span className="card-back-stat-value">{yearsNum}</span>
              </div>
              <div className="card-back-stat">
                <span className="card-back-stat-label">SINCE</span>
                <span className="card-back-stat-value">{since}</span>
              </div>
            </div>

            {/* Week schedule — only shown when the sheet covers this week */}
            {Object.keys(weekShifts).length > 0 && (
              <div className="card-back-schedule">
                <p className="card-back-section-label">SCHEDULE THIS WEEK</p>
                <div className="card-back-schedule-grid">
                  {DAY_ABBREVS.map(({ name, abbr }) => {
                    const s = weekShifts[name] ?? null;
                    const isToday = !!todayName && name === todayName;
                    const isWorking = s?.status === 'working';
                    const isOff = !s || s.status === 'off';
                    return (
                      <div key={name} className={`card-back-sched-col${isToday ? ' is-today' : ''}`}>
                        <span className="card-back-sched-label">{abbr}</span>
                        <span className={`card-back-sched-val${isWorking ? ' is-working' : isOff ? ' is-off' : ''}`}>
                          {isWorking
                            ? (s.display || s.raw)
                            : s?.status === 'offsite'
                            ? 'OUT'
                            : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {member.bio && (
              <div className="card-back-bio">
                <p className="card-back-section-label">CAREER</p>
                <p className="card-back-bio-text">{member.bio}</p>
              </div>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); onBook?.(); }}
              className="card-back-book"
            >
              BOOK WITH {firstName}
            </button>

            {/* Siedel's mark at the bottom, acts like a printer's seal
                on the back of a baseball card */}
            <div className="card-back-stamp" aria-hidden>
              <Logo width={110} />
              <p className="card-back-stamp-label">EST. 2018 · MEDINA, OHIO</p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
