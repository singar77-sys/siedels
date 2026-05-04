'use client';

import { useState, useRef, useCallback } from 'react';
import { services, SQUARE_BOOKING_URL, type Service } from '@/data/shop';
import { Icon } from './Icon';

interface ServicesPanelProps {
  onSelectService: (service: Service) => void;
}

function Recommender({ onSelectService }: { onSelectService: (s: Service) => void }) {
  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState('');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<{ service: Service; reason: string } | null>(null);
  const [error,   setError]   = useState('');

  const ask = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError('Something went wrong — try again.');
    }
    setLoading(false);
  };

  const reset = () => { setQuery(''); setResult(null); setError(''); };
  const close = () => { setOpen(false); reset(); };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex font-label text-[11px] tracking-[0.3em] text-text-subtle hover:text-red transition-colors whitespace-nowrap items-center gap-2"
      >
        NOT SURE WHAT TO BOOK?
      </button>
    );
  }

  return (
    <div className="w-full border border-line-strong bg-surface-raised px-4 py-3 flex flex-col gap-3">
      {!result ? (
        <>
          <div className="flex items-center justify-between">
            <p className="font-label text-[10px] tracking-[0.35em] text-red">DESCRIBE WHAT YOU WANT</p>
            <button type="button" onClick={close} className="font-label text-[10px] tracking-widest text-text-subtle hover:text-text transition-colors">✕ CLOSE</button>
          </div>
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask()}
              placeholder="e.g. fade with beard cleanup, straight razor shave, father and son..."
              className="flex-1 bg-surface border border-line-strong px-3 py-2 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={ask}
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-red text-white font-headline font-bold text-sm uppercase tracking-tight hover:bg-red-hover disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'FIND →'}
            </button>
          </div>
          {error && <p className="font-body text-xs text-red">{error}</p>}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="font-label text-[10px] tracking-[0.35em] text-red">WE RECOMMEND</p>
            <button type="button" onClick={close} className="font-label text-[10px] tracking-widest text-text-subtle hover:text-text transition-colors">✕ CLOSE</button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-3 min-w-0">
              <span className="font-headline text-2xl font-bold text-red shrink-0">{result.service.price}</span>
              <div className="min-w-0">
                <p className="font-headline text-sm font-bold uppercase tracking-tight text-text">{result.service.name}</p>
                <p className="font-body text-xs text-text-muted italic mt-0.5">{result.reason}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={reset}
                className="px-3 py-2 border border-line-strong font-label text-[10px] tracking-widest text-text-subtle hover:border-text hover:text-text transition-colors"
              >
                TRY AGAIN
              </button>
              <button
                type="button"
                onClick={() => { onSelectService(result.service); close(); }}
                className="px-4 py-2 bg-red text-white font-headline font-bold text-sm uppercase tracking-tight hover:bg-red-hover transition-colors"
              >
                SEE DETAILS →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function ServicesPanel({ onSelectService }: ServicesPanelProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <section
      className="w-full flex-none h-full snap-start grid-bg overflow-hidden"
    >
      <div className="max-w-screen-2xl mx-auto h-full px-4 md:px-8 py-5 md:py-8 w-full flex flex-col relative z-10">

        <div className="flex items-end justify-between gap-4 mb-4 md:mb-5 flex-none">
          <div className="border-l-4 border-red pl-4 md:pl-6">
            <p className="font-label text-[10px] tracking-[0.3em] text-red mb-1">THE MENU</p>
            <h2 className="font-headline text-2xl md:text-4xl uppercase tracking-tight leading-[0.9]">
              SERVICES <span className="text-stroke">&amp; PRICES</span>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Recommender onSelectService={onSelectService} />
            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex font-label text-[11px] tracking-[0.3em] text-red hover:text-red-hover transition-colors whitespace-nowrap items-center gap-2"
            >
              BOOK NOW
              <Icon name="arrow_forward" className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div
          ref={sectionRef}
          className="flex-1 min-h-0 bg-surface border border-line-strong flex flex-col overflow-hidden opacity-[0.95] relative"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setLit(true)}
          onMouseLeave={() => setLit(false)}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
            style={{
              opacity: lit ? 1 : 0,
              background: 'radial-gradient(325px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(227,27,35,0.18) 0%, transparent 70%)',
            }}
          />
          {/* ── Matchup header ── */}
          <div className="flex-none grid grid-cols-[1fr_1px_2fr_1px_1fr] border-b border-line-strong bg-surface-raised/40">
            <div className="px-3 md:px-5 py-2 md:py-3 flex flex-col items-center justify-center gap-0.5">
              <span className="font-label text-[7px] md:text-[8px] tracking-[0.4em] text-text-faint hidden sm:block">CASH · SHOW UP</span>
              <span className="font-headline text-sm md:text-xl font-bold uppercase tracking-tight text-text">WALK IN</span>
            </div>
            <div className="bg-line-strong" />
            <div className="px-3 md:px-5 py-2 md:py-3 flex flex-col items-center justify-center gap-0.5">
              <span className="font-label text-[7px] md:text-[8px] tracking-[0.4em] text-text-faint hidden sm:block">TAP ANY ROW FOR DETAILS</span>
              <span className="font-headline text-sm md:text-xl font-bold uppercase tracking-tight text-text-muted">SERVICES</span>
            </div>
            <div className="bg-line-strong" />
            <div className="px-3 md:px-5 py-2 md:py-3 flex flex-col items-center justify-center gap-0.5">
              <span className="font-label text-[7px] md:text-[8px] tracking-[0.4em] text-red hidden sm:block">SQUARE · BOOK AHEAD</span>
              <span className="font-headline text-sm md:text-xl font-bold uppercase tracking-tight text-red">BOOK ONLINE</span>
            </div>
          </div>

          {/* ── Service rows ── */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {services.map((service) => (
              <button
                key={service.name}
                onClick={() => onSelectService(service)}
                className="w-full grid grid-cols-[1fr_1px_2fr_1px_1fr] border-b border-line group hover:bg-surface-raised/40 transition-colors duration-150"
              >
                {/* Walk-in price */}
                <div className="px-3 md:px-5 py-3 md:py-3.5 flex flex-col items-center justify-center gap-1">
                  {service.walkInPrice ? (
                    <>
                      <span className="font-headline text-lg md:text-2xl font-bold leading-none text-text">
                        {service.walkInPrice}
                      </span>
                      <span className="font-label text-[7px] tracking-[0.18em] text-red bg-red/10 px-1.5 py-0.5 leading-none">
                        SAVE ${parseInt(service.price.replace('$', '')) - parseInt(service.walkInPrice.replace('$', ''))}
                      </span>
                    </>
                  ) : (
                    <span className="font-label text-[6px] md:text-[7px] tracking-[0.2em] text-text-faint border border-line px-1.5 py-1 leading-tight text-center">
                      ONLINE<br />ONLY
                    </span>
                  )}
                </div>

                <div className="bg-line-strong" />

                {/* Service name */}
                <div className="px-3 md:px-4 py-3 md:py-3.5 flex flex-col items-center justify-center text-center">
                  <span className="font-headline text-[11px] md:text-[13px] font-bold uppercase tracking-tight text-text group-hover:text-red transition-colors duration-150 leading-snug">
                    {service.name}
                  </span>
                  <span className="font-body text-[9px] md:text-[10px] text-text-muted italic mt-0.5 hidden sm:block leading-snug">
                    {service.tagline}
                  </span>
                </div>

                <div className="bg-line-strong" />

                {/* Online booking price */}
                <div className="px-3 md:px-5 py-3 md:py-3.5 flex items-center justify-center">
                  <span className="font-headline text-lg md:text-2xl font-bold text-red group-hover:text-red-hover transition-colors leading-none">
                    {service.price}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex-none border-t border-line">
            <div className="md:hidden">
              <Recommender onSelectService={onSelectService} />
            </div>
            <p className="font-label text-[10px] tracking-widest text-text-subtle text-center py-2.5">
              WALK IN = CASH ONLY · ATM ON SITE · ONLINE PRICES MAY VARY
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
