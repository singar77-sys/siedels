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
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 py-3">
        <span className="material-symbols-outlined text-xl text-red">check_circle</span>
        <p className="font-headline text-sm font-bold uppercase tracking-tight">YOU&apos;RE IN</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
      <div className="flex gap-0">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address"
          className="flex-1 bg-surface-raised border border-line-strong text-text placeholder:text-text-subtle font-body text-sm px-4 py-3 focus:outline-none focus:border-red transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-red text-white font-headline font-bold uppercase tracking-tight text-sm px-6 py-3 hover:bg-red-hover transition-colors disabled:opacity-50"
        >
          {status === 'sending' ? '...' : 'SIGN UP'}
        </button>
      </div>
      {status === 'error' && (
        <p className="font-body text-sm text-red">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
