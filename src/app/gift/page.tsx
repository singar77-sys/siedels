'use client';

import { useState } from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/FadeIn';
import { Icon } from '@/components/Icon';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';

const DENOMINATIONS = [25, 50, 75, 100];

export default function GiftCardPage() {
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
    <>
      <Nav />
      <main id="main" className="grid-bg min-h-dvh">
        <PageHero
          image="/images/siedels-storefront-summer-angle-medina-ohio.webp"
          imageAlt="Young client getting a haircut at Siedel's Barbershop in Medina, Ohio"
          label="THE GIFT FILE"
          title="THE GIFT"
          titleAccent="OF A CUT"
          subtitle="A gift card to Siedel's. Redeemable for any service — cut, fade, shave, the works. No expiration. No fine print."
        />

        <section className="py-8 md:py-24">
          <div className="max-w-2xl mx-auto px-4 md:px-8">

            {/* Denomination picker */}
            <FadeIn>
              <div className="mb-10 md:mb-14">
                <p className="font-label text-[10px] tracking-[0.35em] text-text-subtle mb-5">CHOOSE AN AMOUNT</p>
                <div className="grid grid-cols-4 gap-3">
                  {DENOMINATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setAmount(d)}
                      className={`py-5 md:py-7 border transition-all duration-150 ${
                        amount === d
                          ? 'bg-red border-red text-white'
                          : 'bg-surface border-line-strong text-text hover:border-red hover:text-red'
                      }`}
                    >
                      <span className="font-headline font-bold text-2xl md:text-4xl">${d}</span>
                    </button>
                  ))}
                </div>
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

            {/* Order summary + checkout */}
            <FadeIn delay={0.2}>
              <div className="bg-surface border border-line-strong p-6 md:p-8 mb-6">
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-line-strong">
                  <div>
                    <p className="font-label text-[10px] tracking-[0.35em] text-text-subtle mb-1">GIFT CARD</p>
                    <p className="font-headline font-bold text-lg uppercase tracking-tight">Siedel&apos;s Barbershop</p>
                    {to && <p className="font-body text-sm text-text-muted mt-0.5">For {to}</p>}
                  </div>
                  <p className="font-headline font-bold text-4xl md:text-5xl text-red">${amount}</p>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-body text-text-muted">Gift card value</span>
                  <span className="font-headline font-bold">${amount}.00</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-6 pb-5 border-b border-line-strong">
                  <span className="font-body text-text-muted">Processing</span>
                  <span className="font-body text-text-subtle">Calculated at checkout</span>
                </div>
                <p className="font-label text-[9px] tracking-widest text-text-subtle mb-6">
                  VALID FOR ANY SERVICE · NO EXPIRATION · REDEEMABLE IN-PERSON
                </p>

                {error && (
                  <p className="font-body text-sm text-red mb-4">{error}</p>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-red text-white font-headline font-bold uppercase tracking-tight py-4 hover:bg-red-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      REDIRECTING TO CHECKOUT…
                    </>
                  ) : (
                    <>
                      BUY ${amount} GIFT CARD
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

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
