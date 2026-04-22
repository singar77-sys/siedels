'use client';

import { usePride } from './PrideProvider';

export function PrideToggle() {
  const { pride, toggle } = usePride();

  return (
    <button
      onClick={toggle}
      aria-label={pride ? 'Disable pride mode' : 'Enable pride mode'}
      title={pride ? 'Pride mode on · click to disable' : 'Pride mode'}
      className={`p-3 text-lg leading-none select-none transition-all duration-300 ${
        pride ? 'opacity-100' : 'opacity-35 hover:opacity-70'
      }`}
    >
      <span aria-hidden="true">🏳️‍🌈</span>
    </button>
  );
}
