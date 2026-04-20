'use client';

import { PHONE, PHONE_HREF } from '@/data/shop';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-8">
      <div className="max-w-md w-full text-center">
        <div className="border-l-4 border-red pl-8 text-left mb-10">
          <p className="font-label text-[11px] tracking-[0.3em] text-red mb-4">SOMETHING WENT WRONG</p>
          <h1 className="font-headline text-4xl md:text-6xl uppercase tracking-tight leading-[0.88] text-text">
            HOLD<br /><span className="text-stroke">TIGHT</span>
          </h1>
        </div>
        <p className="font-body text-sm text-text-muted mb-8">
          Something broke on our end. Try again or give us a call.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-red text-white font-headline font-bold uppercase tracking-tight px-8 py-4 hover:bg-red-hover transition-colors"
          >
            TRY AGAIN
          </button>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-2 border border-line-strong text-text-muted font-headline font-bold uppercase tracking-tight px-8 py-4 hover:text-text hover:border-text transition-colors"
          >
            CALL {PHONE}
          </a>
        </div>
      </div>
    </div>
  );
}
