'use client';

import { useState, useRef, useEffect } from 'react';

type Screen = 'pin' | 'lookup' | 'charge' | 'confirm';

interface CardData {
  id:             string;
  code:           string;
  balanceCents:   number;
  faceValueCents: number;
  status:         string;
  recipientName:  string | null;
}

function fmt(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// ── PIN screen ────────────────────────────────────────────────────────────────
function PinScreen({ onAuth }: { onAuth: (staffName: string) => void }) {
  const [pin,     setPin]     = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = async () => {
    if (!pin) return;
    setLoading(true);
    setError('');
    const res = await fetch('/api/pin/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ pin }),
    });
    if (res.ok) {
      const data = await res.json();
      inputRef.current?.blur();
      onAuth(data.staffName ?? 'Staff');
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Incorrect PIN');
      setPin('');
      inputRef.current?.focus();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-dvh bg-ink flex items-center justify-center p-6">
      <div className="w-full max-w-sm sm:max-w-md">
        <p className="font-label text-[10px] tracking-[0.3em] text-red mb-3">SIEDEL&apos;S BARBERSHOP</p>
        <h1 className="font-headline text-4xl uppercase tracking-tight text-text mb-10">STAFF LOGIN</h1>

        <div className="mb-5">
          <label className="block font-label text-[10px] tracking-widest text-text-subtle mb-3">SHIFT PIN</label>
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="••••"
            autoComplete="current-password"
            className="w-full bg-surface border border-line-strong px-5 py-5 font-headline text-2xl text-text text-center tracking-[0.4em] placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
          />
        </div>

        {error && <p className="font-body text-sm text-red mb-4 text-center">{error}</p>}

        <button
          type="button"
          onClick={submit}
          disabled={loading || !pin}
          className="touch-manipulation w-full bg-red text-white font-headline font-bold uppercase tracking-tight py-5 text-xl hover:bg-red-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'SIGNING IN…' : 'SIGN IN'}
        </button>
      </div>
    </div>
  );
}

// ── Lookup screen ─────────────────────────────────────────────────────────────
function LookupScreen({
  staffName,
  onFound,
}: {
  staffName: string;
  onFound:   (card: CardData) => void;
}) {
  const [code,    setCode]    = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const lookup = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    const res = await fetch('/api/redeem/lookup', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ code: trimmed }),
    });
    if (res.ok) {
      const data = await res.json();
      inputRef.current?.blur();
      onFound(data);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Card not found');
      setCode('');
      inputRef.current?.focus();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-dvh bg-ink flex items-center justify-center p-6">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="flex items-baseline justify-between mb-3">
          <p className="font-label text-[10px] tracking-[0.3em] text-red">GIFT CARD REDEMPTION</p>
          <p className="font-label text-[10px] tracking-widest text-text-subtle">{staffName.toUpperCase()}</p>
        </div>
        <h1 className="font-headline text-4xl uppercase tracking-tight text-text mb-10">LOOK UP CARD</h1>

        <div className="mb-5">
          <label className="block font-label text-[10px] tracking-widest text-text-subtle mb-3">SCAN OR TYPE CODE</label>
          <input
            ref={inputRef}
            type="text"
            inputMode="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && lookup()}
            placeholder="SIED-XXXX-XXXX-XXXX"
            autoCapitalize="characters"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-surface border border-line-strong px-5 py-5 font-headline text-lg text-text text-center tracking-[0.12em] placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
          />
        </div>

        {error && <p className="font-body text-sm text-red mb-4 text-center">{error}</p>}

        <button
          type="button"
          onClick={lookup}
          disabled={loading || !code.trim()}
          className="touch-manipulation w-full bg-red text-white font-headline font-bold uppercase tracking-tight py-5 text-xl hover:bg-red-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'LOOKING UP…' : 'LOOK UP BALANCE'}
        </button>
      </div>
    </div>
  );
}

// ── Charge screen ─────────────────────────────────────────────────────────────
function ChargeScreen({
  card,
  staffName,
  sessionId,
  onCharged,
  onBack,
}: {
  card:      CardData;
  staffName: string;
  sessionId: string;
  onCharged: (newBalance: number, charged: number) => void;
  onBack:    () => void;
}) {
  const [dollars, setDollars] = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef       = useRef<HTMLInputElement>(null);
  const idempotencyKey = useRef(`${sessionId}-${Math.random().toString(36).slice(2, 8)}`);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const amountCents = Math.round(parseFloat(dollars || '0') * 100);
  const valid = amountCents > 0 && amountCents <= card.balanceCents;

  const charge = async () => {
    if (!valid) return;
    setLoading(true);
    setError('');
    const res = await fetch('/api/redeem/charge', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        cardId:         card.id,
        amountCents,
        note:           `POS ${sessionId}`,
        idempotencyKey: idempotencyKey.current,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      inputRef.current?.blur();
      onCharged(data.newBalanceCents, amountCents);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Charge failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-dvh bg-ink flex items-center justify-center p-6">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="flex items-baseline justify-between mb-1">
          <p className="font-label text-[10px] tracking-[0.3em] text-red">GIFT CARD</p>
          <p className="font-label text-[10px] tracking-widest text-text-subtle">{staffName.toUpperCase()}</p>
        </div>
        <p className="font-headline text-xl tracking-[0.12em] text-text-subtle mb-1">{card.code}</p>
        {card.recipientName && (
          <p className="font-body text-sm text-text-muted mb-1">For {card.recipientName}</p>
        )}

        <div className="bg-surface border border-line-strong px-6 py-6 my-6 text-center">
          <p className="font-label text-[10px] tracking-[0.3em] text-text-subtle mb-2">CURRENT BALANCE</p>
          <p className="font-headline text-6xl font-bold text-text">{fmt(card.balanceCents)}</p>
        </div>

        <div className="mb-5">
          <label className="block font-label text-[10px] tracking-widest text-text-subtle mb-3">CHARGE AMOUNT</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-headline text-3xl text-text-muted">$</span>
            <input
              ref={inputRef}
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              max={card.balanceCents / 100}
              value={dollars}
              onChange={(e) => setDollars(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && charge()}
              placeholder="0.00"
              autoComplete="off"
              className="w-full bg-surface border border-line-strong pl-12 pr-5 py-5 font-headline text-4xl text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
            />
          </div>
          {dollars && !valid && amountCents > 0 && (
            <p className="font-label text-[10px] tracking-widest text-red mt-2">
              {amountCents > card.balanceCents
                ? `Exceeds balance of ${fmt(card.balanceCents)}`
                : 'Enter a valid amount'}
            </p>
          )}
        </div>

        {error && <p className="font-body text-sm text-red mb-4 text-center">{error}</p>}

        <button
          type="button"
          onClick={charge}
          disabled={loading || !valid}
          className="touch-manipulation w-full bg-red text-white font-headline font-bold uppercase tracking-tight py-6 text-2xl hover:bg-red-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
        >
          {loading ? 'CHARGING…' : valid ? `CHARGE ${fmt(amountCents)}` : 'ENTER AMOUNT'}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="touch-manipulation w-full border border-line-strong text-text-subtle font-headline font-bold uppercase tracking-tight py-4 hover:border-text hover:text-text transition-colors"
        >
          ← BACK
        </button>
      </div>
    </div>
  );
}

// ── Confirm screen ────────────────────────────────────────────────────────────
function ConfirmScreen({
  newBalance,
  charged,
  code,
  onNext,
}: {
  newBalance: number;
  charged:    number;
  code:       string;
  onNext:     () => void;
}) {
  return (
    <div className="min-h-dvh bg-ink flex items-center justify-center p-6">
      <div className="w-full max-w-sm sm:max-w-md text-center">
        <p className="text-9xl font-bold text-green-400 mb-4 leading-none">✓</p>
        <p className="font-label text-[11px] tracking-[0.35em] text-green-400 mb-4">CHARGED!</p>
        <p className="font-headline text-7xl font-bold text-text mb-10">{fmt(charged)}</p>

        <div className="bg-surface border border-line-strong px-6 py-6 mb-8">
          <p className="font-label text-[10px] tracking-[0.3em] text-text-subtle mb-2">NEW BALANCE</p>
          <p className="font-headline text-5xl font-bold text-text">
            {newBalance === 0 ? <span className="text-text-subtle">DEPLETED</span> : fmt(newBalance)}
          </p>
          <p className="font-label text-[10px] tracking-widest text-text-faint mt-3">{code}</p>
        </div>

        <button
          type="button"
          onClick={onNext}
          className="touch-manipulation w-full bg-red text-white font-headline font-bold uppercase tracking-tight py-5 text-xl hover:bg-red-hover transition-colors"
        >
          NEXT CARD →
        </button>
      </div>
    </div>
  );
}

// ── Main orchestrator ─────────────────────────────────────────────────────────
export default function RedeemPage() {
  const [screen,     setScreen]     = useState<Screen>('pin');
  const [card,       setCard]       = useState<CardData | null>(null);
  const [newBalance, setNewBalance] = useState(0);
  const [charged,    setCharged]    = useState(0);
  const [sessionId,  setSessionId]  = useState('');
  const [staffName,  setStaffName]  = useState('');

  if (screen === 'pin') {
    return <PinScreen onAuth={(name) => {
      const alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const rand8 = Array.from({ length: 8 }, () => alpha[Math.floor(Math.random() * alpha.length)]).join('');
      setSessionId(`POS-${rand8}`);
      setStaffName(name);
      setScreen('lookup');
    }} />;
  }

  if (screen === 'lookup') {
    return (
      <LookupScreen
        staffName={staffName}
        onFound={(c) => { setCard(c); setScreen('charge'); }}
      />
    );
  }

  if (screen === 'charge' && card) {
    return (
      <ChargeScreen
        card={card}
        staffName={staffName}
        sessionId={sessionId}
        onCharged={(nb, ch) => { setNewBalance(nb); setCharged(ch); setScreen('confirm'); }}
        onBack={() => setScreen('lookup')}
      />
    );
  }

  if (screen === 'confirm' && card) {
    return (
      <ConfirmScreen
        newBalance={newBalance}
        charged={charged}
        code={card.code}
        onNext={() => { setCard(null); setScreen('lookup'); }}
      />
    );
  }

  return null;
}
