'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Easter egg for Siedel's inclusivity. Type "lgbtq" anywhere on the
 * site (not in a form) and the page explodes into pride:
 *
 * - Rainbow diagonal stripes pulse across the background
 * - 100 pride emojis rain down (flags, unicorn, hearts, rainbows, flowers…)
 * - 10 floating phrases ("LOVE IS LOVE!", "STAY SHARP! 🏳️‍🌈", etc.)
 * - Hero gets an emoji accent row
 * - All red accents shift to fuchsia, buttons go full rainbow sweep
 * - Iridescent shimmer on team cards
 *
 * Duration: 30s. ESC to dismiss early.
 * Respects prefers-reduced-motion (skips visuals, keeps palette shift).
 */

const TRIGGER = 'lgbtq';
const DURATION_MS = 30_000;

const PRIDE_EMOJIS = [
  '🏳️‍🌈', '🦄', '🌈', '✨', '💜', '💙', '💚', '💛', '🧡', '❤️',
  '🩷', '🩵', '🌸', '🌺', '💫', '🎉', '🎊', '🦋', '🌟', '🍭',
  '💎', '🌻', '🎈', '💝', '🏳️‍⚧️',
];

const PHRASES = [
  'LOVE IS LOVE!',
  'PRIDE!',
  'BE YOURSELF!',
  'YOU ARE LOVED!',
  'STAY SHARP! 🏳️‍🌈',
  'EQUALITY!',
  'LOVE WINS!',
  'CELEBRATE!',
  '🦄 BE YOU!',
  'PRIDE CUTS! ✨',
];

const PRIDE_COLORS = [
  '#e40303', '#ff8c00', '#ffed00',
  '#008026', '#004dff', '#750787',
  '#ff69b4', '#a78bfa', '#34d399',
];

export function LgbtqEasterEgg() {
  const [active, setActive] = useState(false);
  const [skipVisuals, setSkipVisuals] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    setActive(false);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('lgbtq-mode');
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
    document.documentElement.classList.add('lgbtq-mode');
    setActive(true);
    timeoutRef.current = setTimeout(stop, DURATION_MS);
  }, [stop]);

  // Keyboard trigger
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
      ) return;
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
        document.documentElement.classList.remove('lgbtq-mode');
      }
    },
    []
  );

  if (!active || skipVisuals) return null;

  // 100-emoji shower
  const emojis = Array.from({ length: 100 }).map((_, i) => {
    const emoji = PRIDE_EMOJIS[i % PRIDE_EMOJIS.length];
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 5 + Math.random() * 7;
    const size = 22 + Math.random() * 44;
    const rotate = Math.random() * 720 - 360;
    return (
      <span
        key={i}
        className="absolute top-[-10vh] lgbtq-emoji-fall select-none pointer-events-none"
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

  // Floating phrases
  const phrases = Array.from({ length: 10 }).map((_, i) => {
    const phrase = PHRASES[i % PHRASES.length];
    const left = 8 + Math.random() * 78;
    const top = 12 + Math.random() * 72;
    const delay = Math.random() * 22;
    const rotate = (Math.random() - 0.5) * 28;
    const color = PRIDE_COLORS[i % PRIDE_COLORS.length];
    return (
      <span
        key={`p${i}`}
        className="absolute lgbtq-phrase select-none whitespace-nowrap pointer-events-none"
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
      {/* Banner */}
      <div className="lgbtq-banner absolute top-8 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
        <div className="flex items-center gap-4 px-8 py-4 border-4 border-white/60 bg-black/35 backdrop-blur-sm">
          <span className="text-4xl">🏳️‍🌈</span>
          <span className="lgbtq-banner-text font-headline text-3xl md:text-5xl font-black uppercase tracking-tight">
            PRIDE MODE
          </span>
          <span className="text-4xl">🦄</span>
        </div>
      </div>

      {/* Emoji shower */}
      <div className="absolute inset-0">{emojis}</div>

      {/* Floating phrases */}
      <div className="absolute inset-0">{phrases}</div>
    </div>
  );
}
