'use client';

import { useEffect, useState } from 'react';
import { BaseballCard } from './BaseballCard';
import type { TeamMember } from '@/data/shop';
import type { Shift } from '@/lib/schedule';

/**
 * Modal content for a team member — the card flips from front to
 * back on open. Click again to flip back. CSS handles the 3D
 * rotation; this component wires up state + auto-flip timer.
 */

interface Props {
  member: TeamMember;
  idx: number;
  shift: Shift | null;
}

function parseTitle(title: string) {
  const parts = title.split('·').map((p) => p.trim());
  const role = parts[0] || 'Barber';
  const match = parts[1]?.match(/(\d+)/);
  return { role, years: match ? match[1] : null };
}

export function TeamCardFlip({ member, idx, shift }: Props) {
  const [flipped, setFlipped] = useState(false);

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

  const { role, years } = parseTitle(member.title);
  const firstName = member.name.split(' ')[0].toUpperCase();
  const yearsNum = years ? parseInt(years, 10) : null;
  const since =
    yearsNum !== null ? new Date().getFullYear() - yearsNum : null;

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
            idx={idx}
            shift={shift}
            interactive={false}
          />
        </div>

        {/* BACK — stats, specialties, bio, book */}
        <div className="card-flip-face card-flip-back">
          <div className="card-back">
            <div className="card-back-header">
              <div>
                <p className="card-back-label">SIEDEL&apos;S BARBERSHOP · MEDINA, OH</p>
                <h2 className="card-back-name">{member.name.toUpperCase()}</h2>
                <p className="card-back-role">{role.toUpperCase()}</p>
              </div>
              {yearsNum !== null && (
                <div className="card-back-number">
                  <span>NO.</span>
                  <strong>{yearsNum}</strong>
                </div>
              )}
            </div>

            <div className="card-back-stats card-back-stats-2">
              {yearsNum !== null && (
                <div className="card-back-stat">
                  <span className="card-back-stat-label">YEARS</span>
                  <span className="card-back-stat-value">{yearsNum}</span>
                </div>
              )}
              {since !== null && (
                <div className="card-back-stat">
                  <span className="card-back-stat-label">SINCE</span>
                  <span className="card-back-stat-value">{since}</span>
                </div>
              )}
            </div>

            {member.specialties && member.specialties.length > 0 && (
              <div className="card-back-specialties">
                <p className="card-back-section-label">SPECIALTIES</p>
                <ul className="card-back-chip-list">
                  {member.specialties.map((spec) => (
                    <li key={spec} className="card-back-chip">
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {member.bio && (
              <div className="card-back-bio">
                <p className="card-back-section-label">CAREER</p>
                <p className="card-back-bio-text">{member.bio}</p>
              </div>
            )}

            <a
              href={member.booking}
              target="_blank"
              rel="noopener noreferrer"
              className="card-back-book"
              onClick={(e) => e.stopPropagation()}
            >
              BOOK WITH {firstName}
            </a>
          </div>
        </div>
      </button>
    </div>
  );
}
