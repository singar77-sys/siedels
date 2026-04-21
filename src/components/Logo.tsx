import Image from 'next/image';

interface LogoProps {
  /** Intrinsic width in pixels. Height is auto (aspect 2.23:1). */
  width?: number;
  priority?: boolean;
  className?: string;
}

/**
 * Siedel's logo. Three variants layered in the DOM; CSS picks one:
 *   .logo-light  — red+black (default light theme)
 *   .logo-dark   — white (dark theme)
 *   .logo-team   — masked monochrome, fills with --team-logo-color
 *                  (activated by [data-team-mode] or .italy-mode)
 */
export function Logo({ width = 200, priority = false, className = '' }: LogoProps) {
  // Aspect 5000x2243 ≈ 2.23:1
  const height = Math.round(width / 2.23);
  // Pick best source size (400w under 200px, 800w under 400px, 1600w otherwise)
  const srcSize = width <= 200 ? 400 : width <= 400 ? 800 : 1600;
  const maskUrl = `/logos/siedels-logo-white-${srcSize}.webp`;

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
      {/* Team / italy mode: solid color painted through the white logo as a mask */}
      <div
        className="logo-team absolute inset-0 w-full h-full"
        style={{
          WebkitMaskImage: `url(${maskUrl})`,
          maskImage: `url(${maskUrl})`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
