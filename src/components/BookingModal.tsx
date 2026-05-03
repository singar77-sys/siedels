'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { services, team, type Service, type TeamMember } from '@/data/shop';
import { Icon } from './Icon';

type Step = 1 | 2 | 3 | 4 | 5;

interface Slot {
  startAt:                 string; // ISO UTC
  teamMemberId:            string;
  teamMemberName:          string;
  serviceVariationVersion: number;
}

interface Confirmation {
  bookingId:      string;
  startAt:        string;
  teamMemberName: string;
  serviceName:    string;
}

const STEP_LABELS: Record<Step, string> = {
  1: 'SERVICE',
  2: 'BARBER',
  3: 'DATE',
  4: 'TIME',
  5: 'CONFIRM',
};

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function fmtDateLong(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// YYYY-MM-DD → "Wednesday, May 7"
function fmtDateOnly(yyyymmdd: string) {
  return new Date(`${yyyymmdd}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const INPUT = 'w-full bg-surface border border-line-strong px-3 py-2.5 font-body text-sm text-text placeholder:text-text-faint focus:border-red focus:outline-none transition-colors';

interface BookingModalProps {
  onClose:         () => void;
  initialService?: Service | null;
}

export function BookingModal({ onClose, initialService }: BookingModalProps) {
  const [step,        setStep]        = useState<Step>(initialService ? 2 : 1);
  const [service,     setService]     = useState<Service | null>(initialService ?? null);
  const [barber,      setBarber]      = useState<TeamMember | null>(null); // null = any
  const [date,        setDate]        = useState('');
  const [slots,       setSlots]       = useState<Slot[]>([]);
  const [loadSlots,   setLoadSlots]   = useState(false);
  const [slotsErr,    setSlotsErr]    = useState('');
  const [slot,        setSlot]        = useState<Slot | null>(null);
  const [name,        setName]        = useState('');
  const [phone,       setPhone]       = useState('');
  const [email,       setEmail]       = useState('');
  const [note,        setNote]        = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [submitErr,   setSubmitErr]   = useState('');
  const [confirmed,   setConfirmed]   = useState<Confirmation | null>(null);

  const now = new Date();
  const [calMo, setCalMo] = useState(now.getMonth());
  const [calYr, setCalYr] = useState(now.getFullYear());

  // Lock scroll; close on Escape
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc); };
  }, [onClose]);

  // Fetch availability when reaching step 4
  useEffect(() => {
    if (step !== 4 || !service || !date) return;
    setLoadSlots(true);
    setSlotsErr('');
    setSlots([]);
    setSlot(null);
    fetch('/api/booking/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceName: service.name, staffName: barber?.name ?? null, date }),
    })
      .then(r => r.json())
      .then(d => { if (d.error) setSlotsErr(d.error); else setSlots(d.slots ?? []); })
      .catch(() => setSlotsErr('Could not load times. Please try again.'))
      .finally(() => setLoadSlots(false));
  }, [step, service, date, barber]);

  async function submit() {
    if (!service || !slot || !name.trim() || !phone.trim()) return;
    setSubmitting(true);
    setSubmitErr('');
    try {
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName:             service.name,
          startAt:                 slot.startAt,
          teamMemberId:            slot.teamMemberId,
          serviceVariationVersion: slot.serviceVariationVersion,
          customerName:            name.trim(),
          customerPhone:           phone.trim(),
          customerEmail:           email.trim() || undefined,
          note:                    note.trim()  || undefined,
        }),
      });
      const d = await res.json();
      if (!res.ok || d.error) {
        setSubmitErr(d.error ?? 'Booking failed. Please try again or call us.');
      } else {
        setConfirmed({
          bookingId:      d.bookingId,
          startAt:        slot.startAt,
          teamMemberName: slot.teamMemberName,
          serviceName:    service.name,
        });
      }
    } catch {
      setSubmitErr('Network error. Please call us at (330) 952-0777.');
    } finally {
      setSubmitting(false);
    }
  }

  // Calendar helpers
  const todayStr = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  const maxDate = new Date(now);
  maxDate.setDate(now.getDate() + 60);

  const firstDOW   = new Date(calYr, calMo, 1).getDay();
  const daysInMo   = new Date(calYr, calMo + 1, 0).getDate();
  const moLabel    = new Date(calYr, calMo).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const atMinMonth = calYr === now.getFullYear() && calMo <= now.getMonth();

  function mkDate(day: number) {
    return `${calYr}-${String(calMo + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  function dayDisabled(day: number) {
    const d  = new Date(calYr, calMo, day);
    const ds = mkDate(day);
    return d.getDay() === 0 || ds < todayStr || d > maxDate;
  }

  // Deduplicate slots by startAt (first barber wins for "any" mode)
  const uniqueSlots = Object.values(
    slots.reduce<Record<string, Slot>>((acc, s) => { if (!acc[s.startAt]) acc[s.startAt] = s; return acc; }, {})
  ).sort((a, b) => a.startAt.localeCompare(b.startAt));

  function prevMonth() {
    if (atMinMonth) return;
    if (calMo === 0) { setCalMo(11); setCalYr(y => y - 1); } else setCalMo(m => m - 1);
  }
  function nextMonth() {
    if (calMo === 11) { setCalMo(0); setCalYr(y => y + 1); } else setCalMo(m => m + 1);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Book an appointment"
    >
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'var(--scrim)' }} />

      <div
        className="no-scrollbar relative bg-surface border border-line-strong w-full sm:max-w-2xl shadow-2xl max-h-[95dvh] sm:max-h-[88dvh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex-none border-b border-line-strong px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-label text-[9px] tracking-[0.35em] text-red mb-0.5">SIEDEL&apos;S BARBERSHOP</p>
            <h2 className="font-headline text-base font-bold uppercase tracking-tight text-text">
              {confirmed ? 'BOOKING CONFIRMED' : 'BOOK AN APPOINTMENT'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-line-strong text-text-muted hover:text-text hover:border-text-muted transition-colors flex-none"
            aria-label="Close booking"
          >
            <Icon name="close" className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Step track ── */}
        {!confirmed && (
          <div className="flex-none border-b border-line px-5 py-3 flex items-center relative">
            <div className="absolute inset-x-5 top-[calc(50%-7px)] h-px bg-line-strong" />
            <div
              className="absolute left-5 top-[calc(50%-7px)] h-px bg-red transition-all duration-500"
              style={{ width: `calc(${((step - 1) / 4) * 100}% - 0px)` }}
            />
            {([1, 2, 3, 4, 5] as Step[]).map(s => (
              <div key={s} className="flex-1 flex flex-col items-center gap-1 relative z-10">
                <div className={`w-2 h-2 rounded-full border-2 transition-all duration-300 ${
                  s <= step ? 'bg-red border-red' : 'bg-surface border-line-strong'
                }`} />
                <span className={`font-label text-[7px] tracking-[0.15em] ${s === step ? 'text-red' : 'text-text-faint'}`}>
                  {STEP_LABELS[s]}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto min-h-0">

          {/* Confirmation */}
          {confirmed && (
            <div className="p-8 flex flex-col items-center gap-5 text-center">
              <div className="w-14 h-14 rounded-full bg-red/10 flex items-center justify-center">
                <Icon name="check_circle" className="w-8 h-8 text-red" />
              </div>
              <div>
                <p className="font-headline text-xl font-bold uppercase tracking-tight text-text mb-1">
                  {confirmed.serviceName}
                </p>
                <p className="font-body text-sm text-text-muted">{fmtDateLong(confirmed.startAt)}</p>
                <p className="font-label text-[10px] tracking-widest text-text-subtle mt-1">
                  WITH {confirmed.teamMemberName.toUpperCase()}
                </p>
              </div>
              <div className="border border-line-strong bg-surface-raised px-4 py-3 w-full text-left">
                <p className="font-label text-[9px] tracking-widest text-text-subtle mb-1">BOOKING ID</p>
                <p className="font-body text-xs text-text-muted font-mono break-all">{confirmed.bookingId}</p>
              </div>
              <p className="font-body text-sm text-text-muted leading-relaxed max-w-xs">
                You&apos;ll receive a confirmation from Square. Cash only — ATM on site.
              </p>
              <button
                onClick={onClose}
                className="mt-1 px-8 py-3 bg-red text-white font-headline font-bold uppercase tracking-tight hover:bg-red-hover transition-colors"
              >
                DONE
              </button>
            </div>
          )}

          {/* Step 1 — Service */}
          {!confirmed && step === 1 && (
            <div className="p-4">
              <p className="font-label text-[10px] tracking-[0.3em] text-text-subtle mb-4">CHOOSE A SERVICE</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {services.map(svc => (
                  <button
                    key={svc.name}
                    onClick={() => { setService(svc); setStep(2); }}
                    className={`text-left flex items-start gap-3 px-4 py-3 border transition-colors group ${
                      service?.name === svc.name
                        ? 'border-red bg-surface-raised'
                        : 'border-line-strong hover:border-red/60 hover:bg-surface-raised/50'
                    }`}
                  >
                    <span className="font-headline text-xl font-bold text-red group-hover:text-red-hover transition-colors whitespace-nowrap w-12 shrink-0 mt-0.5 leading-none">
                      {svc.price}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-headline text-sm font-bold uppercase tracking-tight text-text group-hover:text-red transition-colors leading-snug">
                        {svc.name}
                      </span>
                      <span className="block font-body text-[11px] text-text-muted italic mt-0.5 leading-snug">
                        {svc.tagline}
                      </span>
                      <span className="block font-label text-[9px] tracking-widest text-text-subtle mt-1">
                        {svc.duration.toUpperCase()}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Barber */}
          {!confirmed && step === 2 && (
            <div className="p-4">
              <p className="font-label text-[10px] tracking-[0.3em] text-text-subtle mb-4">CHOOSE YOUR BARBER</p>
              {/* Any available */}
              <button
                onClick={() => { setBarber(null); setStep(3); }}
                className="w-full flex items-center gap-4 px-4 py-3 border border-line-strong hover:border-red/60 hover:bg-surface-raised/50 transition-colors mb-3 group"
              >
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-line-strong flex items-center justify-center flex-none group-hover:border-red/40 transition-colors">
                  <Icon name="shuffle" className="w-4 h-4 text-text-subtle" />
                </div>
                <div className="text-left">
                  <p className="font-headline text-sm font-bold uppercase tracking-tight text-text group-hover:text-red transition-colors">
                    ANY AVAILABLE
                  </p>
                  <p className="font-body text-[11px] text-text-muted italic">Show me all open slots</p>
                </div>
              </button>
              {/* Barber grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {team.map(m => (
                  <button
                    key={m.name}
                    onClick={() => { setBarber(m); setStep(3); }}
                    className={`flex flex-col items-center gap-2 p-3 border transition-colors group ${
                      barber?.name === m.name
                        ? 'border-red bg-surface-raised'
                        : 'border-line-strong hover:border-red/60 hover:bg-surface-raised/50'
                    }`}
                  >
                    <div className="relative w-14 h-14 flex-none overflow-hidden border border-line">
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="56px"
                        className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-headline text-[11px] font-bold uppercase tracking-tight text-text group-hover:text-red transition-colors leading-snug">
                        {m.name.split(' ')[0]}
                      </p>
                      <p className="font-label text-[8px] tracking-widest text-text-subtle">
                        {m.role.toUpperCase()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Date */}
          {!confirmed && step === 3 && (
            <div className="p-4">
              <p className="font-label text-[10px] tracking-[0.3em] text-text-subtle mb-4">CHOOSE A DATE</p>
              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  disabled={atMinMonth}
                  className="w-8 h-8 flex items-center justify-center border border-line-strong text-text-subtle hover:text-text hover:border-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="chevron_left" className="w-4 h-4" />
                </button>
                <p className="font-headline text-sm font-bold uppercase tracking-tight text-text">{moLabel}</p>
                <button
                  onClick={nextMonth}
                  className="w-8 h-8 flex items-center justify-center border border-line-strong text-text-subtle hover:text-text hover:border-text transition-colors"
                >
                  <Icon name="chevron_right" className="w-4 h-4" />
                </button>
              </div>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center font-label text-[8px] tracking-widest text-text-subtle py-1">{d}</div>
                ))}
              </div>
              {/* Day grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDOW }).map((_, i) => <div key={`pad-${i}`} />)}
                {Array.from({ length: daysInMo }, (_, i) => i + 1).map(day => {
                  const ds  = mkDate(day);
                  const off = dayDisabled(day);
                  return (
                    <button
                      key={day}
                      disabled={off}
                      onClick={() => { setDate(ds); setStep(4); }}
                      className={`aspect-square flex items-center justify-center font-body text-sm transition-colors rounded-none ${
                        off
                          ? 'text-text-faint cursor-not-allowed opacity-40'
                          : ds === date
                            ? 'bg-red text-white'
                            : 'text-text-muted hover:bg-surface-raised hover:text-text'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <p className="font-label text-[9px] tracking-widest text-text-faint text-center mt-4">
                CLOSED SUNDAYS · UP TO 60 DAYS OUT
              </p>
            </div>
          )}

          {/* Step 4 — Time */}
          {!confirmed && step === 4 && (
            <div className="p-4">
              <p className="font-label text-[10px] tracking-[0.3em] text-text-subtle mb-1">AVAILABLE TIMES</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-4">
                <p className="font-body text-xs text-text-muted">{date && fmtDateOnly(date)}</p>
                {barber && (
                  <span className="font-label text-[9px] tracking-widest text-text-subtle">
                    · {barber.name.toUpperCase()}
                  </span>
                )}
              </div>

              {loadSlots ? (
                <div className="flex items-center justify-center py-12">
                  <span className="w-6 h-6 border-2 border-line-strong border-t-red rounded-full animate-spin" />
                </div>
              ) : slotsErr ? (
                <div className="py-10 text-center">
                  <p className="font-body text-sm text-text-muted mb-4">{slotsErr}</p>
                  <button onClick={() => setStep(3)} className="font-label text-[10px] tracking-widest text-text-subtle hover:text-red transition-colors">
                    ← CHOOSE DIFFERENT DATE
                  </button>
                </div>
              ) : uniqueSlots.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="font-body text-sm text-text-muted mb-4">No openings on this date.</p>
                  <button onClick={() => setStep(3)} className="font-label text-[10px] tracking-widest text-text-subtle hover:text-red transition-colors">
                    ← CHOOSE DIFFERENT DATE
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {uniqueSlots.map(s => (
                    <button
                      key={s.startAt}
                      onClick={() => { setSlot(s); setStep(5); }}
                      className={`flex flex-col items-center gap-0.5 py-3 border transition-colors ${
                        slot?.startAt === s.startAt
                          ? 'border-red bg-surface-raised'
                          : 'border-line-strong hover:border-red/60 hover:bg-surface-raised/50'
                      }`}
                    >
                      <span className="font-headline text-sm font-bold text-text">{fmtTime(s.startAt)}</span>
                      {!barber && (
                        <span className="font-label text-[8px] tracking-wider text-text-subtle">
                          {s.teamMemberName.split(' ')[0].toUpperCase()}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5 — Confirm */}
          {!confirmed && step === 5 && (
            <div className="p-4">
              {/* Summary card */}
              <div className="border border-line bg-surface-raised px-4 py-3 mb-5">
                <p className="font-label text-[9px] tracking-[0.3em] text-red mb-2">YOUR APPOINTMENT</p>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-headline text-2xl font-bold text-red">{service?.price}</span>
                  <span className="font-headline text-sm font-bold uppercase tracking-tight text-text">{service?.name}</span>
                </div>
                {slot && (
                  <>
                    <p className="font-body text-xs text-text-muted">{fmtDateLong(slot.startAt)}</p>
                    <p className="font-label text-[9px] tracking-widest text-text-subtle mt-0.5">
                      WITH {slot.teamMemberName.toUpperCase()}
                    </p>
                  </>
                )}
              </div>

              {/* Contact form */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block font-label text-[9px] tracking-widest text-text-subtle mb-1">FULL NAME *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Smith"
                    autoFocus
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className="block font-label text-[9px] tracking-widest text-text-subtle mb-1">PHONE *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(330) 555-0100"
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className="block font-label text-[9px] tracking-widest text-text-subtle mb-1">EMAIL (OPTIONAL)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className="block font-label text-[9px] tracking-widest text-text-subtle mb-1">NOTE FOR YOUR BARBER (OPTIONAL)</label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="e.g. skin fade, keep the top long..."
                    rows={2}
                    className={`${INPUT} resize-none`}
                  />
                </div>
                {submitErr && <p className="font-body text-xs text-red">{submitErr}</p>}
                <p className="font-label text-[9px] tracking-widest text-text-faint">CASH ONLY · ATM ON SITE</p>
              </div>
            </div>
          )}

        </div>

        {/* ── Footer nav ── */}
        {!confirmed && (
          <div className="flex-none border-t border-line px-5 py-4 flex items-center justify-between">
            <button
              onClick={() => step > 1 ? setStep(s => (s - 1) as Step) : onClose()}
              className="px-4 py-2 border border-line-strong font-label text-[10px] tracking-widest text-text-subtle hover:border-text hover:text-text transition-colors"
            >
              {step === 1 ? 'CANCEL' : '← BACK'}
            </button>
            <span className="font-label text-[8px] tracking-widest text-text-faint">{step} / 5</span>
            {step === 5 ? (
              <button
                onClick={submit}
                disabled={submitting || !name.trim() || !phone.trim()}
                className="px-6 py-2.5 bg-red text-white font-headline font-bold text-sm uppercase tracking-tight hover:bg-red-hover disabled:opacity-50 transition-colors"
              >
                {submitting ? 'BOOKING...' : 'CONFIRM →'}
              </button>
            ) : (
              <div className="w-24" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
