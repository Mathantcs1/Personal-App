// narrativeSlice: Implication — any creator can apply these three systems, but almost none have the will to execute at this scale
// visualMetaphor: Kubrick monolith in void — the answer is there, unmoving, indifferent, absolute
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn } from '../utils/interpolations';

export const Scene_18_meta = {
  id: 'Scene_18', duration: 270,
  narrativeSlice: 'Any creator can learn the system. Almost none will execute it at full scale.',
  visualMetaphor: 'Kubrick monolith in infinite void — the knowledge stands, indifferent and absolute',
  palette: ['#000000', '#111111', '#AAAAAA', COLORS.offWhite],
};

export const Scene_18: React.FC = () => {
  const f = useCurrentFrame();

  // Void breathing — very slow vignette pulse
  const voidPulse = 0.92 + Math.sin(f * 0.025) * 0.08;

  // Monolith materializes
  const monolithOp = interpolate(f, [20, 80], [0, 1], { extrapolateRight: 'clamp' });
  const monolithScale = interpolate(f, [20, 80], [0.94, 1], { extrapolateRight: 'clamp' });

  // Star field
  const starsOp = useFadeIn(0, 40);

  // Text carved last
  const word1Op = useFadeIn(90, 30);
  const word2Op = useFadeIn(130, 30);
  const word3Op = useFadeIn(170, 30);

  // Ground reflection
  const reflectOp = useFadeIn(80, 30);

  const MW = 260, MH = 520;
  const mx = W * 0.5 - MW * 0.5;
  const my = H * 0.5 - MH * 0.55;

  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      {/* Star field */}
      <svg style={{ position: 'absolute', inset: 0, opacity: starsOp * 0.6 }} width={W} height={H}>
        {Array.from({ length: 120 }, (_, i) => {
          const sx = ((i * 173.3) % W);
          const sy = ((i * 97.7) % H);
          const sr = 0.5 + (i % 3) * 0.5;
          return <circle key={i} cx={sx} cy={sy} r={sr} fill="#FFF" opacity={0.3 + (i % 5) * 0.1} />;
        })}
      </svg>

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,${voidPulse}) 100%)`, pointerEvents: 'none' }} />

      {/* The Monolith */}
      <div style={{
        position: 'absolute', left: mx, top: my, width: MW, height: MH,
        background: '#0A0A0A',
        opacity: monolithOp,
        transform: `scale(${monolithScale})`,
        boxShadow: '0 0 120px rgba(255,255,255,0.04), inset 0 0 40px rgba(255,255,255,0.02)',
      }} />

      {/* Ground reflection — faint */}
      <div style={{
        position: 'absolute', left: mx + 20, top: my + MH + 2, width: MW - 40, height: MH * 0.3,
        background: 'linear-gradient(to bottom, rgba(10,10,10,0.6), transparent)',
        opacity: reflectOp,
        transform: 'scaleY(-1)',
      }} />

      {/* Text carved into void — NOT on monolith, beside it */}
      <div style={{ position: 'absolute', left: SAFE, top: H * 0.28 }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 5, color: '#555', textTransform: 'uppercase', margin: '0 0 32px', opacity: word1Op }}>
          THE KNOWLEDGE EXISTS.
        </p>
        <h1 style={{ fontFamily: FONTS.display, fontSize: 84, fontWeight: 900, letterSpacing: -4, color: COLORS.offWhite, margin: 0, lineHeight: 0.9, opacity: word2Op }}>
          THE GAP IS<br />EXECUTION.
        </h1>
      </div>

      {/* Bottom right — Vignelli precision block */}
      <div style={{ position: 'absolute', right: SAFE, bottom: SAFE + 30, textAlign: 'right', opacity: word3Op }}>
        <div style={{ width: '100%', height: 1, background: '#444', marginBottom: 16 }} />
        <p style={{ fontFamily: FONTS.mono, fontSize: 13, letterSpacing: 4, color: '#666', margin: 0, textTransform: 'uppercase' }}>
          THREE REASONS.<br />INFINITE DISTANCE<br />FROM THE NEAREST<br />COMPETITOR.
        </p>
      </div>
    </AbsoluteFill>
  );
};
