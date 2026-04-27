'use client';

import { useState, useEffect } from 'react';
import { hours } from '@/data/shop';

interface ShopStatusProps {
  shopHours: string | null;
  isClosed: boolean;
  scheduleKnown: boolean;
  dayName: string;
}

function getMedinaTime(): { hour: number; minute: number; dayName: string } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    weekday: 'long',
    hour12: false,
  }).formatToParts(new Date()).reduce<Record<string, string>>((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  return {
    hour: parseInt(parts.hour) % 24,
    minute: parseInt(parts.minute),
    dayName: parts.weekday,
  };
}

function parseHour24(part: string): number | null {
  const s = part.replace(/\s+/g, '').toLowerCase();
  const m = s.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)?$/);
  if (!m) return null;
  let h = parseInt(m[1]);
  if (m[3] === 'pm' && h !== 12) h += 12;
  if (m[3] === 'am' && h === 12) h = 0;
  return h;
}

function parseRange(raw: string): { open: number; close: number } | null {
  const s = raw.toLowerCase().replace(/\s+/g, '').replace(/[–—]/g, '-');
  const [a, b] = s.split('-');
  const open = parseHour24(a);
  const close = parseHour24(b);
  if (open === null || close === null) return null;
  return { open, close };
}

function fmt12(h: number): string {
  const h12 = h % 12 || 12;
  return `${h12} ${h >= 12 ? 'PM' : 'AM'}`;
}

function nextOpening(fromDay: string): string {
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const idx = week.indexOf(fromDay);
  for (let i = 1; i <= 7; i++) {
    const next = week[(idx + i) % 7];
    const entry = hours.find((h) => h.day === next);
    if (entry && entry.time !== 'Closed') {
      const openStr = entry.time.split('–')[0].trim();
      return `OPENS ${next.slice(0, 3).toUpperCase()} ${openStr}`;
    }
  }
  return '';
}

export function ShopStatus({ shopHours, isClosed, scheduleKnown, dayName }: ShopStatusProps) {
  const [open, setOpen] = useState<boolean | null>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    function compute() {
      const { hour, minute, dayName: liveDay } = getMedinaTime();
      const day = dayName || liveDay;

      const rawHours =
        scheduleKnown && shopHours
          ? shopHours
          : hours.find((h) => h.day === day)?.time ?? null;

      if (!rawHours || rawHours === 'Closed' || isClosed) {
        setOpen(false);
        setLabel(`CLOSED · ${nextOpening(day)}`);
        return;
      }

      const range = parseRange(rawHours);
      if (!range) { setOpen(null); return; }

      const now = hour * 60 + minute;
      if (now >= range.open * 60 && now < range.close * 60) {
        setOpen(true);
        setLabel(`OPEN · CLOSES ${fmt12(range.close)}`);
      } else {
        setOpen(false);
        setLabel(`CLOSED · ${nextOpening(day)}`);
      }
    }

    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, [shopHours, isClosed, scheduleKnown, dayName]);

  if (open === null) return null;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full flex-none ${
          open ? 'bg-green-500 animate-pulse' : 'bg-red'
        }`}
      />
      <span
        className="font-label text-[11px] tracking-[0.2em]"
        style={{ color: 'var(--hero-eyebrow)' }}
      >
        {label}
      </span>
    </div>
  );
}
