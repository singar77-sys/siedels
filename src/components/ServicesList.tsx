'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { services, SQUARE_BOOKING_URL, type Service } from '@/data/shop';
import { FadeIn } from './FadeIn';
import { Modal } from './Modal';
import { Icon } from './Icon';

export function ServicesList() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const closeModal = useCallback(() => setSelectedService(null), []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
        {services.map((service, idx) => (
          <FadeIn key={service.name} delay={idx * 0.03}>
            <button
              onClick={() => setSelectedService(service)}
              className="w-full flex justify-between items-baseline py-5 border-b border-line-strong group text-left cursor-pointer hover:pl-2 transition-all"
            >
              <span className="flex items-center gap-3 font-headline text-base md:text-lg font-bold uppercase tracking-tight text-text-muted group-hover:text-white transition-colors">
                {service.name}
                <Icon name="add_circle" className="w-4 h-4 text-text-subtle group-hover:text-red transition-colors" />
              </span>
              <span className="font-headline text-xl md:text-2xl font-bold text-red">{service.price}</span>
            </button>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={0.2}>
        <p className="font-label text-[10px] tracking-widest text-text-subtle mt-6">TAP ANY SERVICE FOR DETAILS</p>
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
                className="object-cover grayscale contrast-125 brightness-75"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
            </div>
          )}
          <div className="p-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="font-headline text-2xl md:text-3xl font-black uppercase tracking-tighter text-white leading-none">
                {selectedService.name}
              </h2>
              <span className="font-headline text-2xl md:text-3xl font-black text-red whitespace-nowrap">
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
                  <li key={item} className="flex items-start gap-3 font-body text-sm text-white">
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
