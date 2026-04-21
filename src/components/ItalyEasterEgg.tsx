'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Easter egg for Jim LaMarca, first-generation Italian man behind
 * the chair. Type "italy" anywhere on the site (not in a form) and
 * the page turns into a full-on Italian kitsch explosion:
 *
 * - Green/white/red flag stripes sweep across the background
 * - Every font on the page swaps to Lobster (the Olive Garden font),
 *   loaded from Google Fonts on demand
 * - Cursor becomes a pizza slice
 * - 60 Italian emojis rain down (pizza, pasta, flag, tomato, cheese,
 *   wine, espresso, gelato, olives, Vespa, violin, David, Colosseum,
 *   focaccia, grapes, Venetian mask, art, pasta bowl...)
 * - 14 floating Italian phrases pop in at random angles in flag colors
 *   ("MAMMA MIA!", "CIAO JIM!", "BELLA!", "ANDIAMO!", etc.)
 * - Special shout-out to Jim himself
 *
 * Duration: 30s, ESC to dismiss.
 * Respects prefers-reduced-motion (skips visuals, keeps font/flag swap).
 */

const TRIGGER = 'italy';
const DURATION_MS = 30_000;

const ITALIAN_EMOJIS = [
  '🍕', '🍝', '🇮🇹', '🍅', '🧀', '🍷', '☕', '🍦',
  '🫒', '🛵', '🎻', '🗿', '🏛️', '🥖', '🍇', '🎭',
  '🎨', '🥣', '🍨', '🥧',
];

const PHRASES = [
  'MAMMA MIA!', 'CIAO!', 'BELLA!', 'ANDIAMO!',
  'GRAZIE!', 'PERFETTO!', 'MAGNIFICO!', 'DELIZIOSO!',
  'BENVENUTI!', 'FANTASTICO!', 'AMORE!', 'BRAVO!',
  'CIAO JIM!', 'FORZA ITALIA!',
];

const FLAG_COLORS = ['#009246', '#FFFFFF', '#CE2B37'];

export function ItalyEasterEgg() {
  const [active, setActive] = useState(false);
  const [skipVisuals, setSkipVisuals] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    setActive(false);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('italy-mode');
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const fire = useCallback(() => {
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setSkipVisuals(reducedMotion);

    // Load Lobster on-demand (first time only)
    if (typeof document !== 'undefined' && !document.getElementById('italy-font')) {
      const link = document.createElement('link');
      link.id = 'italy-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Lobster&display=swap';
      document.head.appendChild(link);
    }

    document.documentElement.classList.add('italy-mode');
    setActive(true);

    timeoutRef.current = setTimeout(stop, DURATION_MS);
  }, [stop]);

  useEffect(() => {
    let buffer = '';
    const onKey = (e: KeyboardEvent) => {
      if (active && e.key === 'Escape') {
        e.preventDefault();
        stop();
        return;
      }
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.key.length === 1) {
        buffer = (buffer + e.key.toLowerCase()).slice(-TRIGGER.length);
        if (buffer === TRIGGER) {
          fire();
          buffer = '';
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, fire, stop]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('italy-mode');
      }
    },
    []
  );

  if (!active || skipVisuals) return null;

  const emojis = Array.from({ length: 60 }).map((_, i) => {
    const emoji = ITALIAN_EMOJIS[i % ITALIAN_EMOJIS.length];
    const left = Math.random() * 100;
    const delay = Math.random() * 4;
    const duration = 6 + Math.random() * 6;
    const size = 28 + Math.random() * 32;
    const rotate = Math.random() * 720 - 360;
    return (
      <span
        key={i}
        className="absolute top-[-10vh] italy-emoji-fall select-none"
        style={{
          left: `${left}%`,
          fontSize: `${size}px`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          ['--rotate-end' as string]: `${rotate}deg`,
        }}
      >
        {emoji}
      </span>
    );
  });

  const phrases = Array.from({ length: 14 }).map((_, i) => {
    const phrase = PHRASES[i % PHRASES.length];
    const left = 8 + Math.random() * 80;
    const top = 10 + Math.random() * 75;
    const delay = Math.random() * 22;
    const rotate = (Math.random() - 0.5) * 40;
    const color = FLAG_COLORS[i % 3];
    return (
      <span
        key={`p${i}`}
        className="absolute italy-phrase select-none whitespace-nowrap"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          color,
          animationDelay: `${delay}s`,
          ['--rotate' as string]: `${rotate}deg`,
        }}
      >
        {phrase}
      </span>
    );
  });

  return (
    <div
      className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* Big banner at top — fires once, long fade */}
      <div className="italy-banner absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <div className="italy-banner-inner flex items-center gap-4 px-8 py-4 border-4 border-white/60 bg-black/30 backdrop-blur-sm">
          <span className="text-4xl">🇮🇹</span>
          <span className="italy-banner-text uppercase tracking-tight text-white text-3xl md:text-5xl font-bold">
            ITALIA MODE
          </span>
          <span className="text-4xl">🇮🇹</span>
        </div>
      </div>
      <div className="absolute inset-0">{emojis}</div>
      <div className="absolute inset-0">{phrases}</div>
    </div>
  );
}
