'use client';

import { useState, type FormEvent } from 'react';

export function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/meepnyaj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, _subject: "Siedel's — New email signup" }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 py-3">
        <span className="material-symbols-outlined text-xl text-status-open">check_circle</span>
        <p className="font-body text-sm text-fg-inv">You&apos;re in. We&apos;ll be in touch.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Honeypot */}
      <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Email address"
          className="flex-1 bg-white/10 border border-white/20 text-fg-inv placeholder:text-fg-inv-muted font-body text-sm px-4 py-3 rounded-md focus:outline-none focus:border-accent transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-accent text-on-accent font-body font-semibold text-sm px-5 py-3 rounded-md hover:bg-accent-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Sending...' : 'Sign Up'}
        </button>
      </div>
      {status === 'error' && (
        <p className="font-body text-sm text-red-400">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
