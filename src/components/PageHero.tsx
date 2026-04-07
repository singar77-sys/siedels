import Image from 'next/image';
import { FadeIn } from './FadeIn';

interface PageHeroProps {
  image: string;
  imageAlt: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
}

export function PageHero({ image, imageAlt, title, titleAccent, subtitle }: PageHeroProps) {
  return (
    <section className="relative min-h-[50vh] flex items-end texture-grain overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-center animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-surface-deep/60 to-transparent" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12 md:pb-16 pt-32">
        <FadeIn>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.92] tracking-tight mb-4 text-fg-inv">
            {title}
            {titleAccent && <>{' '}<span className="text-accent">{titleAccent}</span></>}
          </h1>
          <p className="font-body text-lg md:text-xl text-fg-inv/80 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
