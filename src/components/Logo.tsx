import Image from 'next/image';

interface LogoProps {
  /** Intrinsic width in pixels. Height is auto (aspect 2.23:1). */
  width?: number;
  priority?: boolean;
  className?: string;
}

/**
 * Siedel's logo. Both color variants render into the DOM; CSS hides the
 * inactive one based on [data-theme]. Matches the hero image swap pattern
 * so there's no SSR/CSR mismatch.
 */
export function Logo({ width = 200, priority = false, className = '' }: LogoProps) {
  // Aspect 5000x2243 ≈ 2.23:1
  const height = Math.round(width / 2.23);
  // Pick best source size (400w under 200px, 800w under 400px, 1600w otherwise)
  const srcSize = width <= 200 ? 400 : width <= 400 ? 800 : 1600;

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={`/logos/siedels-logo-color-${srcSize}.webp`}
        alt="Siedel's Barbershop"
        width={srcSize}
        height={Math.round(srcSize / 2.23)}
        priority={priority}
        className="logo-light absolute inset-0 w-full h-full object-contain"
      />
      <Image
        src={`/logos/siedels-logo-white-${srcSize}.webp`}
        alt="Siedel's Barbershop"
        width={srcSize}
        height={Math.round(srcSize / 2.23)}
        priority={priority}
        className="logo-dark absolute inset-0 w-full h-full object-contain"
        aria-hidden="true"
      />
    </div>
  );
}
