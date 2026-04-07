'use client';

import { useState, useEffect, useRef } from 'react';

export function AnimatedJim({ className = '' }: { className?: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [eyePupilPositions, setEyePupilPositions] = useState({
    left: { x: 145, y: 177 },
    right: { x: 255, y: 177 },
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = rect.width / 400;
    const scaleY = rect.height / 650;

    const pupilOffset = (eyeX: number, eyeY: number) => {
      const angle = Math.atan2(mousePosition.y - eyeY, mousePosition.x - eyeX);
      return { x: Math.cos(angle) * 6, y: Math.sin(angle) * 6 };
    };

    const lo = pupilOffset(rect.left + 145 * scaleX, rect.top + 177 * scaleY);
    const ro = pupilOffset(rect.left + 255 * scaleX, rect.top + 177 * scaleY);

    setEyePupilPositions({
      left: { x: 145 + lo.x, y: 177 + lo.y },
      right: { x: 255 + ro.x, y: 177 + ro.y },
    });
  }, [mousePosition]);

  return (
    <>
      <style>{`
        @keyframes jim-breathe { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-3px) } }
        @keyframes jim-buzz { 0%,100% { transform: translate(0,0) } 25% { transform: translate(-1px,-1px) } 50% { transform: translate(1px,1px) } 75% { transform: translate(-1px,1px) } }
        .jim-svg { display:block; width:100%; height:auto; max-width:450px; filter:drop-shadow(0 4px 20px rgba(0,0,0,.1)); transition:filter .3s ease }
        .jim-svg.hovered { filter:drop-shadow(0 0 20px rgba(110,100,88,.25)) drop-shadow(0 4px 20px rgba(0,0,0,.15)) }
        .jim-torso { animation:jim-breathe 3s ease-in-out infinite; transform-origin:center 300px }
        .jim-clippers-on { animation:jim-buzz .15s ease-in-out infinite; transform-origin:360px 280px }
      `}</style>
      <div
        className={`inline-block relative ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 400 650"
          width="400"
          height="650"
          className={`jim-svg ${isHovered ? 'hovered' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
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

          {/* Neck */}
          <rect x="160" y="280" width="80" height="40" fill="url(#skinTone)" filter="url(#shadow)" />

          {/* Torso + arms */}
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

          {/* Head */}
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

          {/* Clippers */}
          <g className={isHovered ? 'jim-clippers-on' : ''} style={{ transformOrigin: '360px 280px' }}>
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
