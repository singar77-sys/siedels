'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { GalleryItem } from '@/data/shop';
import { Icon } from './Icon';

interface Props {
  items: readonly GalleryItem[];
  index: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}

export function GalleryLightbox({ items, index, onClose, onStep }: Props) {
  const touchStartX = useRef<number | null>(null);
  const item = items[index];

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onStep(1);
      else if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, onStep]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 40) onStep(dx < 0 ? 1 : -1);
      }}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      <button
        type="button"
        className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center text-white/80 hover:text-white"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
      >
        <Icon name="close" className="w-6 h-6" />
      </button>
      <button
        type="button"
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-white/80 hover:text-white"
        onClick={(e) => { e.stopPropagation(); onStep(-1); }}
        aria-label="Previous photo"
      >
        <Icon name="arrow_forward" className="w-7 h-7 rotate-180" />
      </button>
      <button
        type="button"
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-white/80 hover:text-white"
        onClick={(e) => { e.stopPropagation(); onStep(1); }}
        aria-label="Next photo"
      >
        <Icon name="arrow_forward" className="w-7 h-7" />
      </button>
      <div
        className="relative z-[1] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          key={index}
          className="relative animate-lb-in"
          style={{ width: 'min(92vw, calc(80vh * 3 / 2))', aspectRatio: '3 / 2' }}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="92vw"
            className="object-contain"
            priority
          />
        </div>
        <p className="mt-4 font-label text-[11px] tracking-[0.3em] text-white/80 text-center">
          {item.tag && <>{item.tag}{' '}</>}
          <span className="text-white/40">{index + 1} / {items.length}</span>
        </p>
      </div>
    </div>
  );
}
