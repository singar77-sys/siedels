'use client';

import { useState, useEffect, useRef } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  className?: string;
}

export function CountUp({ end, duration = 1400, decimals = 0, className }: CountUpProps) {
  const [value, setValue] = useState(0);
  const fired = useRef(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fired.current) return;
        fired.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(parseFloat((eased * end).toFixed(decimals)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, decimals]);

  return <span ref={spanRef} className={className}>{value.toFixed(decimals)}</span>;
}
