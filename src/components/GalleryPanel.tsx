import Image from 'next/image';
import { gallery, SQUARE_BOOKING_URL } from '@/data/shop';

export function GalleryPanel() {
  return (
    <section className="min-w-full h-full snap-start grid-bg overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <div className="max-w-7xl mx-auto px-8 py-12 md:py-20 w-full">
        <div className="mb-10 md:mb-14 flex items-baseline justify-between gap-4">
          <div>
            <p className="font-label text-[11px] tracking-[0.3em] text-red mb-3">THE WORK</p>
            <h2 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85]">
              FRESH <span className="text-red">FROM THE CHAIR</span>
            </h2>
          </div>
          <a
            href={SQUARE_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex font-label text-[10px] tracking-widest text-red hover:text-red-hover transition-colors whitespace-nowrap items-center gap-2"
          >
            BOOK YOUR CHAIR
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
          {gallery.map((item, idx) => {
            // Vary aspect ratios for visual rhythm
            const isTall = idx === 0 || idx === 5 || idx === 8;
            const isWide = idx === 2 || idx === 9;
            const aspect = isTall ? 'aspect-[3/4]' : isWide ? 'aspect-[4/3]' : 'aspect-square';
            const span = isTall ? 'row-span-2' : '';
            return (
              <figure
                key={idx}
                className={`relative overflow-hidden bg-surface-raised group cursor-pointer ${aspect} ${span}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
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
