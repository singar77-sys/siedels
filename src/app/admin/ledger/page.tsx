'use client';

import { useEffect, useState } from 'react';

interface Transaction {
  id:                  string;
  type:                'purchase' | 'redemption' | 'dormancy_fee';
  amount_cents:        number;
  balance_after_cents: number;
  created_at:          string;
  note:                string | null;
}

interface GiftCard {
  id:               string;
  code:             string;
  face_value_cents: number;
  balance_cents:    number;
  purchaser_email:  string;
  recipient_name:   string | null;
  sender_name:      string | null;
  status:           string;
  purchased_at:     string;
  last_activity_at: string;
  transactions:     Transaction[];
}

interface Summary {
  total_cards:         string;
  active_cards:        string;
  depleted_cards:      string;
  total_issued_cents:  string;
  outstanding_cents:   string;
  total_redeemed_cents: string;
}

function fmt(cents: number | string): string {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

function dateStr(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

const TYPE_LABEL: Record<string, string> = {
  purchase:     'Purchase',
  redemption:   'Redeemed',
  dormancy_fee: 'Dormancy fee',
};

export default function LedgerPage() {
  const [pin,      setPin]      = useState('');
  const [authed,   setAuthed]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [data,     setData]     = useState<{ summary: Summary; cards: GiftCard[] } | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const login = async () => {
    setLoading(true);
    setError('');
    const res = await fetch('/api/pin/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ pin }),
    });
    if (res.ok) {
      setAuthed(true);
      loadData();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? 'Incorrect PIN');
    }
    setLoading(false);
  };

  const loadData = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/ledger');
    if (res.ok) {
      setData(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authed) loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  if (!authed) {
    return (
      <div className="min-h-dvh bg-ink flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <p className="font-label text-[10px] tracking-[0.3em] text-red mb-3">ADMIN</p>
          <h1 className="font-headline text-4xl uppercase tracking-tight text-text mb-10">LEDGER</h1>
          <div className="mb-5">
            <label className="block font-label text-[10px] tracking-widest text-text-subtle mb-3">PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              placeholder="••••"
              autoFocus
              className="w-full bg-surface border border-line-strong px-5 py-4 font-headline text-2xl text-text text-center tracking-[0.4em] placeholder:text-text-faint focus:border-red focus:outline-none transition-colors"
            />
          </div>
          {error && <p className="font-body text-sm text-red mb-4 text-center">{error}</p>}
          <button
            type="button"
            onClick={login}
            disabled={loading || !pin}
            className="w-full bg-red text-white font-headline font-bold uppercase tracking-tight py-4 hover:bg-red-hover disabled:opacity-50 transition-colors"
          >
            {loading ? 'SIGNING IN…' : 'SIGN IN'}
          </button>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="min-h-dvh bg-ink flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-red/30 border-t-red rounded-full animate-spin" />
      </div>
    );
  }

  const { summary, cards } = data;

  return (
    <div className="min-h-dvh bg-ink text-text">
      {/* Header */}
      <header className="border-b border-line-strong px-6 md:px-10 py-6 flex items-center justify-between">
        <div>
          <p className="font-label text-[10px] tracking-[0.3em] text-red mb-1">SIEDEL&apos;S BARBERSHOP</p>
          <h1 className="font-headline text-2xl uppercase tracking-tight">GIFT CARD LEDGER</h1>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="font-label text-[10px] tracking-[0.25em] text-text-subtle hover:text-red transition-colors"
        >
          REFRESH
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'TOTAL ISSUED',     value: fmt(summary.total_issued_cents) },
            { label: 'OUTSTANDING',      value: fmt(summary.outstanding_cents), highlight: true },
            { label: 'ACTIVE CARDS',     value: summary.active_cards },
            { label: 'DEPLETED CARDS',   value: summary.depleted_cards },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className={`border p-4 md:p-5 ${highlight ? 'border-red bg-red/5' : 'border-line-strong bg-surface'}`}
            >
              <p className="font-label text-[9px] tracking-[0.3em] text-text-subtle mb-2">{label}</p>
              <p className={`font-headline text-2xl md:text-3xl font-bold ${highlight ? 'text-red' : 'text-text'}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Card table */}
        <div className="border border-line-strong">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-0 border-b border-line-strong px-4 py-3 bg-surface">
            <p className="font-label text-[9px] tracking-[0.25em] text-text-subtle">CODE</p>
            <p className="font-label text-[9px] tracking-[0.25em] text-text-subtle text-right pr-4">FACE VALUE</p>
            <p className="font-label text-[9px] tracking-[0.25em] text-text-subtle text-right pr-4">BALANCE</p>
            <p className="font-label text-[9px] tracking-[0.25em] text-text-subtle text-right pr-4">STATUS</p>
            <p className="font-label text-[9px] tracking-[0.25em] text-text-subtle text-right">PURCHASED</p>
          </div>

          {cards.length === 0 && (
            <p className="font-body text-sm text-text-subtle text-center py-12">No gift cards yet.</p>
          )}

          {cards.map((card) => (
            <div key={card.id} className="border-b border-line last:border-b-0">
              {/* Row */}
              <button
                type="button"
                onClick={() => toggle(card.id)}
                className="w-full grid grid-cols-[1fr_auto_auto_auto_auto] gap-0 px-4 py-4 hover:bg-surface transition-colors text-left"
              >
                <div>
                  <p className="font-headline text-sm tracking-[0.08em]">{card.code}</p>
                  {card.recipient_name && (
                    <p className="font-body text-xs text-text-subtle mt-0.5">For {card.recipient_name}</p>
                  )}
                </div>
                <p className="font-body text-sm text-text-muted text-right pr-4 self-center">
                  {fmt(card.face_value_cents)}
                </p>
                <p className={`font-headline text-sm text-right pr-4 self-center ${
                  card.balance_cents === 0 ? 'text-text-subtle' : 'text-text'
                }`}>
                  {fmt(card.balance_cents)}
                </p>
                <p className={`font-label text-[9px] tracking-[0.2em] text-right pr-4 self-center uppercase ${
                  card.status === 'active' ? 'text-green-400' : 'text-text-subtle'
                }`}>
                  {card.status}
                </p>
                <p className="font-body text-xs text-text-subtle text-right self-center">
                  {dateStr(card.purchased_at)}
                </p>
              </button>

              {/* Expanded transactions */}
              {expanded.has(card.id) && (
                <div className="bg-ink/50 border-t border-line px-6 py-4">
                  <p className="font-label text-[9px] tracking-[0.25em] text-text-subtle mb-3">
                    TRANSACTIONS · {card.purchaser_email}
                  </p>
                  <div className="space-y-2">
                    {card.transactions.map((t) => (
                      <div key={t.id} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full flex-none ${
                            t.type === 'purchase'     ? 'bg-green-400' :
                            t.type === 'redemption'   ? 'bg-red' :
                            'bg-yellow-500'
                          }`} />
                          <span className="font-body text-xs text-text-muted">{TYPE_LABEL[t.type]}</span>
                          {t.note && <span className="font-body text-xs text-text-faint">— {t.note}</span>}
                        </div>
                        <div className="flex items-center gap-6 flex-none">
                          <span className={`font-headline text-sm ${t.amount_cents < 0 ? 'text-red' : 'text-green-400'}`}>
                            {t.amount_cents > 0 ? '+' : ''}{fmt(t.amount_cents)}
                          </span>
                          <span className="font-body text-xs text-text-subtle w-20 text-right">
                            {fmt(t.balance_after_cents)} left
                          </span>
                          <span className="font-body text-xs text-text-faint w-24 text-right">
                            {dateStr(t.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
