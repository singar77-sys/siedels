export function SacredBarberPole({ className = '' }: { className?: string }) {
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
        @keyframes sbpUp{from{stroke-dashoffset:40}to{stroke-dashoffset:0}}
        @keyframes sbpDown{from{stroke-dashoffset:0}to{stroke-dashoffset:40}}
        @keyframes sbpBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.018)}}
        @keyframes sbpRingPulse{0%,100%{opacity:.5;stroke-width:.5}50%{opacity:1;stroke-width:1}}
        @keyframes sbpFlower{0%,100%{opacity:.18}50%{opacity:.38}}
        @keyframes sbpLines{0%,100%{opacity:.16}50%{opacity:.30}}
        @keyframes sbpVesica{0%,100%{opacity:.38}50%{opacity:.70}}
        @keyframes sbpAxis{0%,100%{opacity:.4}50%{opacity:.75}}
        @keyframes sbpNodeShimmer{0%,100%{r:2.2;opacity:.55}50%{r:3.2;opacity:1}}
        @keyframes sbpApexPulse{0%,100%{r:2.5;opacity:.8}50%{r:4;opacity:1}}
        @keyframes sbpCenter{0%,100%{r:3.5;opacity:1}50%{r:5.5;opacity:.6}}
        .sbp-a{stroke-dasharray:22 18;animation:sbpUp 5s linear infinite}
        .sbp-b{stroke-dasharray:22 18;animation:sbpDown 5s linear infinite}
        .sbp-a2{stroke-dasharray:8 32;animation:sbpUp 5s linear infinite}
        .sbp-b2{stroke-dasharray:8 32;animation:sbpDown 5s linear infinite}
        .sbp-body{animation:sbpBreathe 8s ease-in-out infinite;transform-origin:200px 250px}
        .sbp-ring{animation:sbpRingPulse 8s ease-in-out infinite}
        .sbp-flower{animation:sbpFlower 8s ease-in-out infinite}
        .sbp-lines{animation:sbpLines 8s ease-in-out infinite}
        .sbp-vesica{animation:sbpVesica 8s ease-in-out infinite}
        .sbp-axis{animation:sbpAxis 8s ease-in-out infinite}
        .sbp-node{animation:sbpNodeShimmer 3s ease-in-out infinite}
        .sbp-apex{animation:sbpApexPulse 3s ease-in-out infinite}
        .sbp-center{animation:sbpCenter 3s ease-in-out infinite}
      `}</style>

      <g className="sbp-body">
        <circle cx="200" cy="250" r="183" fill="none" stroke="currentColor" strokeDasharray="2 4" className="sbp-ring" />
        <circle cx="200" cy="250" r="148" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 5" opacity="0.3" />
        <circle cx="200" cy="250" r="100" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 5" opacity="0.22" />

        <g fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 5" className="sbp-flower">
          {flowerCenters.map(([x, y], i) => <circle key={`f${i}`} cx={x} cy={y} r={fR} />)}
          {outerCenters.map(([x, y], i) => <circle key={`o${i}`} cx={x} cy={y} r={fR} />)}
        </g>

        <g stroke="currentColor" strokeWidth="0.35" strokeDasharray="2 5" fill="none" className="sbp-lines">
          <line x1="17" y1="250" x2="383" y2="250" />
          <line x1="200" y1="17" x2="200" y2="483" />
          <line x1="17" y1="90" x2="383" y2="90" />
          <line x1="17" y1="410" x2="383" y2="410" />
          <line x1="17" y1="170" x2="383" y2="170" />
          <line x1="17" y1="330" x2="383" y2="330" />
          <line x1="44" y1="67" x2="356" y2="433" />
          <line x1="356" y1="67" x2="44" y2="433" />
          {[30, 150, 210, 330].map((deg, i) => {
            const a = deg * Math.PI / 180;
            return <line key={i} x1="200" y1="250" x2={200 + 190 * Math.cos(a)} y2={250 + 190 * Math.sin(a)} />;
          })}
        </g>

        <g fill="none" stroke="currentColor" strokeWidth="0.7" className="sbp-vesica">
          <ellipse cx="200" cy="250" rx="30" ry="55" />
          <path d={`M 200 ${250 - 55} A 55 55 0 0 1 200 ${250 + 55} A 55 55 0 0 1 200 ${250 - 55} Z`} />
        </g>

        <line x1="200" y1="46" x2="200" y2="454" stroke="currentColor" strokeWidth="0.8" className="sbp-axis" />

        <g stroke="currentColor" strokeWidth="0.7" opacity="0.38" fill="none">
          <line x1="165" y1="90" x2="235" y2="90" />
          <path d="M 165 90 Q 200 78 235 90" />
          <path d="M 165 90 Q 200 102 235 90" />
          <line x1="165" y1="410" x2="235" y2="410" />
          <path d="M 165 410 Q 200 422 235 410" />
          <path d="M 165 410 Q 200 398 235 410" />
        </g>

        <g fill="none">
          <path d={pathA} stroke="currentColor" strokeWidth="1.8" opacity="0.85" className="sbp-a" />
          <path d={pathB} stroke="currentColor" strokeWidth="1.8" opacity="0.85" className="sbp-b" />
          <path d={pathA2} stroke="currentColor" strokeWidth="0.6" opacity="0.3" className="sbp-a2" />
          <path d={pathB2} stroke="currentColor" strokeWidth="0.6" opacity="0.3" className="sbp-b2" />
        </g>

        <g fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.55">
          <polygon points="200,46 181,82 219,82" />
          <polygon points="200,454 181,418 219,418" />
        </g>

        {perimNodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.2" fill="currentColor" className="sbp-node" style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
        {([[200, 90], [200, 410], [200, 170], [200, 330]] as [number, number][]).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill="currentColor" opacity="0.45" style={{ animationDelay: `${i * 0.7}s` }} />
        ))}

        <circle cx="200" cy="46" fill="currentColor" className="sbp-apex" />
        <circle cx="200" cy="454" fill="currentColor" className="sbp-apex" style={{ animationDelay: '1.5s' }} />
        <circle cx="200" cy="250" fill="currentColor" className="sbp-center" />
      </g>
    </svg>
  );
}
