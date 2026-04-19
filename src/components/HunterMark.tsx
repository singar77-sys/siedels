export function HunterMark({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 1.5 L14.5 13.5 L1.5 13.5 Z" />
      <circle cx="8" cy="9.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
