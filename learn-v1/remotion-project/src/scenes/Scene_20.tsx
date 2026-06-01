// narrativeSlice: End card — the three reasons crystallized into a single stark visual manifesto
// visualMetaphor: Swiss International Style — three numbered axioms on absolute black, Vignelli-rigid grid
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn } from '../utils/interpolations';

export const Scene_20_meta = {
  id: 'Scene_20', duration: 300,
  narrativeSlice: 'Final card — three axioms crystallized into an absolute typographic manifesto',
  visualMetaphor: 'Swiss International Style grid — three axioms in maximum typographic authority',
  palette: ['#000000', COLORS.offWhite, COLORS.gold, '#444444'],
};

const AXIOMS = [
  { num: 'I',   text: 'THE PROMISE IS LAW.',        sub: 'State it in frame one. No exceptions.', delay: 30 },
  { num: 'II',  text: 'ESCALATION IS MANDATORY.',   sub: 'Double or die. Every sixty seconds.', delay: 80 },
  { num: 'III', text: 'CAST FOR CONFLICT.',          sub: 'Zero passengers. Every seat earns its place.', delay: 130 },
];

export const Scene_20: React.FC = () => {
  const f = useCurrentFrame();

  const bgOp = useFadeIn(0, 20);

  // Top rule draws in
  const topRuleW = interpolate(f, [10, 40], [0, W - SAFE * 2], { extrapolateRight: 'clamp' });
  const topRuleOp = useFadeIn(10, 10);

  const axiomOps = AXIOMS.map(a =>
    useFadeIn(a.delay, 25)
  );
  const axiomY = AXIOMS.map(a =>
    interpolate(f, [a.delay, a.delay + 25], [30, 0], { extrapolateRight: 'clamp' })
  );

  // Bottom rule
  const botRuleW = interpolate(f, [180, 220], [0, W - SAFE * 2], { extrapolateRight: 'clamp' });
  const botRuleOp = useFadeIn(180, 15);

  // Author stamp
  const stampOp = useFadeIn(220, 30);

  // Final fade to black at very end
  const endFade = interpolate(f, [270, 300], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      {/* Top horizontal rule */}
      <div style={{ position: 'absolute', top: SAFE, left: SAFE, width: topRuleW, height: 3, background: COLORS.offWhite, opacity: topRuleOp }} />

      {/* Header label */}
      <div style={{ position: 'absolute', top: SAFE + 16, left: SAFE, opacity: useFadeIn(15, 20) }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 5, color: '#444', textTransform: 'uppercase', margin: 0 }}>
          RETENTION ARCHITECTURE — AXIOMS
        </p>
      </div>

      {/* Three axioms */}
      {AXIOMS.map((a, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: SAFE, top: H * 0.22 + i * (H * 0.22),
          opacity: axiomOps[i],
          transform: `translateY(${axiomY[i]}px)`,
        }}>
          {/* Number + text on same baseline — Vignelli column discipline */}
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 0, alignItems: 'baseline' }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 13, letterSpacing: 3, color: COLORS.gold }}>
              {a.num}
            </span>
            <div>
              <h2 style={{ fontFamily: FONTS.display, fontSize: 68, fontWeight: 900, letterSpacing: -3, color: COLORS.offWhite, margin: 0, lineHeight: 0.9 }}>
                {a.text}
              </h2>
              <p style={{ fontFamily: FONTS.mono, fontSize: 14, color: '#555', margin: '10px 0 0', letterSpacing: 1.5 }}>
                {a.sub}
              </p>
            </div>
          </div>
          {/* Axiom rule */}
          <div style={{ height: 1, background: '#222', margin: '20px 0 0', width: W - SAFE * 2 - 100, marginLeft: 100 }} />
        </div>
      ))}

      {/* Bottom rule */}
      <div style={{ position: 'absolute', bottom: SAFE + 40, left: SAFE, width: botRuleW, height: 3, background: COLORS.offWhite, opacity: botRuleOp }} />

      {/* Stamp */}
      <div style={{ position: 'absolute', bottom: SAFE, left: SAFE, right: SAFE, display: 'flex', justifyContent: 'space-between', opacity: stampOp }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 3, color: '#333', margin: 0 }}>
          THREE REASONS MR. BEAST HAS MASTERED THE ART OF RETENTION
        </p>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 3, color: '#333', margin: 0 }}>
          SYSTEM DOCUMENTED — APPLY FREELY
        </p>
      </div>

      {/* End fade */}
      <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: endFade, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
