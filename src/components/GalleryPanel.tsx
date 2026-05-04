'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gallery, SQUARE_BOOKING_URL } from '@/data/shop';
import { Icon } from './Icon';
import { GalleryLightbox } from './GalleryLightbox';

const PAGE_SIZE = 18;
const ROTATION_MS = 9000;

export function GalleryPanel() {
  const wallRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [fading, setFading] = useState(false);

  const totalPages = Math.ceil(gallery.length / PAGE_SIZE);

  // Rotate pages every 5 s with a crossfade
  useEffect(() => {
    if (gallery.length <= PAGE_SIZE) return;
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setPage(p => (p + 1) % totalPages);
        setFading(false);
      }, 350);
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, [totalPages]);

  // Always show exactly PAGE_SIZE tiles, wrapping around modulo gallery length
  const visibleItems = Array.from({ length: Math.min(PAGE_SIZE, gallery.length) }, (_, i) => {
    const idx = (page * PAGE_SIZE + i) % gallery.length;
    return { item: gallery[idx], galleryIdx: idx };
  });

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) => (i == null ? i : (i + dir + gallery.length) % gallery.length)),
    [],
  );

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
    <section className="w-full flex-none h-full snap-start snap-always grid-bg overflow-hidden">
      <div className="max-w-screen-2xl mx-auto h-full px-4 md:px-8 py-5 md:py-8 w-full flex flex-col">
        <div className="flex items-end justify-between gap-4 mb-4 md:mb-5 flex-none">
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

        {/* The Wall — fills the remaining frame both ways */}
        <div ref={wallRef} className="gallery-wall relative flex-1 min-h-0 overflow-hidden touch-pan-x">
        <div
          className="gallery-grid"
          style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.35s ease' }}
        >
          {visibleItems.map(({ item, galleryIdx }, pos) => (
            <button
              type="button"
              key={pos}
              onClick={() => setLightbox(galleryIdx)}
              className="gallery-tile relative overflow-hidden bg-surface-raised cursor-pointer"
              style={{ ['--i' as string]: pos }}
              aria-label={`Open photo: ${item.alt}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                loading="eager"
                quality={85}
                sizes="(max-width: 768px) 25vw, 12vw"
                className="object-cover theme-photo"
                style={item.focalPoint ? { objectPosition: item.focalPoint } : undefined}
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
      </div>

      {lightbox != null && (
        <GalleryLightbox
          items={gallery}
          index={lightbox}
          onClose={closeLightbox}
          onStep={step}
        />
      )}
    </section>
  );
}
