// narrativeSlice: The scale of the operation — Mr Beast is not a creator, he is a media production infrastructure
// visualMetaphor: Brutalist grid infrastructure — modular concrete blocks clicking into a massive superstructure
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn } from '../utils/interpolations';

export const Scene_17_meta = {
  id: 'Scene_17', duration: 270,
  narrativeSlice: 'Mr Beast is not a creator — he is a vertically integrated media infrastructure',
  visualMetaphor: 'Brutalist modular concrete blocks assembling into a complete superstructure',
  palette: ['#141210', '#302A26', '#7A6F68', COLORS.offWhite, COLORS.gold],
};

const BLOCKS = [
  { label: 'PRODUCTION\nSTUDIO',    w: 320, h: 200, row: 0, col: 0, delay: 10 },
  { label: 'EDITING\nSUITE',        w: 200, h: 200, row: 0, col: 1, delay: 25 },
  { label: 'AUDIENCE\nDATA',        w: 260, h: 160, row: 1, col: 0, delay: 40 },
  { label: 'BRAND\nPARTNERSHIPS',   w: 260, h: 160, row: 1, col: 1, delay: 55 },
  { label: 'MRBEAST\nBURGER',       w: 180, h: 160, row: 2, col: 0, delay: 70 },
  { label: 'FEASTABLES',            w: 300, h: 120, row: 2, col: 1, delay: 85 },
  { label: 'BEAST\nPHILANTHROPY',   w: 480, h: 120, row: 3, col: 0, delay: 100 },
];

export const Scene_17: React.FC = () => {
  const f = useCurrentFrame();

  const titleOp = useFadeIn(0, 20);
  const bgOp    = useFadeIn(0, 30);

  // Calculate grid layout
  let curX = SAFE, curY = H * 0.28;
  let rowMaxH = 0;
  let prevRow = 0;
  const positions: {x: number, y: number}[] = [];

  BLOCKS.forEach((b, i) => {
    if (b.row !== prevRow) {
      curX = SAFE;
      curY += rowMaxH + 8;
      rowMaxH = 0;
      prevRow = b.row;
    }
    positions.push({ x: curX, y: curY });
    curX += b.w + 8;
    rowMaxH = Math.max(rowMaxH, b.h);
  });

  const blockOps = BLOCKS.map(b =>
    interpolate(f, [b.delay, b.delay + 20], [0, 1], { extrapolateRight: 'clamp' })
  );
  const blockY = BLOCKS.map(b =>
    interpolate(f, [b.delay, b.delay + 25], [-b.h, 0], { extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 4) })
  );

  const finalOp = useFadeIn(190, 25);

  return (
    <AbsoluteFill style={{ background: '#141210', overflow: 'hidden' }}>
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.03 }} width={W} height={H}>
        <filter id="noise17"><feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="4" /></filter>
        <rect width={W} height={H} filter="url(#noise17)" />
      </svg>

      {/* Title */}
      <div style={{ position: 'absolute', top: SAFE, left: SAFE, opacity: titleOp }}>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 46, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: 0, lineHeight: 1.0 }}>
          NOT A CREATOR.<br />AN INFRASTRUCTURE.
        </h2>
      </div>

      {/* Building blocks */}
      {BLOCKS.map((b, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: positions[i].x,
          top: positions[i].y + blockY[i],
          width: b.w, height: b.h,
          background: '#302A26',
          border: '1px solid #3E3732',
          opacity: blockOps[i],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {/* Horizontal Ando band */}
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(122,111,104,0.3)' }} />
          <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 3, color: '#7A6F68', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0, position: 'relative' }}>
            {b.label}
          </p>
        </div>
      ))}

      {/* Final statement */}
      <div style={{ position: 'absolute', right: SAFE, bottom: SAFE + 30, textAlign: 'right', opacity: finalOp }}>
        <div style={{ width: W * 0.3, height: 3, background: COLORS.gold, marginLeft: 'auto', marginBottom: 20 }} />
        <p style={{ fontFamily: FONTS.display, fontSize: 52, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: 0, lineHeight: 1.0 }}>
          EVERY BLOCK<br />IS LOAD-BEARING.
        </p>
      </div>
    </AbsoluteFill>
  );
};
