'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Icon } from './Icon';

const PRESET = [25, 50, 100] as const;
const CARD_PHOTO = '/images/siedels-window-stay-sharp-medina.webp';

export function GiftPanel() {
  const [amount, setAmount] = useState<number | 'custom'>(50);
  const [customAmt, setCustomAmt] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resolved = amount === 'custom' ? parseInt(customAmt) || 0 : amount;

  const handleCheckout = async () => {
    if (!buyerName.trim()) { setError('Please enter your name.'); return; }
    if (!buyerEmail.trim()) { setError('Please enter your email.'); return; }
    if (isGift && !recipientEmail.trim()) { setError("Please enter the recipient's email."); return; }
    if (amount === 'custom' && resolved < 25) { setError('Custom amount must be at least $25.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gift-card/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: resolved,
          from: buyerName.trim(),
          buyerEmail: buyerEmail.trim(),
          recipientEmail: isGift ? recipientEmail.trim() : undefined,
        }),
      });
      if (!res.ok) throw new Error('Checkout failed');
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setError('Something went wrong. Try again or call us at (330) 952-0777.');
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex-none h-full snap-start snap-always grid-bg overflow-hidden">
      <div className="max-w-screen-2xl mx-auto h-full px-4 md:px-8 py-5 md:py-8 w-full flex flex-col">

        <div className="border-l-4 border-red pl-4 md:pl-6 mb-4 md:mb-5 flex-none">
          <p className="font-label text-[10px] tracking-[0.3em] text-red mb-1">GIFT CARDS</p>
          <h2 className="font-headline text-2xl md:text-4xl uppercase tracking-tight leading-[0.9]">
            A SHARP CUT <span className="text-stroke">GIFTED</span>
          </h2>
        </div>

        <div className="flex-1 min-h-0 flex flex-col md:grid md:grid-cols-2 md:gap-6 overflow-hidden">

          {/* ── LEFT: Gift card preview (desktop only) ── */}
          <div className="hidden md:flex flex-col relative overflow-hidden bg-[#111] border border-red/20">
            {/* Ghost photo */}
            <Image
              src={CARD_PHOTO}
              alt=""
              fill
              aria-hidden="true"
              className="object-cover object-center opacity-[0.15] grayscale pointer-events-none"
              sizes="50vw"
            />

            {/* Grid texture */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(227,27,35,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(227,27,35,0.06) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            {/* Red corner accent — top right */}
            <div
              className="absolute top-0 right-0 w-28 h-28 bg-red pointer-events-none"
              style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
            />

            {/* Card content */}
            <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-10">

              {/* Top: branding */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-label text-[10px] tracking-[0.4em] text-red">SIEDEL&apos;S BARBERSHOP</p>
                  <p className="font-label text-[9px] tracking-[0.25em] text-white/30 mt-1">MEDINA, OHIO · EST. 2018</p>
                </div>
                <div className="border border-white/20 px-2 py-1">
                  <span className="font-label text-[9px] tracking-[0.2em] text-white/40">GIFT CARD</span>
                </div>
              </div>

              {/* Center: live amount */}
              <div className="text-center">
                <p
                  className="font-headline font-bold text-white leading-none transition-all duration-200"
                  style={{ fontSize: 'clamp(72px, 9vw, 128px)' }}
                >
                  {resolved >= 25 ? `$${resolved}` : '$—'}
                </p>
                <p className="font-label text-[10px] tracking-[0.3em] text-white/30 mt-3">
                  {resolved >= 25 ? 'GIFT CARD VALUE' : 'SELECT AN AMOUNT'}
                </p>
              </div>

              {/* Bottom: metadata */}
              <div>
                <p className="font-label text-[9px] tracking-[0.25em] text-white/40 mb-4 uppercase">
                  Good for any service · any barber
                </p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-label text-[8px] tracking-widest text-white/20 mb-1">CARD NUMBER</p>
                    <p className="font-mono text-sm text-white/20 tracking-[0.15em]">XXXX – XXXX – XXXX</p>
                  </div>
                  <p className="font-label text-[9px] tracking-[0.2em] text-red/70">NEVER EXPIRES</p>
                </div>
              </div>
            </div>

            {/* Red left-edge stripe */}
            <div className="absolute bottom-0 left-0 w-1 h-1/3 bg-red z-10" />
          </div>

          {/* ── RIGHT: Form ── */}
          <div className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {/* On desktop: h-full flex-col so CTA pins to bottom */}
            <div className="md:h-full md:flex md:flex-col pb-2">

              {/* Mobile-only: compact card strip */}
              <div className="md:hidden bg-[#111] border border-red/20 px-4 py-3 mb-5 flex items-center justify-between">
                <div>
                  <p className="font-label text-[9px] tracking-[0.3em] text-red">SIEDEL&apos;S BARBERSHOP</p>
                  <p className="font-label text-[8px] tracking-[0.2em] text-white/40 mt-0.5">GIFT CARD · NEVER EXPIRES</p>
                </div>
                <p className="font-headline font-bold text-white text-3xl leading-none">
                  {resolved >= 25 ? `$${resolved}` : '$—'}
                </p>
              </div>

              {/* Amount */}
              <div className="mb-4 md:mb-5">
                <p className="font-label text-[10px] tracking-[0.35em] text-text-subtle mb-3">AMOUNT</p>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setAmount(d)}
                      className={`py-3 md:py-5 border transition-all duration-150 ${
                        amount === d
                          ? 'bg-red border-red text-white'
                          : 'bg-surface border-line-strong text-text hover:border-red hover:text-red'
                      }`}
                    >
                      <span className="font-headline font-bold text-xl md:text-2xl">${d}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount('custom')}
                    className={`py-3 md:py-5 border transition-all duration-150 ${
                      amount === 'custom'
                        ? 'bg-red border-red text-white'
                        : 'bg-surface border-line-strong text-text hover:border-red hover:text-red'
                    }`}
                  >
                    <span className="font-headline font-bold text-sm uppercase tracking-tight">CUSTOM</span>
                  </button>
                </div>
                {amount === 'custom' && (
                  <input
                    type="number"
                    min={25}
                    max={10000}
                    value={customAmt}
                    onChange={(e) => setCustomAmt(e.target.value)}
                    placeholder="Enter amount ($25 min)"
                    className="mt-2 w-full bg-surface border border-line-strong px-3 py-2.5 font-headline text-2xl text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
                  />
                )}
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block font-label text-[10px] tracking-[0.35em] text-text-subtle mb-2">YOUR NAME</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="First and last"
                  maxLength={80}
                  className="w-full bg-surface border border-line-strong px-3 py-2.5 md:py-3 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div className="mb-5">
                <label className="block font-label text-[10px] tracking-[0.35em] text-text-subtle mb-2">YOUR EMAIL</label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="you@email.com"
                  maxLength={254}
                  className="w-full bg-surface border border-line-strong px-3 py-2.5 md:py-3 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
                />
              </div>

              {/* Gift toggle */}
              <div className="mb-5">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="mt-0.5 accent-red w-4 h-4 flex-none"
                  />
                  <div>
                    <p className="font-body text-sm text-text">This is a gift for someone else</p>
                    <p className="font-body text-sm text-text-subtle">We&apos;ll email the gift card directly to them.</p>
                  </div>
                </label>
                {isGift && (
                  <div className="mt-3 ml-7">
                    <label className="block font-label text-[10px] tracking-[0.35em] text-text-subtle mb-2">RECIPIENT&apos;S EMAIL</label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="their@email.com"
                      maxLength={254}
                      className="w-full bg-surface border border-line-strong px-3 py-2.5 md:py-3 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* ── Desktop gap — occasion tags + perks ── */}
              <div className="hidden md:flex flex-1 flex-col justify-center gap-6 py-5 mt-3 border-t border-line">
                <div>
                  <p className="font-label text-[9px] tracking-[0.3em] text-text-subtle mb-3">PERFECT FOR</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Father's Day", 'Birthdays', 'Graduations', 'Holidays', 'Just Because'].map((occ) => (
                      <span key={occ} className="font-label text-[9px] tracking-widest text-text-subtle border border-line-strong px-2.5 py-1 uppercase">
                        {occ}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    'Good for any service · any barber',
                    'Emailed instantly after payment',
                    'Never expires',
                    'Redeemable in-shop at checkout',
                  ].map((perk) => (
                    <div key={perk} className="flex items-center gap-2.5">
                      <span className="text-red text-xs font-bold shrink-0">✓</span>
                      <span className="font-label text-[10px] tracking-widest text-text-muted uppercase">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && <p className="font-body text-sm text-red mb-3">{error}</p>}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-red text-white font-headline font-bold uppercase tracking-tight py-4 hover:bg-red-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    REDIRECTING…
                  </>
                ) : (
                  <>
                    {resolved >= 25 ? `BUY $${resolved} GIFT CARD` : 'BUY GIFT CARD'}
                    <Icon name="arrow_forward" className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="font-body text-[11px] text-text-subtle text-center mt-3 leading-relaxed">
                Secure checkout by Stripe. Your card is emailed instantly after payment.
              </p>

              {/* Tip disclaimer */}
              <div className="mt-4 border border-line-strong bg-surface-raised px-4 py-3">
                <p className="font-label text-[9px] tracking-[0.3em] text-red mb-2">HEADS UP</p>
                <p className="font-headline text-[13px] font-bold uppercase tracking-tight text-text mb-1.5">
                  The card covers the cut. Tips are a different edge.
                </p>
                <p className="font-body text-xs text-text-muted leading-relaxed">
                  Gift cards are good for any service at full price — gratuity isn&apos;t included. Your barber brings razor-sharp skill to every visit, and a little something extra is always appreciated.
                </p>
              </div>

              <p className="font-body text-[11px] text-text-subtle mt-3 leading-relaxed">
                <span className="font-bold text-text-muted">Card terms:</span>{' '}
                Gift cards never expire. After 24 consecutive months of inactivity, a $2.50/month dormancy fee may be deducted from the remaining balance until the card is used or the balance reaches zero. Any use of the card resets the 24-month clock.
              </p>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
