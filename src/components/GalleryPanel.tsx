'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gallery, SQUARE_BOOKING_URL } from '@/data/shop';
import { Icon } from './Icon';

export function GalleryPanel() {
  const wallRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) => (i == null ? i : (i + dir + gallery.length) % gallery.length)),
    [],
  );

  useEffect(() => {
    if (lightbox == null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, closeLightbox, step]);

  useEffect(() => {
    const el = wallRef.current;
    const spot = spotRef.current;
    const dim = dimRef.current;
    if (!el || !spot || !dim) return;

    // Respect reduced motion & skip coarse pointers (touch) — static crisp tiles.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (reduceMotion || coarsePointer) {
      el.classList.add('is-static');
      return;
    }

    let rafId: number | null = null;
    let tx = 50, ty = 50; // target % position
    let cx = 50, cy = 50; // current (lerped)
    let active = false;

    // Mask size params — keep in sync with CSS --spot-clear/--spot-soft.
    const CLEAR = 100; // px
    const SOFT = 280;  // px

    const applyMask = () => {
      const mask = `radial-gradient(circle at ${cx}% ${cy}%, transparent 0, transparent ${CLEAR}px, #000 ${SOFT}px)`;
      spot.style.maskImage = mask;
      spot.style.webkitMaskImage = mask;
      dim.style.maskImage = mask;
      dim.style.webkitMaskImage = mask;
      el.style.setProperty('--mx', `${cx}%`);
      el.style.setProperty('--my', `${cy}%`);
    };

    applyMask();

    const kick = () => {
      if (rafId == null) rafId = requestAnimationFrame(tick);
    };

    const tick = () => {
      const dx = tx - cx;
      const dy = ty - cy;
      cx += dx * 0.18;
      cy += dy * 0.18;
      applyMask();
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
      if (!active) {
        active = true;
        el.classList.add('is-hot');
      }
      kick();
    };
    const onLeave = () => {
      active = false;
      el.classList.remove('is-hot');
      tx = 50; ty = 50;
      kick();
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section className="min-w-full h-full snap-start grid-bg overflow-hidden flex flex-col">
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 pt-5 md:pt-8 pb-3 md:pb-4 flex-none">
        <div className="flex items-end justify-between gap-4">
          <div className="border-l-4 border-red pl-4 md:pl-6">
            <p className="font-label text-[10px] tracking-[0.3em] text-red mb-1">THE WORK</p>
            <h2 className="font-headline text-2xl md:text-4xl uppercase tracking-tight leading-[0.9]">
              FRESH FROM <span className="text-stroke">THE CHAIR</span>
            </h2>
          </div>
          <a
            href={SQUARE_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex font-label text-[11px] tracking-[0.3em] text-red hover:text-red-hover transition-colors whitespace-nowrap items-center gap-2"
          >
            BOOK YOUR CHAIR
            <Icon name="arrow_forward" className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* The Wall — grid fills width edge-to-edge, centered vertically */}
      <div ref={wallRef} className="gallery-wall relative flex-1 min-h-0 w-full overflow-hidden flex items-center">
        <div className="gallery-grid">
          {gallery.map((item, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setLightbox(idx)}
              className="gallery-tile relative overflow-hidden bg-surface-raised cursor-pointer"
              style={{ ['--i' as string]: idx }}
              aria-label={`Open photo: ${item.alt}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 25vw, 12vw"
                className="object-cover theme-photo"
              />
              {item.tag && (
                <span className="gallery-cap absolute bottom-1 left-1 right-1 font-label text-[8px] md:text-[9px] tracking-widest text-white/95 truncate">
                  {item.tag}
                </span>
              )}
            </button>
          ))}
        </div>

        <div ref={spotRef} className="gallery-spotlight" aria-hidden="true" />
        <div ref={dimRef} className="gallery-spotlight-dim" aria-hidden="true" />
        <div className="gallery-beam" aria-hidden="true" />
        <div className="gallery-ring" aria-hidden="true" />
      </div>

      {lightbox != null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={gallery[lightbox].alt}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <button
            type="button"
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            aria-label="Close"
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white p-3"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            aria-label="Previous photo"
          >
            <Icon name="arrow_forward" className="w-7 h-7 rotate-180" />
          </button>
          <button
            type="button"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white p-3"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            aria-label="Next photo"
          >
            <Icon name="arrow_forward" className="w-7 h-7" />
          </button>
          <div
            className="relative z-[1] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative" style={{ width: 'min(92vw, calc(80vh * 3 / 2))', aspectRatio: '3 / 2' }}>
              <Image
                src={gallery[lightbox].src}
                alt={gallery[lightbox].alt}
                fill
                sizes="92vw"
                className="object-contain"
                priority
              />
            </div>
            <p className="mt-4 font-label text-[11px] tracking-[0.3em] text-white/80 text-center">
              {gallery[lightbox].tag && <>{gallery[lightbox].tag}{' '}</>}
              <span className="text-white/40">{lightbox + 1} / {gallery.length}</span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
