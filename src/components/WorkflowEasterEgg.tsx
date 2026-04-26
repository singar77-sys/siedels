'use client';

import { useCallback, useEffect, useState } from 'react';
import { Icon } from './Icon';

/**
 * Hidden internal-ops diagram for Jim. Type "workflow" anywhere on the
 * site (not in a form) and a full-screen modal opens with the gift card
 * redeem counter flow — 7 steps, privacy callout, and four security
 * cards. Restyled in Siedel's red/cream/ink palette so it reads in
 * both light and dark themes.
 *
 * ESC to dismiss. Pattern: PricingPitchEasterEgg.
 */

const TRIGGER = 'workflow';

export function WorkflowEasterEgg() {
  const [active, setActive] = useState(false);

  const close = useCallback(() => setActive(false), []);

  useEffect(() => {
    let buffer = '';
    const onKey = (e: KeyboardEvent) => {
      if (active) {
        if (e.key === 'Escape') {
          e.preventDefault();
          close();
        }
        return;
      }
      const t = e.target as HTMLElement | null;
      if (t?.tagName === 'INPUT' || t?.tagName === 'TEXTAREA' || t?.isContentEditable) return;
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-TRIGGER.length);
      if (buffer === TRIGGER) {
        setActive(true);
        buffer = '';
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close]);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-ink text-text flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Gift card redeem counter flow"
    >
      <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-line-strong flex-none">
        <span className="font-label text-[10px] tracking-[0.3em] text-red">WORKFLOW MODE</span>
        <button
          type="button"
          onClick={close}
          className="font-label text-[11px] tracking-[0.3em] text-text-subtle hover:text-red transition-colors flex items-center gap-2"
          aria-label="Close (ESC)"
        >
          <Icon name="close" className="w-4 h-4" />
          CLOSE
        </button>
      </header>

      <div className="flex-1 min-h-0 overflow-auto px-4 md:px-8 py-6 md:py-10">
        <div className="max-w-[1280px] mx-auto">
          <WorkflowChart />
        </div>
      </div>

      <footer className="flex items-center justify-center px-6 md:px-10 py-4 border-t border-line-strong flex-none">
        <span className="font-label text-[10px] tracking-[0.3em] text-text-subtle">
          ESC TO CLOSE
        </span>
      </footer>
    </div>
  );
}

/** Gift Card Redeem flow — 7 steps + privacy callout + 4 security cards.
 *  Restyled with Siedel's tokens. Inline SVG so it scales and themes. */
function WorkflowChart() {
  return (
    <svg
      viewBox="0 0 1240 780"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="wf-title wf-desc"
      style={{
        width: '100%',
        height: 'auto',
        minWidth: 800,
        fontFamily: "'General Sans', 'Arial', sans-serif",
      }}
    >
      <title id="wf-title">Gift Card Redeem — Counter Flow</title>
      <desc id="wf-desc">
        Symmetric 7-step counter flow showing tablet-based gift card redemption,
        with a privacy callout and four security cards.
      </desc>

      <defs>
        <marker id="wfArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--text-muted)" />
        </marker>
        <marker id="wfArrowLoop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--red)" />
        </marker>
      </defs>

      {/* Title */}
      <text x="40" y="48" fontSize="30" fontWeight="700" fill="var(--ink)" letterSpacing="-0.01em">
        GIFT CARD REDEEM — COUNTER FLOW
      </text>
      <text x="40" y="78" fontSize="15" fill="var(--text-subtle)" letterSpacing="0.02em">
        7 taps. No PII. One PIN per shift. Built for the tablet by the register.
      </text>

      {/* ============ TOP ROW (Steps 1–4) ============ */}
      <StepBox x={40}   y={120} num="1" title="Open the page"     line1="Phone or tablet opens"   line2="" highlight="siedels.com/redeem" />
      <StepBox x={335}  y={120} num="2" title="Enter the PIN"     line1="One shared PIN by staff." line2="Set once in Vercel." italic="Cashier knows it." />
      <StepBox x={630}  y={120} num="3" title="Logged in (8 hrs)" line1="Stays signed in"          line2="for the whole shift." italic="No re-typing." />
      <StepBox x={925}  y={120} num="4" title="Look up"           line1="Scan or type code."       line2="" highlight="Shows balance" />

      {/* Top row arrows */}
      <line x1="312" y1="190" x2="333" y2="190" stroke="var(--text-muted)" strokeWidth="1.8" markerEnd="url(#wfArrow)" />
      <line x1="607" y1="190" x2="628" y2="190" stroke="var(--text-muted)" strokeWidth="1.8" markerEnd="url(#wfArrow)" />
      <line x1="902" y1="190" x2="923" y2="190" stroke="var(--text-muted)" strokeWidth="1.8" markerEnd="url(#wfArrow)" />

      {/* Right side connector: Box 4 → Box 5 */}
      <path d="M 1060 262 L 1060 320" stroke="var(--text-muted)" strokeWidth="1.8" fill="none" markerEnd="url(#wfArrow)" />

      {/* ============ BOTTOM ROW (Privacy + Steps 7,6,5) ============ */}
      {/* Privacy callout — red-tinted to match Siedel's palette */}
      <g>
        <rect
          x="40" y="325" width="270" height="140" rx="14"
          fill="var(--red)" fillOpacity="0.08"
          stroke="var(--red)" strokeWidth="1.5"
        />
        <circle cx="72" cy="357" r="14" fill="var(--red)" />
        <path d="M66 357 L70 361 L78 353" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="95" y="362" fontSize="15" fontWeight="700" fill="var(--ink)">CUSTOMER PRIVACY</text>
        <text x="60" y="395" fontSize="13" fill="var(--text-muted)">Only the balance is shown.</text>
        <text x="60" y="418" fontSize="12" fill="var(--text-muted)">No name. No email. No phone.</text>
        <text x="60" y="437" fontSize="12" fill="var(--text-muted)">Nothing personal ever appears.</text>
      </g>

      <StepBox x={335} y={325} num="7" title="Next Card"        line1="One tap loops"      line2="back to lookup."     italic="Ready for next customer." />
      <StepBox x={630} y={325} num="6" title='"Charged!" screen' line1="Big confirmation."  line2="" highlight="New balance:" subline="$65 remaining" />
      <StepBox x={925} y={325} num="5" title="Enter charge amount" line1="Any amount works." line2="" highlight="Example:" subline="$35 of a $100 card" />

      {/* Bottom row arrows */}
      <line x1="923" y1="395" x2="902" y2="395" stroke="var(--text-muted)" strokeWidth="1.8" markerEnd="url(#wfArrow)" />
      <line x1="628" y1="395" x2="607" y2="395" stroke="var(--text-muted)" strokeWidth="1.8" markerEnd="url(#wfArrow)" />

      {/* Loop arrow: 7 → 1 */}
      <path d="M 175 325 L 175 295 L 175 260" stroke="var(--red)" strokeWidth="1.8" fill="none" strokeDasharray="6 4" markerEnd="url(#wfArrowLoop)" />
      <text x="185" y="295" fontSize="11" fontWeight="600" fill="var(--red)" letterSpacing="0.05em">REPEAT ALL SHIFT</text>

      {/* Divider */}
      <line x1="40" y1="510" x2="1195" y2="510" stroke="var(--line-strong)" strokeWidth="1" />

      {/* Section header — uppercase + Siedel headline tracking */}
      <text x="40" y="548" fontSize="20" fontWeight="700" fill="var(--ink)" letterSpacing="-0.01em">
        HOW IT STAYS LOCKED DOWN
      </text>

      {/* Security cards — top stripe in red to mark them as Siedel-branded */}
      <SecCard x={40}  y={572} title="5 TRIES, 15 MIN"      l1="Wrong PIN too many"  l2="times? Lockout kicks in." italic="Same as admin login." />
      <SecCard x={335} y={572} title="CHANGE PIN = LOGOUT"  l1="Update the PIN and"   l2="every device signs out"   l3="automatically." />
      <SecCard x={630} y={572} title="STATELESS & SIGNED"   l1="HMAC-SHA256 cookie."  l2="No Redis, no DB —"        l3="can't be forged." />
      <SecCard x={925} y={572} title="TWO-LAYER CHECK"      l1="Middleware fast-checks" l2="cookie. Routes do full" l3="HMAC validation." />
    </svg>
  );
}

interface StepBoxProps {
  x: number;
  y: number;
  num: string;
  title: string;
  line1: string;
  line2: string;
  italic?: string;
  highlight?: string;
  subline?: string;
}
function StepBox({ x, y, num, title, line1, line2, italic, highlight, subline }: StepBoxProps) {
  const cx = x + 32;
  const cy = y + 32;
  return (
    <g>
      <rect x={x} y={y} width={270} height={140} rx={14} fill="var(--surface)" stroke="var(--line-strong)" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={16} fill="var(--red)" />
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize={15} fontWeight={700} fill="#ffffff">{num}</text>
      <text x={cx + 28} y={cy + 6} fontSize={17} fontWeight={700} fill="var(--ink)">{title}</text>

      {line1 && <text x={x + 20} y={y + 75} fontSize={13} fill="var(--text-muted)">{line1}</text>}
      {line2 && <text x={x + 20} y={y + 95} fontSize={13} fill="var(--text-muted)">{line2}</text>}
      {highlight && (
        <text x={x + 20} y={y + (line2 ? 117 : 105)} fontSize={14} fontWeight={600} fill="var(--ink)">{highlight}</text>
      )}
      {subline && <text x={x + 20} y={y + 125} fontSize={13} fill="var(--text-muted)">{subline}</text>}
      {italic && (
        <text x={x + 20} y={y + 120} fontSize={12} fontStyle="italic" fill="var(--text-subtle)">{italic}</text>
      )}
    </g>
  );
}

interface SecCardProps {
  x: number;
  y: number;
  title: string;
  l1: string;
  l2: string;
  l3?: string;
  italic?: string;
}
function SecCard({ x, y, title, l1, l2, l3, italic }: SecCardProps) {
  return (
    <g>
      <rect x={x} y={y} width={270} height={180} rx={14} fill="var(--surface)" stroke="var(--line-strong)" strokeWidth={1.5} />
      {/* Red top stripe — replaces the original near-black stripe with Siedel red */}
      <rect x={x} y={y} width={270} height={4} rx={2} fill="var(--red)" />
      <text x={x + 20} y={y + 40} fontSize={16} fontWeight={700} fill="var(--ink)" letterSpacing="0.02em">{title}</text>
      <text x={x + 20} y={y + 73} fontSize={13} fill="var(--text-muted)">{l1}</text>
      <text x={x + 20} y={y + 93} fontSize={13} fill="var(--text-muted)">{l2}</text>
      {l3 && <text x={x + 20} y={y + 113} fontSize={13} fill="var(--text-muted)">{l3}</text>}
      {italic && (
        <text x={x + 20} y={y + 128} fontSize={12} fontStyle="italic" fill="var(--text-subtle)">{italic}</text>
      )}
    </g>
  );
}
