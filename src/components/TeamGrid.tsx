'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FadeIn } from './FadeIn';
import { team, PHONE, PHONE_HREF, type TeamMember } from '@/data/shop';

function TeamModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`About ${member.name}`}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-surface-inv rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-fg-inv hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {member.image && (
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={member.image}
              alt={`${member.name}, ${member.title} at Siedel's Barbershop`}
              fill
              sizes="500px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-inv via-transparent to-transparent" />
          </div>
        )}

        <div className={`p-6 ${member.image ? '-mt-12 relative z-10' : 'pt-14'}`}>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-fg-inv tracking-tight">{member.name}</h2>
          <p className="font-label uppercase text-xs text-accent tracking-[0.15em] mt-1 mb-5">{member.title}</p>

          {member.bio && (
            <p className="font-body text-sm md:text-base text-fg-inv-soft leading-relaxed mb-6">{member.bio}</p>
          )}

          <a
            href={member.booking}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-accent text-on-accent font-body font-semibold px-6 py-3.5 rounded-md hover:bg-accent-hover transition-all duration-300"
          >
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            Book with {member.name.split(' ')[0]}
          </a>
        </div>
      </div>
    </div>
  );
}

export function TeamGrid() {
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {team.map((member, idx) => (
          <FadeIn key={idx} delay={idx * 0.05}>
            <div
              className="group cursor-pointer"
              onClick={() => setSelected(member)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(member); } }}
              aria-label={`View ${member.name}'s profile`}
            >
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-alt mb-3 relative">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.title} at Siedel's Barbershop in Medina Ohio`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-deep">
                    <span className="font-headline text-5xl md:text-6xl font-bold text-accent opacity-80">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-surface-inv/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-6 px-3 gap-2">
                  <p className="font-headline text-base font-semibold text-fg-inv tracking-tight translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    {member.name}
                  </p>
                  <p className="font-body text-xs text-accent translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {member.title}
                  </p>
                  {member.bio && (
                    <span className="font-body text-xs text-fg-inv-muted translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                      Tap to read more
                    </span>
                  )}
                </div>
              </div>
              <h3 className="font-headline text-lg font-semibold tracking-tight">{member.name}</h3>
              <p className="font-body text-sm text-fg-subtle">{member.title}</p>
            </div>
          </FadeIn>
        ))}
        {/* CTA card */}
        <FadeIn delay={team.length * 0.05}>
          <a href={PHONE_HREF} className="group cursor-pointer block">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-inv mb-3 flex flex-col items-center justify-center text-center px-4 group-hover:bg-accent transition-colors duration-500">
              <span className="material-symbols-outlined text-5xl text-accent group-hover:text-on-accent mb-4 transition-colors duration-500">content_cut</span>
              <p className="font-headline text-xl md:text-2xl font-bold text-fg-inv leading-tight mb-2">Your chair<br />is waiting.</p>
              <p className="font-body text-sm text-fg-inv-muted group-hover:text-on-accent/80 transition-colors duration-500">{PHONE}</p>
            </div>
            <h3 className="font-headline text-lg font-semibold tracking-tight text-accent">Book Now</h3>
            <p className="font-body text-sm text-fg-subtle">Walk-ins welcome</p>
          </a>
        </FadeIn>
      </div>

      {selected && <TeamModal member={selected} onClose={closeModal} />}
    </>
  );
}
