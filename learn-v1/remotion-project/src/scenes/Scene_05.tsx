// narrativeSlice: The promise triggers a psychological loop — the brain demands closure and keeps watching
// visualMetaphor: Neural loop diagram — open circuit that only closes at video end
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn, useSlideY } from '../utils/interpolations';

export const Scene_05_meta = {
  id: 'Scene_05', duration: 240,
  narrativeSlice: 'The brain cannot close an open loop — completion compulsion keeps viewers watching',
  visualMetaphor: 'Neural circuit open at start, gradually completing as video progresses',
  palette: [COLORS.black, COLORS.dataBlue, COLORS.gold, COLORS.offWhite],
};

export const Scene_05: React.FC = () => {
  const f = useCurrentFrame();

  const titleOp  = useFadeIn(0, 20);
  const titleY   = useSlideY(28, 0, 18);
  const loopOp   = useFadeIn(20, 15);

  // Loop arc draws — open circuit gradually closes
  const arcProgress = interpolate(f, [30, 200], [0, 0.85], { extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 2) });
  const closingArc  = interpolate(f, [200, 230], [0, 1], { extrapolateRight: 'clamp' });

  const cx = W * 0.52;
  const cy = H * 0.52;
  const r1 = 220;
  const r2 = 160;
  const r3 = 100;

  const arcToPath = (radius: number, progress: number, startAngle = -90): string => {
    const endAngle = startAngle + 360 * progress;
    const rad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(rad(startAngle));
    const y1 = cy + radius * Math.sin(rad(startAngle));
    const x2 = cx + radius * Math.cos(rad(endAngle));
    const y2 = cy + radius * Math.sin(rad(endAngle));
    const large = progress > 0.5 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  // Node positions on outer ring
  const nodes = [
    { angle: -90, label: 'PROMISE', color: COLORS.gold },
    { angle: 0,   label: 'TENSION', color: COLORS.dataBlue },
    { angle: 90,  label: 'ESCALATION', color: COLORS.dataBlue },
    { angle: 180, label: 'RESOLUTION', color: COLORS.liveGreen },
  ];

  const nodeOps = nodes.map((_, i) =>
    interpolate(f, [40 + i * 25, 60 + i * 25], [0, 1], { extrapolateRight: 'clamp' })
  );

  const rad = (deg: number) => (deg * Math.PI) / 180;
  const labelOp = useFadeIn(160, 20);

  return (
    <AbsoluteFill style={{ background: COLORS.black, overflow: 'hidden' }}>
      {/* Title */}
      <div style={{ position: 'absolute', top: SAFE, left: SAFE, opacity: titleOp, transform: `translateY(${titleY}px)` }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 4, color: COLORS.dataBlue, textTransform: 'uppercase', margin: 0 }}>
          PSYCHOLOGICAL MECHANISM — THE ZEIGARNIK EFFECT
        </p>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 56, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: '8px 0 0', lineHeight: 1.0 }}>
          THE BRAIN HATES<br />OPEN LOOPS
        </h2>
      </div>

      {/* Loop circuit SVG */}
      <svg style={{ position: 'absolute', inset: 0, opacity: loopOp }} width={W} height={H}>
        {/* Background halos */}
        <circle cx={cx} cy={cy} r={r1 + 20} fill="none" stroke="rgba(79,195,247,0.05)" strokeWidth={40} />
        <circle cx={cx} cy={cy} r={r2 + 15} fill="none" stroke="rgba(79,195,247,0.04)" strokeWidth={30} />

        {/* Arc 1 — outer ring drawing */}
        <path d={arcToPath(r1, arcProgress)} fill="none" stroke={COLORS.dataBlue} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
        {/* Arc 2 — mid ring */}
        <path d={arcToPath(r2, arcProgress * 0.9, -90)} fill="none" stroke={COLORS.dataBlue} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
        {/* Arc 3 — inner ring */}
        <path d={arcToPath(r3, arcProgress * 0.8, -90)} fill="none" stroke={COLORS.gold} strokeWidth={2} strokeLinecap="round" opacity={0.5} />

        {/* Closing flash at 200f */}
        {f >= 200 && (
          <circle cx={cx} cy={cy} r={r1} fill="none" stroke={COLORS.liveGreen}
            strokeWidth={4} opacity={closingArc * 0.8} />
        )}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const nx = cx + r1 * Math.cos(rad(node.angle));
          const ny = cy + r1 * Math.sin(rad(node.angle));
          return (
            <g key={i} opacity={nodeOps[i]}>
              <circle cx={nx} cy={ny} r={14} fill={COLORS.black} stroke={node.color} strokeWidth={2} />
              <circle cx={nx} cy={ny} r={6} fill={node.color} />
              <text x={nx} y={node.angle === 90 ? ny + 36 : node.angle === -90 ? ny - 26 : ny + 5}
                textAnchor={node.angle === 0 ? 'start' : node.angle === 180 ? 'end' : 'middle'}
                dx={node.angle === 0 ? 22 : node.angle === 180 ? -22 : 0}
                fill={node.color} fontFamily={FONTS.mono} fontSize={12} letterSpacing={2}>
                {node.label}
              </text>
            </g>
          );
        })}

        {/* Center label */}
        <text x={cx} y={cy - 10} textAnchor="middle" fill="rgba(240,237,232,0.3)" fontFamily={FONTS.mono} fontSize={11} letterSpacing={3}>
          RETENTION
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill={COLORS.offWhite} fontFamily={FONTS.display} fontSize={28} fontWeight={900}>
          ENGINE
        </text>
      </svg>

      {/* Callout */}
      <div style={{ position: 'absolute', bottom: SAFE + 30, left: SAFE, opacity: labelOp }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 13, color: 'rgba(240,237,232,0.5)', letterSpacing: 1, margin: 0, lineHeight: 1.7 }}>
          PROMISE ≡ OPEN CIRCUIT  /  VIDEO ≡ CONDUCTOR  /  RESOLUTION ≡ CLOSED
        </p>
      </div>
    </AbsoluteFill>
  );
};
