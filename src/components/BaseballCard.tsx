import Image from 'next/image';
import type { TeamMember } from '@/data/shop';
import type { Shift } from '@/lib/schedule';

/**
 * 1986-Topps-style card for a Siedel's barber. Uses the shop palette
 * only — three ribbon schemes rotate by index to give visual rhythm
 * without introducing colors outside the brand (so team/italy modes
 * carry through automatically via the CSS variables).
 *
 * Anatomy (top to bottom):
 *   - colored ribbon: ROLE text + small "S" monogram mark
 *   - photo area (fills most of the card)
 *   - years badge (bottom-left, overlaps photo)
 *   - nameplate bar (full-width bottom)
 */

interface Props {
  member: TeamMember;
  idx: number;
  shift: Shift | null;
  onSelect?: (member: TeamMember) => void;
  /** false inside the flip modal — no click handler, no hover lift */
  interactive?: boolean;
}

// Parse "Master Barber · 31 Years" into role + years number.
function parseTitle(title: string): { role: string; years: number | null } {
  const parts = title.split('·').map((p) => p.trim());
  const role = parts[0] || 'Barber';
  const yearsMatch = parts[1]?.match(/(\d+)/);
  const years = yearsMatch ? parseInt(yearsMatch[1], 10) : null;
  return { role, years };
}

export function BaseballCard({ member, idx: _idx, shift, onSelect, interactive = true }: Props) {
  const { role, years } = parseTitle(member.title);
  const isWorking = shift?.status === 'working';
  const isOff = shift?.status === 'off';
  const isOffsite = shift?.status === 'offsite';
  // Ribbon color = availability status. Light: tan=in, dark-brown=off. Dark: red=in, grey=off.
  const scheme = (isOff || isOffsite) ? 'scheme-status-off' : 'scheme-status-in';

  const click = () => { if (interactive && onSelect) onSelect(member); };

  return (
    <div
      className={`card-86 ${scheme} relative ${interactive ? 'group cursor-pointer' : 'card-86-static'}`}
      onClick={click}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          click();
        }
      } : undefined}
    >
      {/* Top ribbon: role */}
      <div className="card-86-ribbon">
        <span className="card-86-role">{role.toUpperCase()}</span>
      </div>

      {/* Photo */}
      <div className="card-86-photo">
        {member.image ? (
          <Image
            src={member.image}
            alt={`${member.name}, ${member.title} at Siedel's Barbershop in Medina, Ohio`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
            className={`object-cover object-top theme-photo group-hover:scale-105 transition-transform duration-700 ${
              !isWorking && shift ? 'opacity-60' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-raised">
            <span className="font-headline text-5xl text-text-subtle">
              {member.name.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
        )}

        {/* Shift status stamp — only when we have schedule info */}
        {shift && (
          <div className="card-86-status">
            {isWorking && (
              <div className="card-86-status-in">
                <span className="card-86-pulse" />
                IN · {shift.display.toUpperCase()}
              </div>
            )}
            {isOff && <div className="card-86-status-off">OFF TODAY</div>}
            {isOffsite && (
              <div className="card-86-status-off">
                {shift.location?.toUpperCase() ?? 'AWAY'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Years badge — circle overlapping photo + nameplate */}
      {years !== null && (
        <div className="card-86-badge">
          <span className="card-86-years">{years}</span>
          <span className="card-86-yrs">YRS</span>
        </div>
      )}

      {/* Nameplate at bottom */}
      <div className="card-86-nameplate">
        <span className="card-86-name">{member.name.toUpperCase()}</span>
      </div>
    </div>
  );
}
