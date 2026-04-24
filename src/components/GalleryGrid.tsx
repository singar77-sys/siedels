'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { gallery } from '@/data/shop';
import { FadeIn } from './FadeIn';
import { GalleryLightbox } from './GalleryLightbox';

export function GalleryGrid() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) => (i == null ? i : (i + dir + gallery.length) % gallery.length)),
    [],
  );

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
        {gallery.map((item, idx) => (
          <FadeIn key={item.src} delay={(idx % 10) * 0.03}>
            <button
              type="button"
              onClick={() => setLightbox(idx)}
              className="relative block w-full aspect-square overflow-hidden bg-surface-raised group cursor-pointer"
              aria-label={`Open photo: ${item.alt}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover theme-photo group-hover:scale-105 transition-transform duration-500"
              />
              {item.tag && (
                <span className="absolute bottom-2 left-2 font-label text-[9px] md:text-[10px] tracking-widest text-white bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.tag}
                </span>
              )}
            </button>
          </FadeIn>
        ))}
      </div>

      {lightbox != null && (
        <GalleryLightbox
          items={gallery}
          index={lightbox}
          onClose={close}
          onStep={step}
        />
      )}
    </>
  );
}
