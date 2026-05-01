'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IMAGE_ALTS } from '@/data/shop';

type Phase = 'enter' | 'collapse' | 'done';

const STORAGE_KEY = 'siedels-intro-seen';

/**
 * First-visit splash screen. The diamond badge logo slams down onto a black
 * overlay, holds briefly, then the overlay retracts via a diamond-shaped
 * clip-path — all four corners pulling inward simultaneously — revealing the
 * site underneath. Plays once per browser session. Click or tap to skip.
 */
export function LogoIntro() {
  const [phase, setPhase] = useState<Phase>('done'); // hidden on SSR / returning visits

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      return;
    }

    setPhase('enter');

    const tCollapse = setTimeout(() => setPhase('collapse'), 900);  // slam + hold
    const tDone     = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem(STORAGE_KEY, '1');
    }, 1850); // collapse takes 950 ms

    return () => { clearTimeout(tCollapse); clearTimeout(tDone); };
  }, []);

  const skip = () => {
    setPhase('done');
    sessionStorage.setItem(STORAGE_KEY, '1');
  };

  if (phase === 'done') return null;

  return (
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */
    <div
      className="logo-intro"
      data-phase={phase}
      onClick={skip}
      role="presentation"
      aria-hidden="true"
    >
      <div className="logo-intro__badge">
        <Image
          src="/logos/siedels-barbershop-logo-dark-diamond.png"
          alt={IMAGE_ALTS.logos.darkDiamond}
          width={280}
          height={280}
          priority
        />
      </div>
      <span className="logo-intro__skip">tap to skip</span>
    </div>
  );
}
