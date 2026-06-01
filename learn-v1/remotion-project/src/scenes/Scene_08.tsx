// narrativeSlice: Flat pacing = death — Mr Beast injects a micro-shock every 90 seconds max
// visualMetaphor: EKG heart monitor — flatline interrupted by defibrillator spike events
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn } from '../utils/interpolations';

export const Scene_08_meta = {
  id: 'Scene_08', duration: 240,
  narrativeSlice: 'Flat pacing is a kill signal — micro-shocks injected every 90 seconds keep the heart beating',
  visualMetaphor: 'EKG flatline broken by defibrillator events at regular intervals',
  palette: ['#020C04', COLORS.red, COLORS.liveGreen, COLORS.offWhite],
};

const SHOCK_FRAMES = [40, 100, 160, 210];

export const Scene_08: React.FC = () => {
  const f = useCurrentFrame();

  const headerOp = useFadeIn(0, 15);
  const ekgOp    = useFadeIn(10, 20);
  const labelOp  = useFadeIn(180, 20);

  // Generate EKG path
  const buildEKG = (): string => {
    const yBase = H * 0.52;
    const pts: string[] = [`M ${SAFE} ${yBase}`];
    const totalW = W - SAFE * 2;
    const steps = 600;

    for (let i = 1; i <= steps; i++) {
      const progress = i / steps;
      const px = f / 240;
      if (progress > px) break;

      const x = SAFE + progress * totalW;
      const frameAtX = progress * 240;

      let y = yBase;
      // Check proximity to shock event
      let shockActive = false;
      for (const sf of SHOCK_FRAMES) {
        const dist = frameAtX - sf;
        if (dist >= -1 && dist < 15) {
          const phase = (dist + 1) / 16;
          if (phase < 0.2)       y = yBase - 80 * (phase / 0.2);
          else if (phase < 0.35) y = yBase + 60 * ((phase - 0.2) / 0.15);
          else if (phase < 0.5)  y = yBase - 120 * ((phase - 0.35) / 0.15);
          else if (phase < 0.65) y = yBase + 40 * ((phase - 0.5) / 0.15);
          else                   y = yBase + 10 * Math.exp(-(phase - 0.65) * 20) * Math.sin((phase - 0.65) * 60);
          shockActive = true;
          break;
        }
      }
      if (!shockActive) {
        y = yBase + Math.sin(frameAtX * 0.8) * 4;
      }
      pts.push(`L ${x} ${y}`);
    }
    return pts.join(' ');
  };

  const shockFlashOp = SHOCK_FRAMES.reduce((acc, sf) => {
    const dist = Math.abs(f - sf);
    return Math.max(acc, dist < 8 ? interpolate(dist, [0, 8], [0.3, 0]) : 0);
  }, 0);

  return (
    <AbsoluteFill style={{ background: '#020C04', overflow: 'hidden' }}>
      {/* Shock flash overlay */}
      <div style={{ position: 'absolute', inset: 0, background: COLORS.red, opacity: shockFlashOp, pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ position: 'absolute', top: SAFE, left: SAFE, opacity: headerOp }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 4, color: COLORS.red, textTransform: 'uppercase', margin: 0 }}>
          PACING VITALS MONITOR
        </p>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 58, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: '8px 0 0', lineHeight: 1.0 }}>
          FLATLINE KILLS.<br />SHOCKS REVIVE.
        </h2>
      </div>

      {/* EKG monitor */}
      <div style={{ position: 'absolute', top: H * 0.35, left: 0, right: 0, opacity: ekgOp }}>
        {/* Monitor frame */}
        <div style={{ margin: `0 ${SAFE}px`, border: `1px solid rgba(0,255,135,0.2)`, background: '#040F06', padding: '20px 0' }}>
          <svg width={W - SAFE * 2} height={220} style={{ display: 'block' }}>
            {/* Grid */}
            {Array.from({ length: 10 }, (_, i) => (
              <line key={i} x1={0} y1={(i + 1) * 20} x2={W - SAFE * 2} y2={(i + 1) * 20}
                stroke="rgba(0,255,135,0.06)" strokeWidth={1} />
            ))}
            {/* EKG trace */}
            <path d={buildEKG().replace(new RegExp(`^M ${SAFE}`, ''), 'M 0')} fill="none" stroke={COLORS.liveGreen} strokeWidth={2.5} />
            {/* Shock markers */}
            {SHOCK_FRAMES.map((sf, i) => {
              const x = ((sf / 240) * (W - SAFE * 2));
              const arrived = f >= sf;
              return arrived ? (
                <g key={i}>
                  <line x1={x} y1={0} x2={x} y2={220} stroke={COLORS.red} strokeWidth={1} strokeDasharray="4 4" opacity={0.5} />
                  <text x={x + 6} y={18} fill={COLORS.red} fontFamily={FONTS.mono} fontSize={10} letterSpacing={1}>
                    SHOCK
                  </text>
                </g>
              ) : null;
            })}
          </svg>
        </div>
      </div>

      {/* Bottom readouts */}
      <div style={{ position: 'absolute', bottom: SAFE + 20, left: SAFE, display: 'flex', gap: 48, opacity: labelOp }}>
        <div>
          <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(0,255,135,0.5)', letterSpacing: 2, margin: '0 0 4px', textTransform: 'uppercase' }}>SHOCK INTERVAL</p>
          <p style={{ fontFamily: FONTS.display, fontSize: 40, fontWeight: 900, color: COLORS.liveGreen, margin: 0, letterSpacing: -2 }}>≤90s</p>
        </div>
        <div>
          <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(255,59,48,0.5)', letterSpacing: 2, margin: '0 0 4px', textTransform: 'uppercase' }}>FLATLINE TOLERANCE</p>
          <p style={{ fontFamily: FONTS.display, fontSize: 40, fontWeight: 900, color: COLORS.red, margin: 0, letterSpacing: -2 }}>ZERO</p>
        </div>
        <div>
          <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(240,237,232,0.4)', letterSpacing: 2, margin: '0 0 4px', textTransform: 'uppercase' }}>EVENTS/VIDEO</p>
          <p style={{ fontFamily: FONTS.display, fontSize: 40, fontWeight: 900, color: COLORS.offWhite, margin: 0, letterSpacing: -2 }}>8–14</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
