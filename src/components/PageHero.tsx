import Image from 'next/image';
import { FadeIn } from './FadeIn';

interface PageHeroProps {
  image: string;
  imageAlt: string;
  label: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
}

export function PageHero({ image, imageAlt, label, title, titleAccent, subtitle }: PageHeroProps) {
  return (
    <section className="relative min-h-[50vh] flex items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-center animate-ken-burns brightness-[0.35] grayscale"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-8 pb-12 md:pb-16 pt-32 w-full">
        <FadeIn>
          <div className="border-l-4 border-red pl-8">
            <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">{label}</p>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.88] mb-4">
              {title}
              {titleAccent && <><br /><span className="text-red">{titleAccent}</span></>}
            </h1>
            <p className="font-body text-lg text-text-muted max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
