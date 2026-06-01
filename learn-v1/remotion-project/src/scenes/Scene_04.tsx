// narrativeSlice: Other creators bury the premise — Mr Beast surfaces the payoff in the first breath
// visualMetaphor: Anatomical dissection of a video timeline — "buried" marker vs "surfaced" marker
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn, useSlideY, useExpand } from '../utils/interpolations';

export const Scene_04_meta = {
  id: 'Scene_04', duration: 210,
  narrativeSlice: 'Competitors bury the hook; Mr Beast puts the payoff in the first breath',
  visualMetaphor: 'Two timelines dissected side by side — buried vs surfaced promise markers',
  palette: [COLORS.black, COLORS.red, COLORS.liveGreen, COLORS.offWhite],
};

const TIMELINE_H = 60;
const TIMELINE_Y = H * 0.42;
const TIMELINE_X = SAFE;
const TL_W = W - SAFE * 2;

export const Scene_04: React.FC = () => {
  const f = useCurrentFrame();

  const titleOp  = useFadeIn(0, 20);
  const titleY   = useSlideY(28, 0, 18);

  // Top timeline — "other creators": hook buried at 35%
  const tl1W = useExpand(25, 50, TL_W);
  const tl1MarkerOp = useFadeIn(80, 15);
  const tl1MarkerX = TL_W * 0.35;

  // Bottom timeline — "Mr Beast": hook at 2%
  const tl2W = useExpand(55, 50, TL_W);
  const tl2MarkerOp = useFadeIn(110, 15);
  const tl2MarkerX = TL_W * 0.02;

  const compareOp = useFadeIn(140, 20);
  const arrowOp   = interpolate(f, [155, 180], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: COLORS.black, overflow: 'hidden' }}>
      {/* Title */}
      <div style={{ position: 'absolute', top: SAFE, left: SAFE, opacity: titleOp, transform: `translateY(${titleY}px)` }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 4, color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', margin: 0 }}>
          HOOK PLACEMENT ANALYSIS
        </p>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 58, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: '8px 0 0', lineHeight: 1.0 }}>
          WHERE IS THE<br />PROMISE BURIED?
        </h2>
      </div>

      {/* Timeline 1 — Others */}
      <div style={{ position: 'absolute', top: TIMELINE_Y - 50, left: TIMELINE_X }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: 3, color: COLORS.red, textTransform: 'uppercase', margin: '0 0 12px' }}>
          AVERAGE CREATOR
        </p>
        {/* Track */}
        <div style={{ width: tl1W, height: TIMELINE_H, background: '#1A1A1A', position: 'relative', overflow: 'visible' }}>
          {/* Segment fills */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: '35%', height: '100%', background: 'rgba(255,59,48,0.15)' }} />
          <div style={{ position: 'absolute', left: '35%', top: 0, width: '65%', height: '100%', background: 'rgba(255,255,255,0.04)' }} />
          <p style={{ position: 'absolute', left: '8%', top: '50%', transform: 'translateY(-50%)', fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(255,59,48,0.6)', margin: 0 }}>
            INTRO / CONTEXT / SETUP
          </p>
          {/* Hook marker */}
          <div style={{ position: 'absolute', left: `${tl1MarkerX}px`, top: -28, opacity: tl1MarkerOp }}>
            <div style={{ width: 3, height: TIMELINE_H + 56, background: COLORS.red, position: 'absolute', left: 0 }} />
            <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.red, margin: '0 0 4px 6px', letterSpacing: 1, whiteSpace: 'nowrap' }}>
              HOOK @ 35%
            </p>
          </div>
        </div>
      </div>

      {/* Timeline 2 — Mr Beast */}
      <div style={{ position: 'absolute', top: TIMELINE_Y + TIMELINE_H + 70, left: TIMELINE_X }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: 3, color: COLORS.liveGreen, textTransform: 'uppercase', margin: '0 0 12px' }}>
          MR. BEAST
        </p>
        <div style={{ width: tl2W, height: TIMELINE_H, background: '#1A1A1A', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '2%', height: '100%', background: 'rgba(0,255,135,0.4)' }} />
          <div style={{ position: 'absolute', left: '2%', top: 0, width: '98%', height: '100%', background: 'rgba(255,255,255,0.04)' }} />
          <p style={{ position: 'absolute', left: '10%', top: '50%', transform: 'translateY(-50%)', fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(0,255,135,0.6)', margin: 0 }}>
            FULL NARRATIVE — RETENTION MAINTAINED
          </p>
          {/* Hook marker */}
          <div style={{ position: 'absolute', left: `${tl2MarkerX}px`, top: -28, opacity: tl2MarkerOp }}>
            <div style={{ width: 3, height: TIMELINE_H + 56, background: COLORS.liveGreen, position: 'absolute', left: 0 }} />
            <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.liveGreen, margin: '0 0 4px 6px', letterSpacing: 1, whiteSpace: 'nowrap' }}>
              HOOK @ 2%
            </p>
          </div>
        </div>
      </div>

      {/* Comparison callout */}
      <div style={{ position: 'absolute', right: SAFE, bottom: SAFE + 30, textAlign: 'right', opacity: compareOp }}>
        <p style={{ fontFamily: FONTS.display, fontSize: 88, fontWeight: 900, lineHeight: 1, letterSpacing: -4, color: COLORS.offWhite, margin: 0 }}>
          17×
        </p>
        <p style={{ fontFamily: FONTS.mono, fontSize: 13, color: 'rgba(240,237,232,0.5)', margin: '8px 0 0', letterSpacing: 2 }}>
          EARLIER PROMISE DELIVERY
        </p>
      </div>
    </AbsoluteFill>
  );
};
