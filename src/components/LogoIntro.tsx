'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IMAGE_ALTS } from '@/data/shop';

type Phase = 'enter' | 'split' | 'done';

const STORAGE_KEY = 'siedels-intro-seen';

/**
 * First-visit splash screen. Diamond badge logo slams down onto a black
 * overlay, then the screen splits — top half flies up, bottom half flies
 * down — like a blade opening, revealing the site. Once per session.
 * Click or tap anywhere to skip.
 */
export function LogoIntro() {
  const [phase, setPhase] = useState<Phase>('done');

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      return;
    }

    setPhase('enter');

    const tSplit = setTimeout(() => setPhase('split'), 950);
    const tDone  = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem(STORAGE_KEY, '1');
    }, 1700);

    return () => { clearTimeout(tSplit); clearTimeout(tDone); };
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
      {/* Two panels that fly apart on split */}
      <div className="logo-intro__panel logo-intro__panel--top" />
      <div className="logo-intro__panel logo-intro__panel--bottom" />

      {/* Red flash that fires on badge impact */}
      <div className="logo-intro__flash" />

      {/* Badge — sits above both panels */}
      <div className="logo-intro__badge">
        <Image
          src="/logos/siedels-barbershop-logo-dark-diamond.png"
          alt={IMAGE_ALTS.logos.darkDiamond}
          width={380}
          height={380}
          priority
        />
      </div>
    </div>
  );
}
