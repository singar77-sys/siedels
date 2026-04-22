import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="min-h-dvh bg-ink grid-bg flex items-center justify-center px-8">
        <div className="max-w-md w-full text-center">
          <div className="border-l-4 border-red pl-8 text-left mb-10">
            <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">PAGE NOT FOUND</p>
            <h1 className="font-headline text-4xl md:text-6xl uppercase tracking-tight leading-[0.88] text-text">
              WRONG<br /><span className="text-stroke">CHAIR</span>
            </h1>
          </div>
          <p className="font-body text-sm text-text-muted mb-8">
            This page doesn&apos;t exist. Let&apos;s get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-red text-white font-headline font-bold uppercase tracking-tight px-8 py-4 hover:bg-red-hover transition-colors"
            >
              BACK HOME
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 border border-line-strong text-text-muted font-headline font-bold uppercase tracking-tight px-8 py-4 hover:text-text hover:border-text transition-colors"
            >
              VIEW SERVICES
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
