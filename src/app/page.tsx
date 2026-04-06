"use client";
import { useState, useEffect, useRef } from 'react';
import { getSportsModeForDate, SportsTheme } from './sports-mode';

const SQUARE_BASE = 'https://app.squareup.com/appointments/buyer/widget';
const LOCATION = 'LFCOT5CC7MY0S';
const sq = (id: string) => `${SQUARE_BASE}/${id}/${LOCATION}`;

const team = [
  { name: 'Jim LaMarca', title: 'Master Barber', image: '/images/jim-lamarca.webp', booking: sq('wx9txuouu9ti8w') },
  { name: 'Pierre Wright', title: 'Master Barber', image: '/images/pierre-wright.webp', booking: sq('mbwa7epvxqp3ya') },
  { name: 'Matt Hayes', title: 'Master Barber', image: '/images/matt-hayes.webp', booking: sq('ub0ju8v1q1926j') },
  { name: 'Ticia Husak', title: 'Master Stylist', image: '/images/ticia-husak.webp', booking: sq('xa1g2bceso9izn') },
  { name: 'Krista Foecking', title: 'Stylist', image: '/images/krista-foecking.webp', booking: sq('h3ib29fkvqykvx') },
  { name: 'Patrick Muranko', title: 'Barber', image: '/images/patrick-muranko.webp', booking: sq('x9bbe05slxw75e') },
  { name: 'Will Dillon', title: 'Barber', image: '/images/will-dillon.webp', booking: sq('licxdz52l4jryx') },
  { name: 'Shannon Hadick', title: 'Master Barber', image: '', booking: sq('0lh9o00vt6or3u') },
  { name: 'Chris Hodge', title: 'Barber', image: '/images/chris-hodge.webp', booking: sq('taz4mvu6g9k73n') },
  { name: 'Billy Rodriguez', title: 'Barber', image: '/images/billy-rodriguez.webp', booking: sq('e957m1qmqqdevp') },
  { name: 'Sam Sickle', title: 'Barber', image: '', booking: sq('qj4tfubyvaebvj') },
];

const services = [
  { name: 'Haircut', price: '$32' },
  { name: 'Razor / Foil Fade', price: '$38' },
  { name: 'Haircut + Beard Trim', price: '$42' },
  { name: 'Full Service Shave', price: '$44' },
  { name: 'Head Shave', price: '$40' },
  { name: 'Beard Trim', price: '$29' },
  { name: 'Shoulder Length Cut + Rough Dry', price: '$38' },
  { name: 'Duo Haircut', price: '$64' },
  { name: 'Trio Haircut', price: '$96' },
  { name: 'Eyebrow / Lip / Chin', price: '$23' },
  { name: 'Shampoo', price: '$5' },
  { name: 'Shampoo + Style', price: '$25+' },
];

const hours = [
  { day: 'Monday', time: '8 AM – 8 PM' },
  { day: 'Tuesday', time: '8 AM – 6 PM' },
  { day: 'Wednesday', time: '8 AM – 6 PM' },
  { day: 'Thursday', time: '8 AM – 8 PM' },
  { day: 'Friday', time: '8 AM – 6 PM' },
  { day: 'Saturday', time: '8 AM – 3 PM' },
  { day: 'Sunday', time: 'Closed' },
];


/* ── Cleveland Sports Mode ───────────────────────── */
function useSportsMode(): SportsTheme | null {
  const [theme, setTheme] = useState<SportsTheme | null>(null);
  useEffect(() => {
    setTheme(getSportsModeForDate(new Date()));
  }, []);
  return theme;
}

function GameDayBanner({ theme, onDismiss }: { theme: SportsTheme; onDismiss: () => void }) {
  return (
    <div
      className="w-full py-2.5 px-4 flex items-center justify-center gap-3 text-sm font-body relative"
      style={{ background: theme.bannerBg, color: '#D9D0C1' }}
    >
      <span className="material-symbols-outlined text-base" style={{ color: theme.bannerAccent }}>{theme.icon}</span>
      <span className="font-semibold" style={{ color: theme.bannerAccent }}>Go {theme.shortName}!</span>
      <span className="text-white/80">{theme.tagline}</span>
      <span className="font-label text-xs tracking-widest opacity-60 hidden sm:inline">{theme.hashtag}</span>
      <button
        onClick={onDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

/* ── Shop open/closed status ─────────────────────── */
function useShopStatus() {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    const closingHours: Record<number, number | null> = {
      1: 20, 2: 18, 3: 18, 4: 20, 5: 18, 6: 15, 0: null,
    };
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours() + now.getMinutes() / 60;
    const closes = closingHours[day];
    if (closes === null || hour < 8 || hour >= closes) {
      setStatus({ open: false, label: 'Closed today' });
    } else {
      const closeStr = closes === 20 ? '8 PM' : closes === 18 ? '6 PM' : '3 PM';
      setStatus({ open: true, label: `Open · Until ${closeStr}` });
    }
  }, []);
  return status;
}

/* ── Fade-in on scroll hook ──────────────────────── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Animated Jim SVG ─────────────────────────────── */
function AnimatedJim({ className = '' }: { className?: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [eyePupilPositions, setEyePupilPositions] = useState({ left: { x: 145, y: 177 }, right: { x: 255, y: 177 } });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const scaleX = rect.width / 400;
    const scaleY = rect.height / 650;
    const leftEyeX = rect.left + 145 * scaleX;
    const leftEyeY = rect.top + 177 * scaleY;
    const rightEyeX = rect.left + 255 * scaleX;
    const rightEyeY = rect.top + 177 * scaleY;
    const calculatePupilOffset = (eyeCenterX: number, eyeCenterY: number, mouseX: number, mouseY: number) => {
      const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
      const maxDistance = 6;
      return { x: Math.cos(angle) * maxDistance, y: Math.sin(angle) * maxDistance };
    };
    const leftOffset = calculatePupilOffset(leftEyeX, leftEyeY, mousePosition.x, mousePosition.y);
    const rightOffset = calculatePupilOffset(rightEyeX, rightEyeY, mousePosition.x, mousePosition.y);
    setEyePupilPositions({
      left: { x: 145 + leftOffset.x, y: 177 + leftOffset.y },
      right: { x: 255 + rightOffset.x, y: 177 + rightOffset.y },
    });
  }, [mousePosition]);

  const jimStyles = `
    @keyframes breathe { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-3px); } }
    @keyframes buzz { 0%, 100% { transform: translateX(0px) translateY(0px); } 25% { transform: translateX(-1px) translateY(-1px); } 50% { transform: translateX(1px) translateY(1px); } 75% { transform: translateX(-1px) translateY(1px); } }
    .jim-container { display: inline-block; position: relative; }
    .jim-svg { display: block; width: 100%; height: auto; max-width: 450px; filter: drop-shadow(0 4px 20px rgba(0,0,0,0.1)); transition: filter 0.3s ease; }
    .jim-svg.hovered { filter: drop-shadow(0 0 20px rgba(232,85,15,0.25)) drop-shadow(0 4px 20px rgba(0,0,0,0.15)); }
    .jim-torso { animation: breathe 3s ease-in-out infinite; transform-origin: center 300px; }
    .jim-clippers { animation: ${isHovered ? 'buzz 0.15s ease-in-out infinite' : 'none'}; transform-origin: 360px 280px; }
  `;

  return (
    <>
      <style>{jimStyles}</style>
      <div className={`jim-container ${className}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <svg ref={svgRef} viewBox="0 0 400 650" width="400" height="650" className={`jim-svg ${isHovered ? 'hovered' : ''}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#D4A574', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#C99560', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#302B25', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#1A1410', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
          <rect x="160" y="280" width="80" height="40" fill="url(#skinTone)" filter="url(#shadow)" />
          <g className="jim-torso">
            <path d="M 120 320 Q 100 350 100 420 L 100 620 Q 100 640 120 640 L 280 640 Q 300 640 300 620 L 300 420 Q 300 350 280 320 Z" fill="url(#shirtGradient)" filter="url(#shadow)" />
            <path d="M 160 320 L 140 350 M 240 320 L 260 350" stroke="#1A1410" strokeWidth="2" fill="none" />
            <text x="200" y="380" fontSize="14" fontWeight="bold" textAnchor="middle" fill="var(--accent)" fontFamily="Arial, sans-serif">{"SIEDEL'S"}</text>
            <text x="200" y="400" fontSize="12" textAnchor="middle" fill="var(--accent)" fontFamily="Arial, sans-serif">BARBERSHOP</text>
            <g>
              <ellipse cx="110" cy="360" rx="35" ry="70" fill="url(#skinTone)" filter="url(#shadow)" />
              <path d="M 90 380 Q 85 390 90 400 M 100 375 Q 95 390 105 405 M 110 380 Q 105 395 115 410" stroke="#6E6458" strokeWidth="1.5" fill="none" opacity="0.6" />
            </g>
            <g>
              <ellipse cx="290" cy="360" rx="35" ry="70" fill="url(#skinTone)" filter="url(#shadow)" />
              <path d="M 310 380 Q 315 390 310 400 M 300 375 Q 305 390 295 405 M 290 380 Q 295 395 285 410" stroke="#6E6458" strokeWidth="1.5" fill="none" opacity="0.6" />
            </g>
          </g>
          <g>
            <circle cx="200" cy="180" r="95" fill="url(#skinTone)" filter="url(#shadow)" />
            <path d="M 110 140 Q 105 100 200 80 Q 295 100 290 140 Q 285 110 200 95 Q 115 110 110 140 Z" fill="#302B25" filter="url(#shadow)" />
            <path d="M 130 105 Q 140 95 160 93 M 200 85 Q 220 86 240 95 M 260 110 Q 275 115 280 130" stroke="#888888" strokeWidth="3" fill="none" opacity="0.5" />
            <path d="M 140 220 Q 130 240 135 260 Q 140 275 165 285 Q 200 290 235 285 Q 260 275 265 260 Q 270 240 260 220" fill="#888888" filter="url(#shadow)" />
            <path d="M 145 240 Q 140 255 145 270 Q 160 280 200 283 Q 240 280 255 270 Q 260 255 255 240" fill="#666666" opacity="0.4" />
            <ellipse cx="165" cy="265" rx="15" ry="8" fill="#AAAAAA" opacity="0.3" />
            <ellipse cx="235" cy="265" rx="15" ry="8" fill="#AAAAAA" opacity="0.3" />
            <rect x="120" y="160" width="50" height="35" fill="none" stroke="#6E6458" strokeWidth="3" rx="3" />
            <rect x="230" y="160" width="50" height="35" fill="none" stroke="#6E6458" strokeWidth="3" rx="3" />
            <line x1="170" y1="175" x2="230" y2="175" stroke="#6E6458" strokeWidth="2.5" />
            <rect x="120" y="160" width="50" height="35" fill="#D9D0C1" opacity="0.15" rx="3" />
            <rect x="230" y="160" width="50" height="35" fill="#D9D0C1" opacity="0.15" rx="3" />
            <circle cx="145" cy="177" r="10" fill="white" />
            <circle cx="255" cy="177" r="10" fill="white" />
            <circle cx={eyePupilPositions.left.x} cy={eyePupilPositions.left.y} r="5" fill="#302B25" />
            <circle cx={eyePupilPositions.left.x + 1.5} cy={eyePupilPositions.left.y - 1.5} r="2" fill="white" />
            <circle cx={eyePupilPositions.right.x} cy={eyePupilPositions.right.y} r="5" fill="#302B25" />
            <circle cx={eyePupilPositions.right.x + 1.5} cy={eyePupilPositions.right.y - 1.5} r="2" fill="white" />
            <path d="M 200 185 L 195 215 L 200 218 L 205 215 Z" fill="#C99560" opacity="0.7" />
            <path d="M 170 240 Q 200 255 230 240" stroke="#C99560" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 125 145 Q 145 138 165 142" stroke="#302B25" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 235 142 Q 255 138 275 145" stroke="#302B25" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
          <g className="jim-clippers" style={{ transformOrigin: '360px 280px' }}>
            <rect x="320" y="240" width="30" height="80" fill="#6E6458" rx="8" filter="url(#shadow)" />
            <line x1="325" y1="255" x2="345" y2="255" stroke="#302B25" strokeWidth="1" opacity="0.5" />
            <line x1="325" y1="275" x2="345" y2="275" stroke="#302B25" strokeWidth="1" opacity="0.5" />
            <line x1="325" y1="295" x2="345" y2="295" stroke="#302B25" strokeWidth="1" opacity="0.5" />
            <rect x="315" y="230" width="40" height="18" fill="var(--accent)" rx="4" filter="url(#shadow)" />
            <rect x="318" y="226" width="4" height="8" fill="#888888" />
            <rect x="325" y="226" width="4" height="8" fill="#888888" />
            <rect x="332" y="226" width="4" height="8" fill="#888888" />
            <rect x="339" y="226" width="4" height="8" fill="#888888" />
            <rect x="346" y="226" width="4" height="8" fill="#888888" />
            <ellipse cx="335" cy="235" rx="18" ry="8" fill="#6E6458" filter="url(#shadow)" />
            <rect x="318" y="237" width="34" height="2" fill="var(--accent)" opacity="0.7" />
            <path d="M 350 310 Q 360 330 350 350" stroke="#302B25" strokeWidth="2" fill="none" opacity="0.5" />
          </g>
        </svg>
      </div>
    </>
  );
}

/* ── Sacred Barber Pole ──────────────────────────── */
function SacredBarberPole({ className = '' }: { className?: string }) {
  const CX = 200, AMP = 34, Y_TOP = 90, Y_BOT = 410, TURNS = 4;

  const helix = (phase: number): string =>
    Array.from({ length: 160 }, (_, i) => {
      const t = i / 159;
      const y = Y_TOP + t * (Y_BOT - Y_TOP);
      const x = CX + AMP * Math.sin(2 * Math.PI * TURNS * t + phase);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join('');

  const fR = 78;
  const sixAngles = [0, 1, 2, 3, 4, 5].map(i => i * Math.PI / 3);

  const flowerCenters: [number, number][] = [
    [200, 250],
    ...sixAngles.map(a => [200 + fR * Math.cos(a), 250 + fR * Math.sin(a)] as [number, number]),
  ];
  const outerCenters: [number, number][] = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5].map(i => {
    const a = i * Math.PI / 3;
    return [200 + fR * Math.sqrt(3) * Math.cos(a), 250 + fR * Math.sqrt(3) * Math.sin(a)] as [number, number];
  });
  const perimNodes: [number, number][] = sixAngles.map(
    a => [200 + 150 * Math.cos(a), 250 + 150 * Math.sin(a)] as [number, number]
  );

  const pathA  = helix(Math.PI / 2);
  const pathB  = helix(-Math.PI / 2);
  const pathA2 = helix(Math.PI / 2 + 0.28);
  const pathB2 = helix(-Math.PI / 2 - 0.28);

  return (
    <svg viewBox="0 0 400 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes sbpUp   { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }
        @keyframes sbpDown { from { stroke-dashoffset: 0;  } to { stroke-dashoffset: 40; } }
        @keyframes sbpBeat { 0%,100% { opacity:1; } 50% { opacity:0.45; } }
        .sbp-a  { stroke-dasharray:22 18; animation:sbpUp   5s linear infinite; }
        .sbp-b  { stroke-dasharray:22 18; animation:sbpDown 5s linear infinite; }
        .sbp-a2 { stroke-dasharray:8 32;  animation:sbpUp   5s linear infinite; }
        .sbp-b2 { stroke-dasharray:8 32;  animation:sbpDown 5s linear infinite; }
        .sbp-ct { animation:sbpBeat 3s ease-in-out infinite; }
      `}</style>

      {/* Outer bounding circle */}
      <circle cx="200" cy="250" r="183" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" />

      {/* Orbital rings */}
      <circle cx="200" cy="250" r="148" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 5" opacity="0.3" />
      <circle cx="200" cy="250" r="100" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 5" opacity="0.22" />

      {/* Flower of Life */}
      <g fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 5" opacity="0.18">
        {flowerCenters.map(([x, y], i) => <circle key={`f${i}`} cx={x} cy={y} r={fR} />)}
        {outerCenters.map(([x, y], i)  => <circle key={`o${i}`} cx={x} cy={y} r={fR} />)}
      </g>

      {/* Construction lines */}
      <g stroke="currentColor" strokeWidth="0.35" strokeDasharray="2 5" opacity="0.16" fill="none">
        <line x1="17"  y1="250" x2="383" y2="250" />
        <line x1="200" y1="17"  x2="200" y2="483" />
        <line x1="17"  y1="90"  x2="383" y2="90"  />
        <line x1="17"  y1="410" x2="383" y2="410" />
        <line x1="17"  y1="170" x2="383" y2="170" />
        <line x1="17"  y1="330" x2="383" y2="330" />
        <line x1="44"  y1="67"  x2="356" y2="433" />
        <line x1="356" y1="67"  x2="44"  y2="433" />
        {[30, 150, 210, 330].map((deg, i) => {
          const a = deg * Math.PI / 180;
          return <line key={i} x1="200" y1="250" x2={200 + 190 * Math.cos(a)} y2={250 + 190 * Math.sin(a)} />;
        })}
      </g>

      {/* Vesica piscis */}
      <g fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.38">
        <ellipse cx="200" cy="250" rx="30" ry="55" />
        <path d={`M 200 ${250 - 55} A 55 55 0 0 1 200 ${250 + 55} A 55 55 0 0 1 200 ${250 - 55} Z`} />
      </g>

      {/* Central axis */}
      <line x1="200" y1="46" x2="200" y2="454" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />

      {/* Pole cap arcs */}
      <g stroke="currentColor" strokeWidth="0.7" opacity="0.38" fill="none">
        <line x1="165" y1="90"  x2="235" y2="90"  />
        <path d="M 165 90 Q 200 78 235 90" />
        <path d="M 165 90 Q 200 102 235 90" />
        <line x1="165" y1="410" x2="235" y2="410" />
        <path d="M 165 410 Q 200 422 235 410" />
        <path d="M 165 410 Q 200 398 235 410" />
      </g>

      {/* Animated helix */}
      <g fill="none">
        <path d={pathA}  stroke="currentColor" strokeWidth="1.8" opacity="0.85" className="sbp-a"  />
        <path d={pathB}  stroke="currentColor" strokeWidth="1.8" opacity="0.85" className="sbp-b"  />
        <path d={pathA2} stroke="currentColor" strokeWidth="0.6" opacity="0.3"  className="sbp-a2" />
        <path d={pathB2} stroke="currentColor" strokeWidth="0.6" opacity="0.3"  className="sbp-b2" />
      </g>

      {/* Triangles */}
      <g fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.55">
        <polygon points="200,46 181,82 219,82" />
        <polygon points="200,454 181,418 219,418" />
      </g>

      {/* Perimeter nodes */}
      {perimNodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" fill="currentColor" opacity="0.55" />)}
      {([
        [200, 90], [200, 410], [200, 170], [200, 330],
      ] as [number, number][]).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="currentColor" opacity="0.45" />
      ))}
      <circle cx="200" cy="46"  r="2.5" fill="currentColor" opacity="0.8" />
      <circle cx="200" cy="454" r="2.5" fill="currentColor" opacity="0.8" />
      <circle cx="200" cy="250" r="3.5" fill="currentColor" className="sbp-ct" />
    </svg>
  );
}

/* ── Main Page ──────────────────────────────────── */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const shopStatus = useShopStatus();
  const sportsMode = useSportsMode();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pick the right color variant: sports theme overrides plain dark/light mode
  const activeVariant = sportsMode ? (darkMode ? sportsMode.dark : sportsMode.light) : null;
  const rootBg      = activeVariant?.bg      ?? (darkMode ? '#0A0A0A' : '#D9D0C1');
  const rootText    = activeVariant?.text     ?? (darkMode ? '#FFFFFF'  : '#302B25');
  // Dark mode: cream accent on black. Light mode: stone-dark accent on linen.
  const rootAccent  = activeVariant?.accent   ?? (darkMode ? '#D9D0C1' : '#6E6458');
  const rootAccentH = activeVariant?.accentHover ?? (darkMode ? '#FFFFFF'  : '#302B25');

  return (
    <div
      className="min-h-screen transition-colors duration-700"
      style={{
        backgroundColor: rootBg,
        color: rootText,
        '--accent': rootAccent,
        '--accent-hover': rootAccentH,
      } as React.CSSProperties}
    >
      {/* ── Cleveland Sports Mode Banner ──── */}
      {sportsMode && !bannerDismissed && (
        <GameDayBanner theme={sportsMode} onDismiss={() => setBannerDismissed(true)} />
      )}

      {/* ── Navigation ──────────────────────────── */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? darkMode
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.08)]'
            : 'bg-[#D9D0C1]/95 backdrop-blur-md shadow-[0_1px_0_rgba(172,166,144,0.3)]'
          : 'bg-transparent'
      }`}
      style={{ top: sportsMode && !bannerDismissed ? '40px' : '0' }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-3 items-center px-6 py-4">
          {/* Left — nav links */}
          <div className="hidden md:flex items-center gap-8">
            {['Team', 'Services', 'The Shop', 'Visit'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s/g, '-')}`}
                className={`font-body text-sm font-medium transition-colors duration-300 hover:text-[var(--accent)] ${darkMode ? 'text-[#ACA690]' : 'text-[#6E6458]'}`}
              >
                {label}
              </a>
            ))}
          </div>
          {/* Mobile — left spacer */}
          <div className="md:hidden" />
          {/* Center — wordmark */}
          <div className="flex justify-center">
            <a href="#home" className="flex flex-col items-center leading-none group">
              <span className="font-brand text-4xl md:text-5xl uppercase" style={{ lineHeight: 1, letterSpacing: '-0.02em', color: rootText }}>Siedel&apos;s</span>
              <span className="font-brand text-xl md:text-2xl uppercase" style={{ fontWeight: 900, lineHeight: 1, letterSpacing: '-0.01em', color: rootText }}>Barbershop</span>
              <span className="block h-[2px] w-full mt-1.5 mb-1" style={{ background: 'var(--accent)' }} />
              <span className="font-mono text-[9px] text-[#ACA690] tracking-[0.25em] uppercase">Stay Sharp</span>
            </a>
          </div>
          {/* Right — status + dark mode + call + mobile menu */}
          <div className="flex items-center justify-end gap-3">
            {shopStatus && (
              <span className={`hidden md:inline-flex items-center font-label text-xs tracking-[0.12em] uppercase ${shopStatus.open ? 'text-[#6B7C5E]' : 'text-[#ACA690]'}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${shopStatus.open ? 'bg-[#6B7C5E]' : 'bg-[#ACA690]'}`} />
                {shopStatus.label}
              </span>
            )}
            <button
              onClick={() => setDarkMode((d) => !d)}
              className={`hidden md:inline-flex items-center justify-center w-9 h-9 rounded-md text-[#ACA690] transition-colors duration-300 ${darkMode ? 'hover:text-[#D9D0C1]' : 'hover:text-[#302B25]'}`}
              aria-label="Toggle dark mode"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              <span className="material-symbols-outlined text-xl">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <a
              href="tel:3309520777"
              className="hidden md:inline-flex items-center gap-2 bg-[#302B25] text-[#D9D0C1] font-body font-medium text-sm px-5 py-2.5 rounded-md hover:bg-[var(--accent)] transition-colors duration-300"
            >
              <span className="material-symbols-outlined text-base">call</span>
              (330) 952-0777
            </a>
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden p-1" style={{ color: rootText }}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-3xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#D9D0C1] border-t border-[#ACA690]">
            {['Team', 'Services', 'The Shop', 'Visit'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s/g, '-')}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-4 text-[#302B25] font-body border-b border-[#C5BBA8] hover:bg-[#C5BBA8] transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href="tel:3309520777"
              className="block px-6 py-4 font-body font-semibold text-[var(--accent)] border-b border-[#C5BBA8]"
            >
              Call (330) 952-0777
            </a>
            <a
              href="https://app.squareup.com/appointments/buyer/widget/xcru7izyf4zhv6/LFCOT5CC7MY0S"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-6 py-4 font-body font-semibold text-[#302B25]"
            >
              Book Online
            </a>
          </div>
        )}
      </nav>

      <main>
        {/* ── Hero ──────────────────────────────── */}
        <section id="home" className="relative min-h-screen flex items-center texture-grain overflow-hidden">

          {/* Background image + darkening overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/hero.webp"
              alt=""
              className="w-full h-full object-cover object-center"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[#D9D0C1]/75" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-0 md:pb-0">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
              {/* Left: Copy */}
              <div className="flex-1 max-w-3xl">
                <FadeIn>
                  <p className="font-label uppercase text-sm font-semibold text-[#ACA690] tracking-[0.15em] mb-4">
                    Walk-ins Welcome · Medina, Ohio
                  </p>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-bold leading-[0.92] tracking-tight mb-8">
                    Your<br />
                    neighborhood<br />
                    <span className="text-[var(--accent)]">barbershop.</span>
                  </h1>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <p className="font-body text-lg md:text-xl text-[#6E6458] max-w-xl leading-relaxed mb-4">
                    Cleveland sports on the TV. Good conversation in the chair.
                  </p>
                  <p className="font-label text-sm text-[#ACA690] tracking-[0.1em] mb-10">
                    982 N Court Street. We&apos;ve been here.
                  </p>
                </FadeIn>
                <FadeIn delay={0.3}>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                    <a
                      href="tel:3309520777"
                      className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-white font-body font-semibold px-8 py-4 rounded-md hover:bg-[var(--accent-hover)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="material-symbols-outlined text-xl">call</span>
                      Call (330) 952-0777
                    </a>
                    <a
                      href="https://app.squareup.com/appointments/buyer/widget/xcru7izyf4zhv6/LFCOT5CC7MY0S"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#302B25] text-[#D9D0C1] font-body font-semibold px-8 py-4 rounded-md hover:bg-[#1A1410] transition-all duration-300"
                    >
                      <span className="material-symbols-outlined text-xl">calendar_month</span>
                      Book Online
                    </a>
                    <a
                      href="#visit"
                      className="inline-flex items-center justify-center gap-2 border-2 border-[#302B25] text-[#302B25] font-body font-semibold px-8 py-4 rounded-md hover:bg-[#302B25] hover:text-[#D9D0C1] transition-all duration-300"
                    >
                      Find Us
                    </a>
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <span className="text-[var(--accent)] text-sm tracking-wider">★★★★★</span>
                    <span className="font-mono text-xs text-[#6E6458]">4.8 · Google</span>
                  </div>
                </FadeIn>
              </div>

              {/* Right: Animated Jim */}
              <FadeIn delay={0.4} className="hidden md:block flex-shrink-0">
                <AnimatedJim className="w-[340px] lg:w-[400px] xl:w-[440px]" />
              </FadeIn>
            </div>
          </div>

          {/* Bottom edge detail — warm divider */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ACA690] to-transparent" />
        </section>

        {/* ── About / Vibe ─────────────────────── */}
        <section className="py-20 md:py-28 bg-[#C5BBA8] texture-grain">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
              <FadeIn>
                <div>
                  <p className="font-label uppercase text-xs font-semibold text-[#ACA690] tracking-[0.2em] mb-4">About the Shop</p>
                  <h2 className="font-headline text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
                    Not fancy.<br />
                    <span className="text-[var(--accent)]">Just right.</span>
                  </h2>
                  <div className="space-y-4 text-[#6E6458] font-body text-base md:text-lg leading-relaxed">
                    <p>
                      Siedel&apos;s is a real barbershop. The kind where the Browns game is on,
                      there&apos;s a pile of Sports Illustrated on the table, and the barbers
                      actually know your name.
                    </p>
                    <p>
                      We&apos;ve been on Court Street in Medina for years — same chairs, same crew,
                      same commitment to getting the cut right. No pretense. No bottle service.
                      Just skilled hands and honest conversation.
                    </p>
                  </div>
                  <div className="mt-8 pt-8 border-t border-[#ACA690] flex items-baseline gap-8">
                    <div>
                      <span className="font-headline text-6xl font-bold text-[#302B25] leading-none">11</span>
                      <p className="font-label uppercase text-xs text-[#ACA690] tracking-[0.15em] mt-1">Barbers on Staff</p>
                    </div>
                    <div className="w-px self-stretch bg-[#ACA690]" />
                    <div>
                      <span className="font-headline text-6xl font-bold text-[#302B25] leading-none">#1</span>
                      <p className="font-label uppercase text-xs text-[#ACA690] tracking-[0.15em] mt-1">Court Street</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="grid grid-cols-2 gap-2 md:-mr-6">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-[#ACA690]">
                    <img
                      src="/images/detail-tools-01.webp"
                      alt="Barber tools at Siedel's"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-[#ACA690] mt-12">
                    <img
                      src="/images/interior-stations-01.webp"
                      alt="Inside Siedel's Barbershop"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Team ─────────────────────────────── */}
        <section id="team" className="py-20 md:py-28 bg-[#D9D0C1]">
          <div className="max-w-6xl mx-auto px-6">
            <FadeIn>
              <div className="mb-14">
                <p className="font-label uppercase text-xs font-semibold text-[#ACA690] tracking-[0.2em] mb-3">The Crew</p>
                <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
                  Good people with<br />
                  <span className="text-[var(--accent)]">sharp skills.</span>
                </h2>
              </div>
            </FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {team.map((member, idx) => (
                <FadeIn key={idx} delay={idx * 0.06}>
                  <div className="group cursor-default">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#C5BBA8] mb-3 relative">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#1A1410]">
                          <span className="font-headline text-5xl md:text-6xl font-bold text-[var(--accent)]/80">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-[#302B25]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-5 px-3 gap-2">
                        <p className="font-headline text-base font-semibold text-white tracking-tight translate-y-3 group-hover:translate-y-0 transition-transform duration-300">{member.name}</p>
                        <p className="font-body text-xs text-[var(--accent)] translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75">{member.title}</p>
                        <a
                          href={member.booking}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 font-body text-xs font-semibold bg-[var(--accent)] text-white px-4 py-1.5 rounded-sm hover:bg-[var(--accent-hover)] transition-all duration-300 translate-y-3 group-hover:translate-y-0 delay-100"
                        >
                          Book with {member.name.split(' ')[0]}
                        </a>
                      </div>
                    </div>
                    <h3 className="font-headline text-lg font-semibold tracking-tight">{member.name}</h3>
                    <p className="font-body text-sm text-[#ACA690]">{member.title}</p>
                  </div>
                </FadeIn>
              ))}
              {/* CTA card to fill the grid */}
              <FadeIn delay={team.length * 0.06}>
                <a href="tel:3309520777" className="group cursor-pointer block">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#302B25] mb-3 flex flex-col items-center justify-center text-center px-4 group-hover:bg-[var(--accent)] transition-colors duration-500">
                    <span className="material-symbols-outlined text-5xl text-[var(--accent)] group-hover:text-white mb-4 transition-colors duration-500">content_cut</span>
                    <p className="font-headline text-xl md:text-2xl font-bold text-[#D9D0C1] leading-tight mb-2">Your chair<br />is waiting.</p>
                    <p className="font-body text-sm text-[#ACA690] group-hover:text-white/80 transition-colors duration-500">(330) 952-0777</p>
                  </div>
                  <h3 className="font-headline text-lg font-semibold tracking-tight text-[var(--accent)]">Book Now</h3>
                  <p className="font-body text-sm text-[#ACA690]">Walk-ins welcome</p>
                </a>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Services ─────────────────────────── */}
        <section id="services" className="py-20 md:py-28 bg-[#302B25] text-[#D9D0C1] texture-grain">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
              <div className="lg:col-span-2">
                <FadeIn>
                  <p className="font-label uppercase text-xs font-semibold text-[#ACA690] tracking-[0.2em] mb-3">What We Do</p>
                  <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    Services<br />
                    <span className="text-[var(--accent)]">&amp; prices.</span>
                  </h2>
                  <p className="font-body text-[#ACA690] text-base leading-relaxed mb-8">
                    Straight-up pricing. No surprises.
                    Walk-ins welcome or call ahead to reserve your spot.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://app.squareup.com/appointments/buyer/widget/xcru7izyf4zhv6/LFCOT5CC7MY0S"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[var(--accent)] font-body font-semibold px-6 py-3 rounded-md hover:bg-[var(--accent-hover)] transition-colors duration-300"
                      style={{ color: darkMode ? '#302B25' : '#D9D0C1' }}
                    >
                      <span className="material-symbols-outlined text-lg">calendar_month</span>
                      Book Online
                    </a>
                    <a
                      href="tel:3309520777"
                      className="inline-flex items-center gap-2 border border-[#ACA690] text-[#ACA690] font-body font-semibold px-6 py-3 rounded-md hover:border-[#D9D0C1] hover:text-[#D9D0C1] transition-colors duration-300"
                    >
                      <span className="material-symbols-outlined text-lg">call</span>
                      (330) 952-0777
                    </a>
                  </div>
                </FadeIn>
              </div>
              <div className="lg:col-span-3">
                <div className="space-y-0">
                  {services.map((service, idx) => (
                    <FadeIn key={idx} delay={idx * 0.03}>
                      <div className="flex justify-between items-baseline py-4 border-b border-white/10 group hover:border-[var(--accent)]/30 transition-colors duration-300">
                        <span className="font-body text-base md:text-lg text-[#C5BBA8] group-hover:text-white transition-colors">{service.name}</span>
                        <span className="font-mono text-xl md:text-2xl text-[var(--accent)]">{service.price}</span>
                      </div>
                    </FadeIn>
                  ))}
                </div>
                <div className="pt-8 mt-2 border-t border-white/10 flex items-center gap-3">
                  <span className="font-body text-[#ACA690] text-sm">Ready?</span>
                  <a href="tel:3309520777" className="font-mono text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors text-base">
                    (330) 952-0777
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── The Shop ─────────────────────────── */}
        <section id="the-shop" className="py-20 md:py-28 bg-[#D9D0C1] relative overflow-hidden">
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
            style={{ color: '#302B25', opacity: 0.08 }}
          >
            <SacredBarberPole className="h-full max-h-[700px]" />
          </div>
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <FadeIn>
              <div className="text-center mb-14">
                <p className="font-label uppercase text-xs font-semibold text-[#ACA690] tracking-[0.2em] mb-3">Come Hang Out</p>
                <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">
                  The shop <span className="text-[var(--accent)]">feels like home.</span>
                </h2>
                <p className="font-body text-[#6E6458] text-base md:text-lg max-w-2xl mx-auto">
                  Cleveland memorabilia on the walls. A comfortable waiting area where
                  you actually want to sit. The game&apos;s always on.
                </p>
              </div>
            </FadeIn>
            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: 'sports_football',
                  title: 'Cleveland Proud',
                  text: 'Browns flag flying, Guardians prints on the wall, and conversations about the next big game.',
                },
                {
                  icon: 'content_cut',
                  title: 'Real Barber Chairs',
                  text: 'Classic setup. Dark cabinets, good mirrors, and barbers who know what they\'re doing.',
                },
                {
                  icon: 'weekend',
                  title: 'Comfortable Waiting',
                  text: 'Olive chairs, sports gallery wall, TV mounted up. You won\'t mind the wait.',
                },
              ].map((card, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className="bg-[#C5BBA8] rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                    <span className="material-symbols-outlined text-4xl text-[var(--accent)] mb-4 block">{card.icon}</span>
                    <h3 className="font-headline text-xl font-bold mb-2">{card.title}</h3>
                    <p className="font-body text-[#6E6458] text-sm leading-relaxed">{card.text}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── Visit / Contact ──────────────────── */}
        <section id="visit" className="py-20 md:py-28 bg-[#1A1410] text-[#D9D0C1] texture-grain">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <FadeIn>
                <div>
                  <p className="font-label uppercase text-xs font-semibold text-[#ACA690] tracking-[0.2em] mb-3">Stop By</p>
                  <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-8">
                    Find us on<br />
                    <span className="text-[var(--accent)]">Court Street.</span>
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-body text-sm font-semibold text-[#ACA690] uppercase tracking-wider mb-2">Address</h3>
                      <p className="font-mono text-sm leading-relaxed">982 N Court Street<br />Medina, Ohio 44256</p>
                    </div>
                    <div>
                      <h3 className="font-body text-sm font-semibold text-[#ACA690] uppercase tracking-wider mb-2">Phone</h3>
                      <a href="tel:3309520777" className="font-mono text-base text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">(330) 952-0777</a>
                    </div>
                    <div className="pt-4">
                      <a
                        href="https://maps.google.com/?q=982+N+Court+Street+Medina+OH+44256"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[var(--accent)] text-white font-body font-semibold px-6 py-3 rounded-md hover:bg-[var(--accent-hover)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-lg">directions</span>
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div>
                  <h3 className="font-body text-sm font-semibold text-[#ACA690] uppercase tracking-wider mb-6">Hours</h3>
                  <div className="space-y-0">
                    {hours.map((h, idx) => (
                      <div key={idx} className={`flex justify-between py-3 border-b border-white/10 ${
                        h.day === 'Sunday' ? 'text-[#ACA690]' : ''
                      }`}>
                        <span className="font-body">{h.day}</span>
                        <span className="font-mono text-sm">{h.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Cleveland pride callout */}
                  <div className="mt-10 p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-2xl text-[var(--accent)] mt-0.5">sports_football</span>
                      <div>
                        <p className="font-headline text-base font-semibold mb-1">Game day? We&apos;re here.</p>
                        <p className="font-body text-sm text-[#ACA690]">
                          Get cleaned up before kickoff. The shop runs on Cleveland time.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────── */}
        <footer className="bg-[#302B25] text-[#ACA690] py-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="opacity-40 flex-shrink-0 hidden md:block">
                  <AnimatedJim className="w-[48px]" />
                </div>
                <div className="text-center md:text-left">
                  <p className="font-brand text-4xl text-[#D9D0C1] uppercase" style={{ lineHeight: 1, letterSpacing: '-0.02em' }}>Siedel&apos;s</p>
                  <p className="font-brand text-xl text-[#D9D0C1] uppercase" style={{ fontWeight: 900, lineHeight: 1, letterSpacing: '-0.01em' }}>Barbershop</p>
                  <span className="block h-[2px] w-full mt-1.5 mb-1" style={{ background: 'var(--accent)' }} />
                  <p className="font-mono text-[9px] text-[#ACA690] tracking-[0.25em] uppercase">Stay Sharp</p>
                  <p className="font-body text-sm">982 N Court Street, Medina, OH 44256</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <a href="tel:3309520777" className="font-body text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">(330) 952-0777</a>
                <p className="font-body text-xs mt-1">&copy; {new Date().getFullYear()} Siedel&apos;s Barbershop</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
