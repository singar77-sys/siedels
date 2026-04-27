'use client';

import { useState } from 'react';
import { Icon } from './Icon';

const PRESET = [25, 50, 100] as const;

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
    <section className="min-w-full h-full snap-start grid-bg overflow-hidden">
      <div className="max-w-screen-2xl mx-auto h-full px-4 md:px-8 py-5 md:py-8 w-full flex flex-col">
        <div className="border-l-4 border-red pl-4 md:pl-6 mb-4 md:mb-5 flex-none">
          <p className="font-label text-[10px] tracking-[0.3em] text-red mb-1">GIFT CARDS</p>
          <h2 className="font-headline text-2xl md:text-4xl uppercase tracking-tight leading-[0.9]">
            GIVE THE GIFT<br />
            <span className="text-red">OF A FRESH CUT</span>
          </h2>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-2xl mx-auto pb-4">

            {/* Amount */}
            <div className="mb-5">
              <p className="font-label text-[10px] tracking-[0.35em] text-text-subtle mb-3">AMOUNT</p>
              <div className="grid grid-cols-4 gap-2 md:gap-3">
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
                    <span className="font-headline font-bold text-xl md:text-3xl">${d}</span>
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
                  <span className="font-headline font-bold text-sm md:text-base uppercase tracking-tight">CUSTOM</span>
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
                className="w-full bg-surface border border-line-strong px-3 py-2.5 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
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
                className="w-full bg-surface border border-line-strong px-3 py-2.5 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
              />
            </div>

            {/* Gift toggle */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="mt-0.5 accent-red w-4 h-4 flex-none"
                />
                <div>
                  <p className="font-body text-sm text-text">This is a gift for someone else</p>
                  <p className="font-body text-sm text-text-subtle">We'll email the gift card directly to them.</p>
                </div>
              </label>
              {isGift && (
                <div className="mt-3 ml-7">
                  <label className="block font-label text-[10px] tracking-[0.35em] text-text-subtle mb-2">RECIPIENT'S EMAIL</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="their@email.com"
                    maxLength={254}
                    className="w-full bg-surface border border-line-strong px-3 py-2.5 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
                  />
                </div>
              )}
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
                  {resolved >= 25 ? `BUY $${resolved.toFixed(2)} GIFT CARD` : 'BUY GIFT CARD'}
                  <Icon name="arrow_forward" className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="font-body text-[11px] text-text-subtle text-center mt-3 leading-relaxed">
              Secure checkout by Stripe. Your card is emailed instantly after payment.
            </p>
            <p className="font-body text-[11px] text-text-subtle mt-4 leading-relaxed">
              <span className="font-bold text-text-muted">Card terms:</span>{' '}
              Gift cards never expire. After 24 consecutive months of inactivity, a $2.50/month dormancy fee may be deducted from the remaining balance until the card is used or the balance reaches zero. Any use of the card resets the 24-month clock.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
