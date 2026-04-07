import { FadeIn } from './FadeIn';

const features = [
  {
    icon: 'sports_football',
    title: 'Cleveland Proud',
    text: 'Browns flag flying, Guardians prints on the wall, and conversations about the next big game.',
  },
  {
    icon: 'content_cut',
    title: 'Real Barber Chairs',
    text: "Classic setup. Dark cabinets, good mirrors, and barbers who know what they're doing.",
  },
  {
    icon: 'weekend',
    title: 'Comfortable Waiting',
    text: "Olive chairs, sports gallery wall, TV mounted up. You won't mind the wait.",
  },
];

export function TheShop() {
  return (
    <section id="the-shop" className="py-20 md:py-28 bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="font-label uppercase text-xs font-semibold text-fg-subtle tracking-[0.2em] mb-3">Come Hang Out</p>
            <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">
              The shop <span className="text-accent">feels like home.</span>
            </h2>
            <p className="font-body text-fg-muted text-base md:text-lg max-w-2xl mx-auto">
              Cleveland memorabilia on the walls. A comfortable waiting area where
              you actually want to sit. The game&apos;s always on.
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((card, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="bg-surface-alt rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                <span className="material-symbols-outlined text-4xl text-accent mb-4 block">{card.icon}</span>
                <h3 className="font-headline text-xl font-bold mb-2">{card.title}</h3>
                <p className="font-body text-fg-muted text-sm leading-relaxed">{card.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
