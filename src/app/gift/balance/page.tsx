'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

function fmt(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

interface BalanceResult {
  code:           string;
  balanceCents:   number;
  faceValueCents: number;
  status:         string;
  recipientName:  string | null;
  lastActivityAt: string;
}

function BalanceChecker() {
  const searchParams            = useSearchParams();
  const [code,    setCode]      = useState('');
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState('');
  const [result,  setResult]    = useState<BalanceResult | null>(null);
  const inputRef                = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const c = searchParams.get('code');
    if (c) setCode(c.toUpperCase());
  }, [searchParams]);

  const lookup = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setResult(null);
    const res = await fetch('/api/gift-card/balance', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ code: trimmed }),
    });
    if (res.ok) {
      setResult(await res.json());
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Gift card not found');
      inputRef.current?.focus();
    }
    setLoading(false);
  };

  const reset = () => { setResult(null); setCode(''); setError(''); };

  if (result) {
    const depleted = result.status === 'depleted';
    return (
      <div className="w-full max-w-sm">
        <p className="font-label text-[10px] tracking-[0.3em] text-red mb-2">GIFT CARD</p>
        <p className="font-headline text-lg tracking-[0.1em] text-text-subtle mb-6">{result.code}</p>

        <div className={`border px-6 py-7 mb-6 text-center ${depleted ? 'border-line bg-surface' : 'border-line-strong bg-surface'}`}>
          <p className="font-label text-[10px] tracking-[0.3em] text-text-subtle mb-3">CURRENT BALANCE</p>
          <p className={`font-headline text-6xl font-bold leading-none mb-3 ${depleted ? 'text-text-subtle' : 'text-text'}`}>
            {depleted ? 'DEPLETED' : fmt(result.balanceCents)}
          </p>
          <p className="font-label text-[9px] tracking-widest text-text-faint">
            {fmt(result.faceValueCents)} original value
          </p>
          {result.recipientName && (
            <p className="font-body text-xs text-text-muted mt-2">For {result.recipientName}</p>
          )}
        </div>

        <button
          type="button"
          onClick={reset}
          className="w-full border border-line-strong text-text-subtle font-headline font-bold uppercase tracking-tight py-3 hover:border-text hover:text-text transition-colors mb-4"
        >
          CHECK ANOTHER
        </button>

        <Link
          href="/gift/terms"
          className="block text-center font-label text-[9px] tracking-widest text-text-faint hover:text-red transition-colors"
        >
          TERMS &amp; DORMANCY POLICY
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <p className="font-label text-[10px] tracking-[0.3em] text-red mb-3">SIEDEL&apos;S BARBERSHOP</p>
      <h1 className="font-headline text-4xl uppercase tracking-tight text-text mb-10">CHECK BALANCE</h1>

      <div className="mb-5">
        <label className="block font-label text-[10px] tracking-widest text-text-subtle mb-3">
          GIFT CARD CODE
        </label>
        <input
          ref={inputRef}
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && lookup()}
          placeholder="SIED-XXXX-XXXX-XXXX"
          autoFocus
          className="w-full bg-surface border border-line-strong px-5 py-4 font-headline text-lg text-text text-center tracking-[0.12em] placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
        />
      </div>

      {error && <p className="font-body text-sm text-red mb-4 text-center">{error}</p>}

      <button
        type="button"
        onClick={lookup}
        disabled={loading || !code.trim()}
        className="w-full bg-red text-white font-headline font-bold uppercase tracking-tight py-4 hover:bg-red-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'CHECKING…' : 'CHECK BALANCE'}
      </button>

      <p className="font-label text-[9px] tracking-widest text-text-faint text-center mt-5">
        Your code is on the gift card email — it starts with SIED-
      </p>
    </div>
  );
}

export default function GiftBalancePage() {
  return (
    <>
      <Nav />
      <main className="min-h-dvh pt-28 md:pt-32 pb-20 flex items-center justify-center px-6">
        <Suspense fallback={
          <div className="w-6 h-6 border-2 border-red/30 border-t-red rounded-full animate-spin" />
        }>
          <BalanceChecker />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
