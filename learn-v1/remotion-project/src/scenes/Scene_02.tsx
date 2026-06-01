// narrativeSlice: Most creators bleed viewers in the first 8 seconds — Mr Beast almost never does
// visualMetaphor: Two retention graphs diverge dramatically — one flatlines, one holds a ridge like a cliff edge
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn, useSlideY, useCounter } from '../utils/interpolations';

export const Scene_02_meta = {
  id: 'Scene_02', duration: 240,
  narrativeSlice: 'Average creators lose 60% of viewers by second 8. Mr Beast retains.',
  visualMetaphor: 'Two diverging retention curves — cliff vs plateau',
  palette: [COLORS.black, COLORS.red, COLORS.liveGreen, COLORS.offWhite],
};

export const Scene_02: React.FC = () => {
  const f = useCurrentFrame();

  const titleOp  = useFadeIn(0, 20);
  const titleY   = useSlideY(30, 0, 20);
  const axisOp   = useFadeIn(20, 15);
  const avgDraw  = interpolate(f, [35, 140], [0, 1], { extrapolateRight: 'clamp' });
  const mbDraw   = interpolate(f, [60, 160], [0, 1], { extrapolateRight: 'clamp' });
  const labelOp  = useFadeIn(160, 20);
  const statOp   = useFadeIn(170, 20);
  const statCount= useCounter(62, 170, 40);

  const chartX = SAFE + 20;
  const chartY = H * 0.25;
  const chartW = W * 0.58;
  const chartH = H * 0.52;

  // Average creator curve — drops sharply
  const avgCurve = (): string => {
    const pts: string[] = [`M ${chartX} ${chartY}`];
    const steps = 80;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = chartX + t * chartW;
      // Steep drop curve
      const retention = Math.pow(1 - t, 0.4) * 0.95;
      const y = chartY + chartH * (1 - retention);
      pts.push(`L ${x} ${y}`);
    }
    return pts.join(' ');
  };

  // Mr Beast curve — holds high, gentle slope
  const mbCurve = (): string => {
    const pts: string[] = [`M ${chartX} ${chartY}`];
    const steps = 80;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = chartX + t * chartW;
      const retention = 0.92 - t * 0.18 + Math.sin(t * Math.PI * 3) * 0.02;
      const y = chartY + chartH * (1 - retention);
      pts.push(`L ${x} ${y}`);
    }
    return pts.join(' ');
  };

  const avgFullLength = 500;
  const mbFullLength  = 500;

  return (
    <AbsoluteFill style={{ background: COLORS.black, overflow: 'hidden' }}>
      {/* Title */}
      <div style={{ position: 'absolute', top: SAFE, left: SAFE, opacity: titleOp, transform: `translateY(${titleY}px)` }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 4, color: COLORS.gold, textTransform: 'uppercase', margin: 0 }}>
          RETENTION FORENSICS — EXHIBIT A
        </p>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 52, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: '8px 0 0', lineHeight: 1.0 }}>
          THE DIVERGENCE
        </h2>
      </div>

      {/* Chart area */}
      <svg style={{ position: 'absolute', top: 0, left: 0, opacity: axisOp }} width={W} height={H}>
        {/* Axis lines */}
        <line x1={chartX} y1={chartY} x2={chartX} y2={chartY + chartH + 10} stroke={COLORS.border} strokeWidth={2} />
        <line x1={chartX - 10} y1={chartY + chartH} x2={chartX + chartW + 20} y2={chartY + chartH} stroke={COLORS.border} strokeWidth={2} />
        {/* Y axis labels */}
        {[100, 75, 50, 25, 0].map((pct, i) => (
          <text key={i} x={chartX - 16} y={chartY + chartH * (1 - pct / 100) + 5}
            fill="rgba(240,237,232,0.35)" fontFamily={FONTS.mono} fontSize={12} textAnchor="end">
            {pct}%
          </text>
        ))}
        {/* X axis labels */}
        {['0s', '30s', '60s', '90s', '2min'].map((lbl, i) => (
          <text key={i} x={chartX + (i / 4) * chartW} y={chartY + chartH + 28}
            fill="rgba(240,237,232,0.35)" fontFamily={FONTS.mono} fontSize={12} textAnchor="middle">
            {lbl}
          </text>
        ))}
        {/* Average creator curve — red */}
        <path d={avgCurve()} fill="none" stroke={COLORS.red} strokeWidth={3}
          strokeDasharray={avgFullLength} strokeDashoffset={avgFullLength * (1 - avgDraw)} />
        {/* Mr Beast curve — green */}
        <path d={mbCurve()} fill="none" stroke={COLORS.liveGreen} strokeWidth={4}
          strokeDasharray={mbFullLength} strokeDashoffset={mbFullLength * (1 - mbDraw)} />
      </svg>

      {/* Legend */}
      <div style={{ position: 'absolute', left: chartX + chartW + 40, top: chartY + 20, opacity: labelOp }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ width: 32, height: 4, background: COLORS.liveGreen, marginRight: 12 }} />
          <p style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.liveGreen, margin: 0 }}>MR. BEAST</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 32, height: 4, background: COLORS.red, marginRight: 12 }} />
          <p style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.red, margin: 0 }}>AVERAGE CREATOR</p>
        </div>
      </div>

      {/* Big stat */}
      <div style={{ position: 'absolute', right: SAFE, bottom: SAFE + 40, textAlign: 'right', opacity: statOp }}>
        <p style={{ fontFamily: FONTS.display, fontSize: 120, fontWeight: 900, color: COLORS.red, margin: 0, lineHeight: 1, letterSpacing: -6 }}>
          {Math.round(statCount)}%
        </p>
        <p style={{ fontFamily: FONTS.mono, fontSize: 13, color: 'rgba(240,237,232,0.5)', margin: '8px 0 0', letterSpacing: 2 }}>
          VIEWERS LOST BY OTHERS<br />IN FIRST 8 SECONDS
        </p>
      </div>
    </AbsoluteFill>
  );
};
