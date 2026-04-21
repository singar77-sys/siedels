import Image from 'next/image';
import { gallery, SQUARE_BOOKING_URL } from '@/data/shop';
import { Icon } from './Icon';

export function GalleryPanel() {
  return (
    <section className="min-w-full h-full snap-start grid-bg overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 w-full">
        <div className="mb-10 md:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="border-l-4 border-red pl-6 md:pl-8">
            <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">THE WORK</p>
            <h2 className="font-headline text-4xl md:text-6xl uppercase tracking-tight leading-[0.88]">
              FRESH FROM<br /><span className="text-stroke">THE CHAIR</span>
            </h2>
            <p className="font-body text-base md:text-lg text-text-muted max-w-xl mt-4">
              Cuts, fades, and shaves straight off the floor.
            </p>
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-dense gap-1 md:gap-2">
          {gallery.map((item, idx) => {
            // First tile is a 2×2 feature; everything else is uniform square.
            const isFeature = idx === 0;
            return (
              <figure
                key={idx}
                className={`relative overflow-hidden bg-surface-raised group cursor-pointer aspect-square ${isFeature ? 'col-span-2 row-span-2' : ''}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover theme-photo group-hover:scale-105 transition-transform duration-700"
                />
                {/* Subtle dark gradient for tag legibility */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {item.tag && (
                  <figcaption className="absolute bottom-3 left-3 z-10 font-label text-[9px] tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.tag}
                    {item.barber && <span className="text-white/70"> / {item.barber.toUpperCase()}</span>}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>

        <p className="font-label text-[10px] tracking-widest text-text-subtle mt-8 text-center">
          MORE ON INSTAGRAM @SIEDELSBARBER
        </p>
      </div>
    </section>
  );
}
