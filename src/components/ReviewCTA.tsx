'use client';

import { useState } from 'react';
import { Icon } from './Icon';

interface ReviewCTAProps {
  reviewUrl: string;
  suggestedText: string;
}

/**
 * Primary CTA on the /thanks/[slug] page. Copies the suggested review
 * text (with barber's name pre-mentioned) to clipboard, then opens
 * the Google review URL in a new tab. User can paste immediately.
 */
export function ReviewCTA({ reviewUrl, suggestedText }: ReviewCTAProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(suggestedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard denied — fall through to opening review URL anyway
    }
    window.open(reviewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="block w-full bg-red text-white font-headline font-bold uppercase tracking-tight text-center px-6 py-4 mb-3 hover:bg-red-hover transition-colors"
      >
        {copied ? (
          <>COPIED — NOW PASTE IN GOOGLE</>
        ) : (
          <>
            LEAVE A GOOGLE REVIEW
            <Icon name="arrow_forward" className="w-4 h-4 inline-block align-middle ml-2" />
          </>
        )}
      </button>
      <p className="font-body text-[11px] text-text-subtle text-center mb-8">
        Copies a review starter to your clipboard. Just paste.
      </p>
    </>
  );
}
