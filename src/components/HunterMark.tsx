export function HunterMark({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      <polygon
        points="14,2 27,26 1,26"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeOpacity="0.75"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <ellipse
        cx="14"
        cy="18"
        rx="4.5"
        ry="3.2"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="0.7"
      />
      <path
        d="M 9.5 18 Q 14 13.5 18.5 18"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="0.4"
      />
      <path
        d="M 9.5 18 Q 14 22.5 18.5 18"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="0.4"
      />
      {/* Pupil — always lit red, regardless of site palette */}
      <circle cx="14" cy="18" r="1.8" fill="#FF4000" fillOpacity="0.95" />
      <circle cx="14" cy="2" r="0.8" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}
