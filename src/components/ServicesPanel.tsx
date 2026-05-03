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
  const sectionRef = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full flex-none h-full snap-start grid-bg overflow-hidden relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setLit(true)}
      onMouseLeave={() => setLit(false)}
    >
      {/* Flashlight overlay — transparent at cursor, dark at edges */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
        style={{
          opacity: lit ? 1 : 0,
          background: 'radial-gradient(325px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(227,27,35,0.18) 0%, transparent 70%)',
        }}
      />
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

        <div className="flex-1 min-h-0 bg-surface border border-line-strong flex flex-col overflow-hidden opacity-[0.95]">
          <div className="flex-1 min-h-0 relative">
            <div className="md:hidden absolute bottom-0 left-0 right-0 h-10 pointer-events-none z-10"
              style={{ background: 'linear-gradient(to top, var(--surface) 0%, transparent 100%)' }} />
            <div className="no-scrollbar h-full flex flex-col md:flex-row md:divide-x md:divide-line-strong overflow-y-auto md:overflow-hidden">
              {[services.filter((_, i) => i % 2 === 0), services.filter((_, i) => i % 2 !== 0)].map(
                (col, ci) => (
                  <div key={ci} className="md:flex-1 md:flex md:flex-col md:divide-y md:divide-line-strong md:overflow-hidden divide-y divide-line-strong">
                    {col.map((service) => (
                      <button
                        key={service.name}
                        onClick={() => onSelectService(service)}
                        className="w-full flex items-center gap-4 md:gap-6 px-4 md:px-6 py-3 md:py-0 md:flex-1 group text-left hover:bg-surface-raised/50 transition-colors duration-150"
                      >
                        <span className="font-headline text-xl md:text-2xl font-bold text-red whitespace-nowrap w-12 md:w-16 shrink-0 leading-none group-hover:text-red-hover transition-colors">
                          {service.price}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block font-headline text-sm md:text-[15px] font-bold uppercase tracking-tight text-text group-hover:text-red transition-colors duration-150 leading-snug">
                            {service.name}
                          </span>
                          <span className="block font-body text-[11px] md:text-xs text-text-muted italic mt-0.5 leading-snug">
                            {service.tagline}
                          </span>
                        </span>
                        <span className="shrink-0 flex flex-col items-end gap-1.5">
                          <span className="font-label text-[9px] md:text-[10px] tracking-widest text-text-subtle uppercase">
                            {service.duration}
                          </span>
                          <Icon
                            name="add"
                            className="w-3.5 h-3.5 text-text-subtle group-hover:text-red group-hover:rotate-45 transition-all duration-200"
                          />
                        </span>
                      </button>
                    ))}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="flex-none border-t border-line">
            <div className="md:hidden">
              <Recommender onSelectService={onSelectService} />
            </div>
            <p className="font-label text-[10px] tracking-widest text-text-subtle text-center py-2.5">
              TAP ANY SERVICE FOR DETAILS · CASH ONLY · ATM ON SITE
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
