import Image from 'next/image';
import { FadeIn } from './FadeIn';
import { team, PHONE, PHONE_HREF } from '@/data/shop';

export function Team() {
  return (
    <section id="team" className="py-20 md:py-28 bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="mb-14">
            <p className="font-label uppercase text-xs font-semibold text-fg-subtle tracking-[0.2em] mb-3">The Crew</p>
            <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
              Good people with<br />
              <span className="text-accent">sharp skills.</span>
            </h2>
          </div>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {team.map((member, idx) => (
            <FadeIn key={idx} delay={idx * 0.06}>
              <div className="group cursor-default">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-alt mb-3 relative">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
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
                  <div className="absolute inset-0 bg-surface-inv/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-5 px-3 gap-2">
                    <p className="font-headline text-base font-semibold text-fg-inv tracking-tight translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                      {member.name}
                    </p>
                    <p className="font-body text-xs text-accent translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {member.title}
                    </p>
                    <a
                      href={member.booking}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 font-body text-xs font-semibold bg-accent text-on-accent px-4 py-1.5 rounded-sm hover:bg-accent-hover transition-all duration-300 translate-y-3 group-hover:translate-y-0 delay-100"
                    >
                      Book with {member.name.split(' ')[0]}
                    </a>
                  </div>
                </div>
                <h3 className="font-headline text-lg font-semibold tracking-tight">{member.name}</h3>
                <p className="font-body text-sm text-fg-subtle">{member.title}</p>
              </div>
            </FadeIn>
          ))}
          {/* CTA card */}
          <FadeIn delay={team.length * 0.06}>
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
      </div>
    </section>
  );
}
