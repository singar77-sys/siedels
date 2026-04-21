'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { WeatherEffect, WeatherResponse } from '@/lib/weather';
import { pickEffect } from '@/lib/weather';

/**
 * Fires once per tab session with a subtle overlay matching Medina's
 * current weather. Fades in, holds ~5 seconds, fades out. Pulls from
 * /api/weather (which caches Open-Meteo for 15 minutes).
 *
 * Effects:
 *   snow  — drifting flakes
 *   rain  — vertical streaks + intermittent lightning
 *   fog   — two drifting haze layers
 *   clear — nothing (just silent acknowledgment)
 *
 * pointer-events:none throughout — never blocks UI. Respects
 * prefers-reduced-motion (skips the effect entirely). sessionStorage
 * flag prevents re-firing on SPA nav.
 */

const SESSION_KEY = 'siedels-ambience-fired';
const HOLD_MS = 5000;
const FADE_MS = 1500;
const TOTAL_MS = HOLD_MS + FADE_MS * 2;

type Phase = 'idle' | 'in' | 'out';

export function MedinaAmbience() {
  const [effect, setEffect] = useState<WeatherEffect | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Reduced-motion users get nothing visual
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem(SESSION_KEY, '1');
      return;
    }

    let cancelled = false;
    fetch('/api/weather')
      .then((r) => r.json())
      .then((data: WeatherResponse) => {
        if (cancelled) return;
        sessionStorage.setItem(SESSION_KEY, '1');
        if (!data.ok || !data.current) return;

        const chosen = pickEffect(data.current);
        if (chosen === 'clear') return; // ambient silence = nothing

        setEffect(chosen);
        // Next paint → fade in
        timersRef.current.push(setTimeout(() => setPhase('in'), 30));
        // After hold → start fade-out
        timersRef.current.push(setTimeout(() => setPhase('out'), FADE_MS + HOLD_MS));
        // After fade-out → remove from DOM
        timersRef.current.push(
          setTimeout(() => {
            setEffect(null);
            setPhase('idle');
          }, TOTAL_MS)
        );
      })
      .catch(() => {
        sessionStorage.setItem(SESSION_KEY, '1');
      });

    return () => {
      cancelled = true;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const content = useMemo(() => {
    if (!effect) return null;
    if (effect === 'snow') return <SnowFX />;
    if (effect === 'rain') return <RainFX />;
    if (effect === 'fog') return <FogFX />;
    return null;
  }, [effect]);

  if (!effect) return null;

  return (
    <div
      className={`ambience-root fixed inset-0 z-30 pointer-events-none overflow-hidden ${
        phase === 'in' ? 'ambience-phase-in' : phase === 'out' ? 'ambience-phase-out' : ''
      }`}
      aria-hidden
    >
      {content}
    </div>
  );
}

function SnowFX() {
  const flakes = Array.from({ length: 60 }).map((_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 6;
    const duration = 9 + Math.random() * 7;
    const size = 3 + Math.random() * 7;
    const drift = (Math.random() - 0.5) * 140;
    const opacity = 0.55 + Math.random() * 0.35;
    return (
      <span
        key={i}
        className="absolute top-[-10vh] rounded-full bg-white snow-flake"
        style={{
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          ['--drift' as string]: `${drift}px`,
        }}
      />
    );
  });
  return <>{flakes}</>;
}

function RainFX() {
  const drops = Array.from({ length: 100 }).map((_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = 0.4 + Math.random() * 0.6;
    const height = 30 + Math.random() * 40;
    return (
      <span
        key={i}
        className="absolute top-[-10vh] w-px bg-white/40 rain-drop"
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
    <>
      <div className="absolute inset-0 bg-white rain-lightning" />
      {drops}
    </>
  );
}

function FogFX() {
  return (
    <>
      <div className="absolute inset-0 fog-layer fog-layer-1" />
      <div className="absolute inset-0 fog-layer fog-layer-2" />
    </>
  );
}
