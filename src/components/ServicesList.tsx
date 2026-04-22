'use client';

/**
 * Services list styled as a program page: numbered lineup in four
 * sections (CUTS / SHAVES / DETAILS / GROUP), dotted leaders, red
 * price on the right, chevron that turns-the-page to a modal with
 * the full description + includes list. Hover slides the row right
 * and picks up a red left rule (see .program-row in
 * src/app/styles/services-program.css).
 *
 * Optional top ticker — "IN THE CHAIR TODAY · JIM · BILLY · …" —
 * renders when scheduled barbers are known for today.
 */

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { services, SQUARE_BOOKING_URL, type Service } from '@/data/shop';
import { FadeIn } from './FadeIn';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { ServicesTicker } from './ServicesTicker';

const SECTIONS: { label: string; names: string[] }[] = [
  {
    label: 'CUTS',
    names: [
      'Haircut',
      'Razor / Foil Fade',
      'Haircut + Beard Trim',
      'Haircut + Face Shave',
      'Shoulder Length Cut + Rough Dry',
    ],
  },
  {
    label: 'SHAVES',
    names: ['Full Service Shave', 'Head Shave'],
  },
  {
    label: 'DETAILS',
    names: ['Beard Trim', 'Eyebrow / Lip / Chin', 'Shampoo + Style'],
  },
  {
    label: 'GROUP',
    names: ['Duo Haircut', 'Trio Haircut'],
  },
];

interface ServicesListProps {
  working?: { firstName: string }[];
  scheduleKnown?: boolean;
}

export function ServicesList({ working = [], scheduleKnown = false }: ServicesListProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const closeModal = useCallback(() => setSelectedService(null), []);

  // Flatten into ordered rows with a continuous index for numbering.
  let counter = 0;

  return (
    <>
      <ServicesTicker working={working} scheduleKnown={scheduleKnown} />

      {SECTIONS.map((section, sIdx) => {
        const sectionItems = section.names
          .map((name) => services.find((s) => s.name === name))
          .filter((s): s is Service => Boolean(s));

        return (
          <section key={section.label} className={sIdx === 0 ? 'mb-10' : 'mt-6 mb-10'}>
            <div className="flex items-baseline gap-4 mb-3 pb-2 border-b-2 border-text">
              <span className="font-headline text-sm font-bold uppercase tracking-[0.25em] text-red">
                {section.label}
              </span>
              <span className="flex-1 h-px bg-line-strong translate-y-[-4px]" />
              <span className="font-label text-[9px] tracking-widest text-text-subtle tabular-nums">
                {String(sectionItems.length).padStart(2, '0')} ITEMS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
              {sectionItems.map((service) => {
                counter += 1;
                const num = String(counter).padStart(2, '0');
                return (
                  <FadeIn key={service.name} delay={(counter - 1) * 0.03}>
                    <button
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className="program-row w-full flex items-baseline py-4 text-left cursor-pointer group border-b border-line-strong"
                    >
                      <span className="font-mono text-[10px] text-text-subtle tabular-nums mr-3 flex-none w-6">
                        {num}
                      </span>
                      <span className="font-headline text-base md:text-lg font-bold uppercase tracking-tight text-text-muted group-hover:text-text transition-colors whitespace-nowrap">
                        {service.name}
                      </span>
                      <span className="flex-1 mx-3 border-b border-dotted border-text-faint translate-y-[-4px] min-w-[12px]" />
                      <span className="font-headline text-lg md:text-xl font-bold text-red whitespace-nowrap tabular-nums">
                        {service.price}
                      </span>
                      <Icon
                        name="chevron_right"
                        className="program-chevron w-4 h-4 text-text-subtle ml-2 flex-none"
                      />
                    </button>
                  </FadeIn>
                );
              })}
            </div>
          </section>
        );
      })}

      <FadeIn delay={0.2}>
        <p className="font-label text-[10px] tracking-widest text-text-subtle mt-6">
          TAP ANY SERVICE FOR DETAILS · CASH ONLY · ATM ON SITE
        </p>
      </FadeIn>

      {selectedService && (
        <Modal onClose={closeModal}>
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center bg-black/60 text-white hover:bg-red transition-colors"
            aria-label="Close"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
          {selectedService.image && (
            <div className="relative aspect-[16/9] w-full bg-surface-raised">
              <Image
                src={selectedService.image}
                alt={`${selectedService.name} at Siedel's Barbershop, Medina Ohio`}
                fill
                sizes="500px"
                className="object-cover theme-photo contrast-110 brightness-90"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
            </div>
          )}
          <div className="p-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="font-headline text-2xl md:text-3xl uppercase tracking-tight text-text leading-none">
                {selectedService.name}
              </h2>
              <span className="font-headline text-2xl md:text-3xl text-red whitespace-nowrap">
                {selectedService.price}
              </span>
            </div>
            <p className="font-label text-[10px] tracking-widest text-red mb-6">
              {selectedService.tagline.toUpperCase()} · {selectedService.duration.toUpperCase()}
            </p>
            <p className="font-body text-sm text-text-muted leading-relaxed mb-6">
              {selectedService.description}
            </p>
            <div className="mb-8">
              <p className="font-label text-[10px] tracking-widest text-text-subtle mb-3">WHAT&apos;S INCLUDED</p>
              <ul className="space-y-2">
                {selectedService.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-sm text-text">
                    <span className="inline-block w-1 h-1 bg-red mt-2 flex-none" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-red text-white font-headline text-sm font-bold uppercase tracking-widest text-center hover:bg-red-hover transition-colors"
            >
              BOOK {selectedService.name.toUpperCase()}
            </a>
          </div>
        </Modal>
      )}
    </>
  );
}
