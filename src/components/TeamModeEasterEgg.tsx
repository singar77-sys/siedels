'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Cleveland team modes. Type one of the trigger words to flip the
 * entire palette to that team's colors:
 *
 *   "tribe"  — Cleveland Guardians  (navy / red / white)
 *   "cavs"   — Cleveland Cavaliers  (wine / navy / gold)
 *   "price"  — 80s/90s retro Cavs   (powder blue / orange / black)
 *   "browns" — Cleveland Browns     (brown / orange / white)
 *
 * Activation API:
 *   Path 1: keystroke (current) — type the trigger anywhere on the
 *           site outside of a form field.
 *   Path 2: future — pass `forcedMode` prop (from a server-side
 *           team-schedule fetcher) to auto-activate on game days.
 *           Leave prop undefined and the component runs in keystroke
 *           mode only.
 *
 * While active: sets data-team-mode="<mode>" on <html>, which the
 * CSS in globals.css swaps the full palette against. 30s timeout.
 * ESC dismisses. Respects prefers-reduced-motion (still swaps the
 * palette, just skips the banner animation).
 */

export type TeamMode = 'tribe' | 'cavs' | 'price' | 'browns';

const TRIGGERS: TeamMode[] = ['tribe', 'cavs', 'price', 'browns'];
const MAX_TRIGGER_LEN = Math.max(...TRIGGERS.map((t) => t.length));
const DURATION_MS = 30_000;

interface Props {
  /**
   * Optional — when set, the component activates this team mode
   * and keeps it active until forcedMode becomes null/undefined.
   * Used by future schedule-sync logic to auto-activate on game
   * days. Keystroke triggers still work (they take priority for
   * the 30s duration, then the forced mode re-applies).
   */
  forcedMode?: TeamMode | null;
}

export function TeamModeEasterEgg({ forcedMode }: Props = {}) {
  const [active, setActive] = useState<TeamMode | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyMode = useCallback((mode: TeamMode | null) => {
    setActive(mode);
    if (typeof document === 'undefined') return;
    if (mode) {
      document.documentElement.setAttribute('data-team-mode', mode);
    } else {
      document.documentElement.removeAttribute('data-team-mode');
    }
  }, []);

  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // If a schedule-forced mode is active, drop back to it. Otherwise clear.
    applyMode(forcedMode ?? null);
  }, [applyMode, forcedMode]);

  const fire = useCallback(
    (mode: TeamMode) => {
      applyMode(mode);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(stop, DURATION_MS);
    },
    [applyMode, stop]
  );

  // Apply forcedMode on mount / when it changes (path 2: schedule sync)
  useEffect(() => {
    if (forcedMode && !timeoutRef.current) {
      applyMode(forcedMode);
    } else if (!forcedMode && !timeoutRef.current) {
      applyMode(null);
    }
  }, [forcedMode, applyMode]);

  // Keystroke listener (path 1)
  useEffect(() => {
    let buffer = '';
    const onKey = (e: KeyboardEvent) => {
      // ESC dismisses an active keystroke-triggered mode
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
      if (e.key.length !== 1) return;

      buffer = (buffer + e.key.toLowerCase()).slice(-MAX_TRIGGER_LEN);
      for (const trigger of TRIGGERS) {
        if (buffer.endsWith(trigger)) {
          fire(trigger);
          buffer = '';
          break;
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
        document.documentElement.removeAttribute('data-team-mode');
      }
    },
    []
  );

  // Palette swap is driven entirely by data-team-mode on <html>.
  // No visible banner — just the color flip.
  return null;
}
