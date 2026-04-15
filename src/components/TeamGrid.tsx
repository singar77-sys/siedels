'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { FadeIn } from './FadeIn';
import { Modal } from './Modal';
import { team, PHONE, PHONE_HREF, type TeamMember } from '@/data/shop';

export function TeamGrid() {
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
        {team.map((member, idx) => (
          <FadeIn key={idx} delay={idx * 0.04}>
            <article
              className="bg-surface border border-line p-6 md:p-8 group hover:bg-surface-high transition-colors duration-500 cursor-pointer"
              onClick={() => setSelected(member)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(member); } }}
            >
              <div className="aspect-[4/5] overflow-hidden bg-surface-raised mb-6 relative">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.title} at Siedel's Barbershop in Medina, Ohio`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-headline text-6xl font-black text-text-subtle">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="font-headline text-2xl md:text-3xl font-black uppercase tracking-tighter mb-1">{member.name}</h3>
              <p className="font-label text-[10px] tracking-widest text-red mb-6">{member.title.toUpperCase()}</p>
              <a
                href={member.booking}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="block w-full py-3 border border-red text-red font-headline text-sm font-bold uppercase tracking-widest text-center hover:bg-red hover:text-white transition-all duration-300"
              >
                BOOK SESSION
              </a>
            </article>
          </FadeIn>
        ))}
      </div>

      {selected && (
        <Modal onClose={closeModal}>
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center text-text-subtle hover:text-white transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          {selected.image && (
            <div className="relative aspect-[4/3] w-full">
              <Image src={selected.image} alt={`${selected.name}, ${selected.title} at Siedel's Barbershop in Medina, Ohio`} fill sizes="500px" className="object-cover object-top" />
            </div>
          )}
          <div className="p-8">
            <h2 className="font-headline text-2xl md:text-3xl font-black uppercase tracking-tighter">{selected.name}</h2>
            <p className="font-label text-[10px] tracking-widest text-red mt-1 mb-6">{selected.title.toUpperCase()}</p>
            {selected.bio && <p className="font-body text-sm text-text-muted leading-relaxed mb-8">{selected.bio}</p>}
            <a
              href={selected.booking}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-red text-white font-headline text-sm font-bold uppercase tracking-widest text-center hover:bg-red-hover transition-colors"
            >
              BOOK WITH {selected.name.split(' ')[0].toUpperCase()}
            </a>
          </div>
        </Modal>
      )}
    </>
  );
}
