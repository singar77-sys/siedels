'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from './ThemeProvider';

/**
 * Easter egg — type "sacrifix" anywhere on the site (not in a form
 * field) and summon the full ritual: flip to dark mode, lightning,
 * smoke, rain, and a rain of pizza/tombstone/skull emojis. Soundtrack
 * lives at /public/audio/sacrifix.mp3.
 *
 * Duration: 30s, or ESC to dismiss.
 * Respects prefers-reduced-motion (plays audio + flips theme, skips
 * the visual layer).
 */

const TRIGGER = 'sacrifix';
const DURATION_MS = 30_000;
const EMOJIS = ['🍕', '🪦', '💀'];

export function SacrifixEasterEgg() {
  const [active, setActive] = useState(false);
  const [skipVisuals, setSkipVisuals] = useState(false);
  const { setTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    setActive(false);
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
    setTheme('dark');

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setSkipVisuals(reducedMotion);
    setActive(true);

    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/sacrifix.mp3');
      audioRef.current.volume = 0.85;
    }
    audioRef.current.currentTime = 0;
    // Triggered by a keystroke (user gesture), so autoplay should work.
    audioRef.current.play().catch(() => {
      // MP3 missing or blocked — visuals still run.
    });

    timeoutRef.current = setTimeout(stop, DURATION_MS);
  }, [setTheme, stop]);

  useEffect(() => {
    let buffer = '';
    const onKey = (e: KeyboardEvent) => {
      // ESC during the effect = dismiss
      if (active && e.key === 'Escape') {
        e.preventDefault();
        stop();
        return;
      }

      // Ignore if the user is typing in a form
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      // Only buffer printable single-character keys
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
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  if (!active || skipVisuals) return null;

  const emojiElements = Array.from({ length: 40 }).map((_, i) => {
    const emoji = EMOJIS[i % EMOJIS.length];
    const left = Math.random() * 100;
    const delay = Math.random() * 4;
    const duration = 5 + Math.random() * 4;
    const size = 24 + Math.random() * 28;
    const rotate = Math.random() * 720 - 360;
    return (
      <span
        key={i}
        className="absolute top-[-10vh] sacrifix-emoji select-none"
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

  const rainElements = Array.from({ length: 90 }).map((_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = 0.5 + Math.random() * 0.7;
    const height = 40 + Math.random() * 40;
    return (
      <span
        key={i}
        className="absolute top-[-10vh] w-px bg-white/40 sacrifix-rain"
        style={{
          left: `${left}%`,
          height: `${height}px`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      />
    );
  });

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* Lightning flash — stacks on top via screen blend */}
      <div className="absolute inset-0 bg-white sacrifix-lightning" />
      {/* Smoke — rolls in from below */}
      <div className="absolute inset-0 sacrifix-smoke" />
      {/* Rain streaks */}
      <div className="absolute inset-0">{rainElements}</div>
      {/* Pizza, tombstones, skulls */}
      <div className="absolute inset-0">{emojiElements}</div>
    </div>
  );
}
