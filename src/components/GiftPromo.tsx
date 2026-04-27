'use client';

import { useState, useEffect } from 'react';
import { Icon } from './Icon';

const STORAGE_KEY = 'siedels-promo-dismissed-fathersday26';

// Only surface during the Father's Day run-up: May 15 – June 21
function isInSeason(): boolean {
  const d = new Date();
  const m = d.getMonth(); // 0-indexed
  const day = d.getDate();
  return (m === 4 && day >= 15) || (m === 5 && day <= 21);
}

interface GiftPromoProps {
  onNavigate: () => void;
}

export function GiftPromo({ onNavigate }: GiftPromoProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isInSeason()) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, '1');
  };

  const handleCTA = () => {
    dismiss();
    onNavigate();
  };

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-label="Father's Day gift card promotion"
      className={`fixed bottom-20 md:bottom-10 right-4 md:right-6 z-50 w-64 transform transition-all duration-500 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-surface border-l-4 border-red shadow-2xl relative">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-text-subtle hover:text-red transition-colors"
          aria-label="Dismiss"
        >
          <Icon name="close" className="w-3.5 h-3.5" />
        </button>
        <div className="p-5 pr-8">
          <p className="font-label text-[9px] tracking-[0.3em] text-red mb-2">THIS FATHER&apos;S DAY</p>
          <p className="font-headline text-xl uppercase tracking-tight leading-[0.95] text-text mb-3">
            Give Dad the Gift of a Great Cut.
          </p>
          <p className="font-body text-xs text-text-muted leading-relaxed mb-4">
            Gift cards from $25. Good for any service, any barber.
          </p>
          <button
            onClick={handleCTA}
            className="w-full py-2.5 bg-red text-white font-headline text-[11px] font-bold uppercase tracking-widest hover:bg-red-hover transition-colors"
          >
            GET A GIFT CARD &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
