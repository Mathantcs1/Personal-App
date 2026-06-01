// narrativeSlice: The call to action — apply the promise, escalation, and cast system to your next video
// visualMetaphor: Architectural blueprint overlay — three structural beams labeled and dimensioned
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn, useExpand } from '../utils/interpolations';

export const Scene_19_meta = {
  id: 'Scene_19', duration: 240,
  narrativeSlice: 'Apply the three systems to your next piece of content — Promise, Escalation, Cast',
  visualMetaphor: 'Blueprint construction drawing — three structural beams dimensioned and labelled',
  palette: ['#06090F', '#0A1628', '#1D4ED8', COLORS.offWhite, COLORS.gold],
};

const BEAMS = [
  { id: 'BEAM-A', label: 'THE PROMISE',     sub: 'State stakes in frame 1. Non-negotiable.',     color: COLORS.gold,      y: H * 0.30, delay: 20 },
  { id: 'BEAM-B', label: 'THE ESCALATION',  sub: 'Double stakes every 60 seconds. Mandatory.',   color: '#1D4ED8',        y: H * 0.50, delay: 60 },
  { id: 'BEAM-C', label: 'THE CAST',        sub: 'Every person = one conflict function. Zero passengers.', color: COLORS.liveGreen, y: H * 0.70, delay: 100 },
];

export const Scene_19: React.FC = () => {
  const f = useCurrentFrame();

  const bgOp    = useFadeIn(0, 25);
  const titleOp = useFadeIn(0, 20);

  const beamWidths = BEAMS.map(b =>
    useExpand(b.delay, 45, W - SAFE * 2)
  );
  const beamOps = BEAMS.map(b =>
    useFadeIn(b.delay, 15)
  );

  // Dimension lines
  const dimOp  = useFadeIn(140, 20);

  // Final CTA
  const ctaOp  = useFadeIn(180, 25);
  const ctaY   = interpolate(f, [180, 210], [20, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#06090F', overflow: 'hidden' }}>
      {/* Blueprint grid */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.08 }} width={W} height={H}>
        {Array.from({ length: 30 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 36} x2={W} y2={i * 36} stroke="#1D4ED8" strokeWidth={1} />)}
        {Array.from({ length: 54 }, (_, i) => <line key={`v${i}`} x1={i * 36} y1={0} x2={i * 36} y2={H} stroke="#1D4ED8" strokeWidth={1} />)}
      </svg>

      {/* Blueprint title stamp */}
      <div style={{ position: 'absolute', top: SAFE, left: SAFE, opacity: titleOp }}>
        <div style={{ border: '2px solid rgba(29,78,216,0.5)', padding: '8px 20px', display: 'inline-block', marginBottom: 16 }}>
          <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 4, color: '#1D4ED8', textTransform: 'uppercase', margin: 0 }}>
            CONSTRUCTION DOCUMENT — SHEET 3/3
          </p>
        </div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 58, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: 0, lineHeight: 1.0 }}>
          YOUR NEXT VIDEO.<br />ENGINEERED.
        </h2>
      </div>

      {/* Structural beams */}
      {BEAMS.map((beam, i) => (
        <div key={i} style={{ position: 'absolute', left: SAFE, top: beam.y - 30, opacity: beamOps[i] }}>
          {/* Beam label */}
          <p style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 3, color: beam.color, textTransform: 'uppercase', margin: '0 0 6px' }}>
            {beam.id}
          </p>
          {/* Beam bar */}
          <div style={{ width: beamWidths[i], height: 48, background: 'transparent', border: `2px solid ${beam.color}`, position: 'relative', display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
            {/* Inner fill */}
            <div style={{ position: 'absolute', inset: 2, background: `${beam.color}12` }} />
            <span style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 900, color: beam.color, letterSpacing: -1, position: 'relative', zIndex: 1 }}>
              {beam.label}
            </span>
          </div>
          {/* Sub copy */}
          <p style={{ fontFamily: FONTS.mono, fontSize: 12, color: 'rgba(240,237,232,0.4)', margin: '6px 0 0', letterSpacing: 0.5 }}>
            {beam.sub}
          </p>
        </div>
      ))}

      {/* Dimension annotations */}
      <svg style={{ position: 'absolute', inset: 0, opacity: dimOp }} width={W} height={H}>
        {BEAMS.map((b, i) => (
          <g key={i}>
            <line x1={W - SAFE - 40} y1={b.y - 30} x2={W - SAFE - 40} y2={b.y + 20} stroke="rgba(240,237,232,0.2)" strokeWidth={1} />
            <line x1={W - SAFE - 48} y1={b.y - 30} x2={W - SAFE - 32} y2={b.y - 30} stroke="rgba(240,237,232,0.2)" strokeWidth={1} />
            <line x1={W - SAFE - 48} y1={b.y + 20} x2={W - SAFE - 32} y2={b.y + 20} stroke="rgba(240,237,232,0.2)" strokeWidth={1} />
          </g>
        ))}
      </svg>

      {/* CTA */}
      <div style={{ position: 'absolute', right: SAFE, bottom: SAFE + 20, textAlign: 'right', opacity: ctaOp, transform: `translateY(${ctaY}px)` }}>
        <div style={{ width: W * 0.3, height: 3, background: COLORS.gold, marginLeft: 'auto', marginBottom: 16 }} />
        <p style={{ fontFamily: FONTS.display, fontSize: 48, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: 0, lineHeight: 1.0 }}>
          BUILD THE SYSTEM.<br />BEAT THE ALGORITHM.
        </p>
      </div>
    </AbsoluteFill>
  );
};
