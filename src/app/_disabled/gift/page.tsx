'use client';

import { useState } from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/FadeIn';
import { Icon } from '@/components/Icon';
import Link from 'next/link';

const PRESETS = [25, 50, 100] as const;
const MIN_CUSTOM = 25;

export default function GiftCardPage() {
  const [preset,      setPreset]      = useState<number | 'custom'>(50);
  const [customAmt,   setCustomAmt]   = useState('');
  const [to,          setTo]          = useState('');
  const [from,        setFrom]        = useState('');
  const [message,     setMessage]     = useState('');
  const [buyerEmail,  setBuyerEmail]  = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  const amount = preset === 'custom' ? Number(customAmt) || 0 : preset;
  const validAmount = Number.isInteger(amount) && amount >= MIN_CUSTOM;

  const handleCheckout = async () => {
    if (!validAmount) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gift-card/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          amount,
          to:         to.trim()         || undefined,
          from:       from.trim()       || undefined,
          message:    message.trim()    || undefined,
          buyerEmail: buyerEmail.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Checkout failed');
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Try again or call us at (330) 952-0777.'
      );
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <main id="main" className="grid-bg min-h-dvh pt-28 md:pt-32 pb-16 md:pb-24">
        <section>
          <div className="max-w-2xl mx-auto px-4 md:px-8">
            <FadeIn>
              <div className="border-l-4 border-red pl-6 md:pl-8 mb-10 md:mb-14">
                <p className="font-label text-[11px] tracking-[0.3em] text-red mb-3">GIFT CARDS</p>
                <h1 className="font-headline text-4xl md:text-6xl uppercase tracking-tight leading-[0.9] mb-4">
                  GIVE THE GIFT<br />
                  <span className="text-red">OF A FRESH CUT</span>
                </h1>
                <p className="font-body text-base md:text-lg text-text-muted leading-relaxed">
                  Redeemable for any service — cut, fade, shave, the works. Sent by email instantly after purchase.
                </p>
              </div>
            </FadeIn>

            {/* Amount picker */}
            <FadeIn>
              <div className="mb-10 md:mb-14">
                <p className="font-label text-[10px] tracking-[0.35em] text-text-subtle mb-5">CHOOSE AN AMOUNT</p>
                <div className="grid grid-cols-4 gap-3">
                  {PRESETS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => { setPreset(d); setCustomAmt(''); }}
                      className={`py-5 md:py-7 border transition-all duration-150 ${
                        preset === d
                          ? 'bg-red border-red text-white'
                          : 'bg-surface border-line-strong text-text hover:border-red hover:text-red'
                      }`}
                    >
                      <span className="font-headline font-bold text-2xl md:text-4xl">${d}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPreset('custom')}
                    className={`py-5 md:py-7 border transition-all duration-150 ${
                      preset === 'custom'
                        ? 'bg-red border-red text-white'
                        : 'bg-surface border-line-strong text-text hover:border-red hover:text-red'
                    }`}
                  >
                    <span className="font-headline font-bold text-lg md:text-2xl">CUSTOM</span>
                  </button>
                </div>

                {preset === 'custom' && (
                  <div className="mt-4">
                    <label className="block font-label text-[10px] tracking-widest text-text-subtle mb-2">
                      CUSTOM AMOUNT (MIN $25)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-headline font-bold text-text-muted">$</span>
                      <input
                        type="number"
                        min={25}
                        max={10000}
                        step={1}
                        value={customAmt}
                        onChange={(e) => setCustomAmt(e.target.value)}
                        placeholder="50"
                        className="w-full bg-surface border border-line-strong pl-8 pr-4 py-3 font-headline font-bold text-xl text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
                      />
                    </div>
                    {customAmt && !validAmount && (
                      <p className="font-label text-[10px] tracking-widest text-red mt-2">Minimum $25, whole dollars only</p>
                    )}
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Personalization */}
            <FadeIn delay={0.1}>
              <div className="mb-10 md:mb-14 space-y-5">
                <p className="font-label text-[10px] tracking-[0.35em] text-text-subtle">PERSONALIZE (OPTIONAL)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label text-[10px] tracking-widest text-text-subtle mb-2">TO</label>
                    <input
                      type="text"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="Recipient name"
                      maxLength={60}
                      className="w-full bg-surface border border-line-strong px-4 py-3 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-label text-[10px] tracking-widest text-text-subtle mb-2">FROM</label>
                    <input
                      type="text"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      placeholder="Your name"
                      maxLength={60}
                      className="w-full bg-surface border border-line-strong px-4 py-3 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-label text-[10px] tracking-widest text-text-subtle mb-2">MESSAGE</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal note..."
                    rows={3}
                    maxLength={200}
                    className="w-full bg-surface border border-line-strong px-4 py-3 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors resize-none"
                  />
                  <p className="text-right font-label text-[9px] tracking-widest text-text-faint mt-1">{message.length}/200</p>
                </div>
              </div>
            </FadeIn>

            {/* Buyer email */}
            <FadeIn delay={0.15}>
              <div className="mb-10 md:mb-14">
                <p className="font-label text-[10px] tracking-[0.35em] text-text-subtle mb-4">WHERE TO SEND THE CODE</p>
                <div>
                  <label className="block font-label text-[10px] tracking-widest text-text-subtle mb-2">YOUR EMAIL</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-surface border border-line-strong px-4 py-3 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
                  />
                  <p className="font-label text-[9px] tracking-widest text-text-faint mt-2">
                    Your gift card code is emailed here right after checkout. Stripe will also confirm at this address.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Order summary + checkout */}
            <FadeIn delay={0.2}>
              <div className="bg-surface border border-line-strong p-6 md:p-8 mb-6">
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-line-strong">
                  <div>
                    <p className="font-label text-[10px] tracking-[0.35em] text-text-subtle mb-1">GIFT CARD</p>
                    <p className="font-headline font-bold text-lg uppercase tracking-tight">Siedel&apos;s Barbershop</p>
                    {to && <p className="font-body text-sm text-text-muted mt-0.5">For {to}</p>}
                  </div>
                  <p className="font-headline font-bold text-4xl md:text-5xl text-red">
                    {validAmount ? `$${amount}` : '—'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-body text-text-muted">Gift card value</span>
                  <span className="font-headline font-bold">{validAmount ? `$${amount}.00` : '—'}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-body text-text-muted">Processing fee</span>
                  <span className="font-body text-text-subtle">$1.50</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold mb-6 pb-5 border-b border-line-strong pt-3 border-t border-line-strong mt-3">
                  <span className="font-headline uppercase tracking-tight">Total</span>
                  <span className="font-headline text-lg">{validAmount ? `$${(amount + 1.5).toFixed(2)}` : '—'}</span>
                </div>

                <p className="font-label text-[9px] tracking-widest text-text-subtle mb-6">
                  VALID FOR ANY SERVICE · REDEEMABLE IN-PERSON ·{' '}
                  <Link href="/gift/terms" className="underline hover:text-red transition-colors">SEE TERMS</Link>
                </p>

                {error && <p className="font-body text-sm text-red mb-4">{error}</p>}

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={loading || !validAmount}
                  className="w-full flex items-center justify-center gap-3 bg-red text-white font-headline font-bold uppercase tracking-tight py-4 hover:bg-red-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      REDIRECTING TO CHECKOUT…
                    </>
                  ) : (
                    <>
                      {validAmount ? `BUY $${amount} GIFT CARD` : 'SELECT AN AMOUNT'}
                      <Icon name="arrow_forward" className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="font-body text-xs text-text-subtle text-center leading-relaxed">
                Secure checkout powered by Stripe. Gift card code delivered by email immediately after purchase.
                Questions? Call <a href="tel:+13309520777" className="text-red hover:text-red-hover">(330) 952-0777</a>.
              </p>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
