// REVISION: original
// narrativeSlice: The question is posed — why does Mr Beast hold attention while everyone else loses it?
// visualMetaphor: A forensic dossier materializes — redacted file drops onto a sterile examination table
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn, useSlideY } from '../utils/interpolations';

export const Scene_01_meta = {
  id: 'Scene_01', duration: 210,
  narrativeSlice: 'Why does Mr Beast hold attention while everyone else hemorrhages it?',
  visualMetaphor: 'Forensic dossier drops onto examination table — case file opening',
  palette: [COLORS.black, COLORS.offWhite, COLORS.gold, COLORS.red],
};

export const Scene_01: React.FC = () => {
  const f = useCurrentFrame();

  // Background grid lines — forensic graph paper
  const gridOpacity = useFadeIn(0, 20);
  // Dossier drop
  const dossierY    = interpolate(f, [15, 40], [-H * 0.15, 0], { extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 4) });
  const dossierOp   = useFadeIn(15, 10);
  // CLASSIFIED stamp
  const stampScale  = interpolate(f, [50, 65], [2.2, 1], { extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) });
  const stampOp     = useFadeIn(50, 8);
  // Subject line types on
  const subjectOp   = useFadeIn(70, 15);
  const subjectY    = useSlideY(20, 70, 20);
  // Case number
  const caseOp      = useFadeIn(90, 15);
  // Horizontal rule expands
  const ruleW       = interpolate(f, [80, 130], [0, W - SAFE * 2], { extrapolateRight: 'clamp' });
  // Bottom tag line
  const tagOp       = useFadeIn(110, 20);

  const gridLines = Array.from({ length: 18 }, (_, i) => i);

  return (
    <AbsoluteFill style={{ background: COLORS.black, overflow: 'hidden' }}>
      {/* Forensic grid */}
      <svg style={{ position: 'absolute', inset: 0, opacity: gridOpacity * 0.06 }} width={W} height={H}>
        {gridLines.map(i => (
          <React.Fragment key={i}>
            <line x1={0} y1={(i + 1) * (H / 19)} x2={W} y2={(i + 1) * (H / 19)} stroke={COLORS.offWhite} strokeWidth={1} />
            <line x1={(i + 1) * (W / 19)} y1={0} x2={(i + 1) * (W / 19)} y2={H} stroke={COLORS.offWhite} strokeWidth={1} />
          </React.Fragment>
        ))}
      </svg>

      {/* Dossier document block */}
      <div style={{
        position: 'absolute', top: H * 0.18, left: SAFE, width: W * 0.55, height: H * 0.64,
        background: COLORS.offWhite, opacity: dossierOp,
        transform: `translateY(${dossierY}px)`,
        boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
      }}>
        {/* Document header stripe */}
        <div style={{ height: 10, background: COLORS.red, width: '100%' }} />
        <div style={{ padding: '32px 40px' }}>
          <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 3, color: '#555', textTransform: 'uppercase', margin: 0 }}>
            CASE FILE — RETENTION ANALYSIS UNIT
          </p>
          <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 3, color: '#555', textTransform: 'uppercase', margin: '6px 0 0' }}>
            SUBJECT: DONALDSON, JIMMY (MR. BEAST)
          </p>
          {/* Redacted lines */}
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} style={{ height: 14, background: '#DDD', margin: '18px 0', width: `${60 + (i % 3) * 15}%` }} />
          ))}
        </div>
      </div>

      {/* CLASSIFIED stamp */}
      <div style={{
        position: 'absolute', top: H * 0.22, left: SAFE + W * 0.28,
        transform: `scale(${stampScale}) rotate(-18deg)`,
        opacity: stampOp, transformOrigin: 'center center',
        border: `6px solid ${COLORS.red}`, padding: '8px 20px',
      }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 28, color: COLORS.red, fontWeight: 900, letterSpacing: 6, margin: 0 }}>
          CLASSIFIED
        </p>
      </div>

      {/* Right side — headline block */}
      <div style={{ position: 'absolute', top: H * 0.28, right: SAFE, width: W * 0.36 }}>
        <p style={{
          fontFamily: FONTS.display, fontSize: 13, fontWeight: 600,
          letterSpacing: 4, color: COLORS.gold, textTransform: 'uppercase',
          margin: 0, opacity: caseOp,
        }}>
          THREE REASONS
        </p>

        <div style={{ transform: `translateY(${subjectY}px)`, opacity: subjectOp }}>
          <h1 style={{
            fontFamily: FONTS.display, fontSize: 72, fontWeight: 900, lineHeight: 1.0,
            letterSpacing: -3, color: COLORS.offWhite, margin: '16px 0 0',
          }}>
            MR BEAST<br />OWNS YOUR<br />ATTENTION
          </h1>
        </div>

        {/* Horizontal rule */}
        <div style={{ height: 3, background: COLORS.gold, width: ruleW, maxWidth: W * 0.36, margin: '24px 0' }} />

        <p style={{
          fontFamily: FONTS.mono, fontSize: 14, color: 'rgba(240,237,232,0.5)',
          letterSpacing: 1, lineHeight: 1.6, margin: 0, opacity: tagOp,
        }}>
          RETENTION MECHANICS /<br />
          BEHAVIORAL ARCHITECTURE /<br />
          VIRAL ENGINEERING
        </p>
      </div>
    </AbsoluteFill>
  );
};
