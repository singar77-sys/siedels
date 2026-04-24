'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Easter egg for Jim — type "4547" anywhere on the site (not in a form)
 * and the page goes full patriotic:
 *
 * - Red/White/Blue palette override (swaps in over both light and dark)
 * - Horizontal RWB stripe background sweeps under everything
 * - Cursor becomes an American flag
 * - 60 patriotic emojis rain down (flags, eagles, stars, fireworks)
 * - 14 floating phrases ("USA!", "LIBERTY", "STARS AND STRIPES"…)
 * - Banner at top: USA MODE
 * - Optional background music — plays /audio/patriot.mp3 if present
 *   (public-domain suggestions: Star-Spangled Banner, America the
 *   Beautiful, Battle Hymn of the Republic). Fails silently if no file.
 *
 * Duration: 30s, ESC to dismiss.
 * Respects prefers-reduced-motion (skips visuals, keeps palette swap).
 */

const TRIGGER = '4547';
const DURATION_MS = 30_000;

const PATRIOT_EMOJIS = [
  '🇺🇸', '🦅', '⭐', '🎆', '🎇', '🗽', '🏛️', '🪖',
  '🎖️', '🏅', '🌟', '✨', '🔴', '⚪', '🔵', '🎺',
];

const PHRASES = [
  'USA!', 'LIBERTY', 'FREEDOM',
  'GOD BLESS AMERICA', 'LAND OF THE FREE', 'HOME OF THE BRAVE',
  'LET FREEDOM RING', '1776', 'STARS & STRIPES',
  'E PLURIBUS UNUM', 'OLD GLORY', 'SEMPER FI',
  'FOR JIM!', 'STAY SHARP · STAY FREE',
];

const FLAG_COLORS = ['#BF0A30', '#FFFFFF', '#002868'];

export function PatriotEasterEgg() {
  const [active, setActive] = useState(false);
  const [skipVisuals, setSkipVisuals] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    setActive(false);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('patriot-mode');
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
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

    document.documentElement.classList.add('patriot-mode');
    setActive(true);

    // Try to play audio — fails silently if the file doesn't exist or
    // autoplay is blocked (shouldn't be, since the trigger is a
    // keystroke = user gesture).
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => { /* no-op */ });
    }

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
        buffer = (buffer + e.key).slice(-TRIGGER.length);
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
        document.documentElement.classList.remove('patriot-mode');
      }
    },
    [],
  );

  return (
    <>
      {/* Audio element always mounted so play() has a ref; src is the
          public-domain file Jim can drop into /public/audio/. */}
      <audio
        ref={audioRef}
        src="/audio/patriot.mp3"
        preload="none"
        loop
        aria-hidden="true"
      />
      {active && !skipVisuals && <PatriotOverlay />}
    </>
  );
}

function PatriotOverlay() {
  const emojis = Array.from({ length: 60 }).map((_, i) => {
    const emoji = PATRIOT_EMOJIS[i % PATRIOT_EMOJIS.length];
    const left = Math.random() * 100;
    const delay = Math.random() * 4;
    const duration = 6 + Math.random() * 6;
    const size = 28 + Math.random() * 32;
    const rotate = Math.random() * 720 - 360;
    return (
      <span
        key={i}
        className="absolute top-[-10vh] patriot-emoji-fall select-none"
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
        className="absolute patriot-phrase select-none whitespace-nowrap"
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
      <div className="patriot-banner absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <div className="flex items-center gap-4 px-8 py-4 border-4 border-white/60 bg-black/40 backdrop-blur-sm">
          <span className="text-4xl">🇺🇸</span>
          <span className="patriot-banner-text uppercase tracking-tight text-3xl md:text-5xl font-black">
            USA MODE
          </span>
          <span className="text-4xl">🦅</span>
        </div>
      </div>
      <div className="absolute inset-0">{emojis}</div>
      <div className="absolute inset-0">{phrases}</div>
    </div>
  );
}
