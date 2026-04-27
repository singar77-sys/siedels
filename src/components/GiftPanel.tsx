'use client';

import { useState } from 'react';
import { Icon } from './Icon';

const DENOMINATIONS = [25, 50, 100];

export function GiftPanel() {
  const [amount, setAmount] = useState(50);
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gift-card/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, to: to.trim(), from: from.trim(), message: message.trim() }),
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
        {/* Header — matches Team / Work / Services / Contact density */}
        <div className="border-l-4 border-red pl-4 md:pl-6 mb-4 md:mb-5 flex-none">
          <p className="font-label text-[10px] tracking-[0.3em] text-red mb-1">GIFT CARDS</p>
          <h2 className="font-headline text-2xl md:text-4xl uppercase tracking-tight leading-[0.9]">
            GIVE THE GIFT<br />
            <span className="text-red">OF A FRESH CUT</span>
          </h2>
        </div>

        {/* Body — scrolls vertically inside the panel if content overflows */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-2xl mx-auto pb-4">
            {/* Denominations */}
            <div className="mb-6 md:mb-8">
              <p className="font-label text-[10px] tracking-[0.35em] text-text-subtle mb-3">CHOOSE AN AMOUNT</p>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {DENOMINATIONS.map((d) => (
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
              </div>
            </div>

            {/* Personalize */}
            <div className="mb-6 md:mb-8 space-y-3">
              <p className="font-label text-[10px] tracking-[0.35em] text-text-subtle">PERSONALIZE (OPTIONAL)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-label text-[10px] tracking-widest text-text-subtle mb-1">TO</label>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Recipient name"
                    maxLength={60}
                    className="w-full bg-surface border border-line-strong px-3 py-2 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-label text-[10px] tracking-widest text-text-subtle mb-1">FROM</label>
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Your name"
                    maxLength={60}
                    className="w-full bg-surface border border-line-strong px-3 py-2 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block font-label text-[10px] tracking-widest text-text-subtle mb-1">MESSAGE</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal note..."
                  rows={2}
                  maxLength={200}
                  className="w-full bg-surface border border-line-strong px-3 py-2 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors resize-none"
                />
                <p className="text-right font-label text-[9px] tracking-widest text-text-faint mt-1">{message.length}/200</p>
              </div>
            </div>

            {/* Order summary + buy */}
            <div className="bg-surface border border-line-strong p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-line-strong">
                <div>
                  <p className="font-label text-[10px] tracking-[0.35em] text-text-subtle mb-1">GIFT CARD</p>
                  <p className="font-headline font-bold text-base uppercase tracking-tight">Siedel&apos;s Barbershop</p>
                  {to && <p className="font-body text-sm text-text-muted mt-0.5">For {to}</p>}
                </div>
                <p className="font-headline font-bold text-3xl md:text-4xl text-red">${amount}</p>
              </div>

              <p className="font-label text-[9px] tracking-widest text-text-subtle mb-4">
                VALID FOR ANY SERVICE · NO EXPIRATION · REDEEMABLE IN-PERSON
              </p>

              {error && (
                <p className="font-body text-sm text-red mb-3">{error}</p>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-red text-white font-headline font-bold uppercase tracking-tight py-3 hover:bg-red-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    REDIRECTING…
                  </>
                ) : (
                  <>
                    BUY ${amount} GIFT CARD
                    <Icon name="arrow_forward" className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <p className="font-body text-[11px] text-text-subtle text-center mt-3 leading-relaxed">
              Stripe checkout. Email instantly.{' '}
              <a href="tel:+13309520777" className="text-red hover:text-red-hover">(330) 952-0777</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
