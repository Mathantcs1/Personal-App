// narrativeSlice: The system is total — these are not tricks but a unified architecture of attention
// visualMetaphor: Tadao Ando concrete monolith rising from ground — architecture as system reveal
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn } from '../utils/interpolations';

export const Scene_16_meta = {
  id: 'Scene_16', duration: 270,
  narrativeSlice: 'These are not isolated tricks — they form a complete architectural system of attention',
  visualMetaphor: 'Concrete monolith emerging from ground — total architecture reveals itself',
  palette: ['#1A1714', '#2C2825', '#8A7F78', COLORS.offWhite],
};

const CONCRETE = '#2C2825';
const LIGHT     = '#8A7F78';
const WARM      = '#F0EDE8';

export const Scene_16: React.FC = () => {
  const f = useCurrentFrame();

  const bgOp = useFadeIn(0, 30);

  // Monolith rises from bottom
  const monolithH = interpolate(f, [20, 120], [0, H * 0.68], { extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) });
  const monolithOp = useFadeIn(20, 15);

  // Three horizontal light bands across monolith — Ando signature
  const band1Op = useFadeIn(90, 20);
  const band2Op = useFadeIn(110, 20);
  const band3Op = useFadeIn(130, 20);

  // Text emerges from stone
  const textOp   = useFadeIn(150, 30);
  const textY    = interpolate(f, [150, 180], [20, 0], { extrapolateRight: 'clamp' });

  // Vignelli-style title block
  const blockOp  = useFadeIn(170, 25);
  const ruleW    = interpolate(f, [180, 230], [0, W * 0.32], { extrapolateRight: 'clamp' });

  // Ground line
  const groundOp = useFadeIn(15, 15);

  return (
    <AbsoluteFill style={{ background: '#1A1714', overflow: 'hidden' }}>
      {/* Subtle concrete texture via noise-like SVG pattern */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.03 }} width={W} height={H}>
        <filter id="noise16">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width={W} height={H} filter="url(#noise16)" />
      </svg>

      {/* Ground plane */}
      <div style={{ position: 'absolute', bottom: H * 0.12, left: 0, right: 0, height: 2, background: LIGHT, opacity: groundOp }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: H * 0.12, background: CONCRETE, opacity: groundOp }} />

      {/* Monolith — centered */}
      <div style={{
        position: 'absolute',
        left: W * 0.5 - 180,
        bottom: H * 0.12,
        width: 360, height: monolithH,
        background: CONCRETE,
        opacity: monolithOp,
      }}>
        {/* Ando horizontal light cut band 1 */}
        <div style={{ position: 'absolute', top: '25%', left: 0, right: 0, height: 2, background: LIGHT, opacity: band1Op }} />
        {/* Band 2 */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: LIGHT, opacity: band2Op * 0.6 }} />
        {/* Band 3 */}
        <div style={{ position: 'absolute', top: '75%', left: 0, right: 0, height: 2, background: LIGHT, opacity: band3Op }} />

        {/* Text from stone */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, calc(-50% + ${textY}px))`, textAlign: 'center', opacity: textOp, width: 280 }}>
          <p style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 900, letterSpacing: 8, color: WARM, textTransform: 'uppercase', margin: 0 }}>
            SYSTEM<br />COMPLETE
          </p>
        </div>
      </div>

      {/* Title block — Vignelli rigid grid, left side */}
      <div style={{ position: 'absolute', left: SAFE, top: H * 0.2, opacity: blockOp }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 4, color: LIGHT, textTransform: 'uppercase', margin: '0 0 20px' }}>
          ARCHITECTURE OF ATTENTION
        </p>
        <div style={{ width: ruleW, height: 3, background: WARM, marginBottom: 20 }} />
        <h1 style={{ fontFamily: FONTS.display, fontSize: 76, fontWeight: 900, letterSpacing: -4, color: WARM, margin: 0, lineHeight: 0.92 }}>
          THREE<br />PILLARS.<br />ONE<br />SYSTEM.
        </h1>
      </div>

      {/* Right side — pillar list, Vignelli style */}
      <div style={{ position: 'absolute', right: SAFE, top: H * 0.35, opacity: useFadeIn(200, 25), textAlign: 'right' }}>
        {['I.   THE PROMISE', 'II.  THE ESCALATION', 'III. THE CAST'].map((item, i) => (
          <p key={i} style={{
            fontFamily: FONTS.mono, fontSize: 18, color: i === 2 ? WARM : LIGHT,
            letterSpacing: 3, margin: '0 0 20px', fontWeight: 600,
          }}>
            {item}
          </p>
        ))}
      </div>
    </AbsoluteFill>
  );
};
