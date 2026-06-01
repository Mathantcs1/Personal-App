// narrativeSlice: The editing rhythm is weaponized — cuts happen at exactly the moment interest begins to decay
// visualMetaphor: War room telemetry board — cut timing mapped to viewer attention decay curve
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn, useSlideY } from '../utils/interpolations';

export const Scene_09_meta = {
  id: 'Scene_09', duration: 240,
  narrativeSlice: 'Cuts are timed to fire precisely as viewer attention begins its natural decay',
  visualMetaphor: 'War room telemetry — attention decay curve with cut-fire markers overlaid',
  palette: ['#080810', COLORS.dataBlue, COLORS.gold, COLORS.offWhite],
};

const CUT_EVENTS = [
  { frame: 20,  label: 'CUT 01 — RE-ENGAGE', x: 0.08  },
  { frame: 50,  label: 'CUT 02 — NEW ANGLE', x: 0.22  },
  { frame: 85,  label: 'CUT 03 — ESCALATE',  x: 0.38  },
  { frame: 115, label: 'CUT 04 — SUBVERT',   x: 0.52  },
  { frame: 150, label: 'CUT 05 — REVEAL',    x: 0.68  },
  { frame: 185, label: 'CUT 06 — CLIMAX',    x: 0.82  },
];

export const Scene_09: React.FC = () => {
  const f = useCurrentFrame();

  const titleOp = useFadeIn(0, 18);
  const titleY  = useSlideY(25, 0, 18);

  const chartX = SAFE;
  const chartY = H * 0.32;
  const chartW = W - SAFE * 2;
  const chartH = H * 0.42;

  // Natural attention decay curve
  const decayCurve = (): string => {
    const pts: string[] = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const progress = f / 240;
      if (t > progress) break;
      const x = chartX + t * chartW;
      // Attention: high → decays with micro-spikes at cut points
      let attn = 0.9 * Math.exp(-t * 0.5) + 0.1;
      // Add cut recovery spikes
      for (const evt of CUT_EVENTS) {
        const ct = evt.x;
        const dist = t - ct;
        if (dist >= 0 && dist < 0.06) {
          attn += 0.2 * Math.exp(-dist * 40);
        }
      }
      attn = Math.min(attn, 0.98);
      const y = chartY + chartH * (1 - attn);
      pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return pts.join(' ');
  };

  // Attention without cuts (ghost line)
  const ghostCurve = (): string => {
    const pts: string[] = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = chartX + t * chartW;
      const attn = 0.9 * Math.exp(-t * 1.8) + 0.05;
      const y = chartY + chartH * (1 - attn);
      pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return pts.join(' ');
  };

  return (
    <AbsoluteFill style={{ background: '#080810', overflow: 'hidden' }}>
      {/* Title */}
      <div style={{ position: 'absolute', top: SAFE, left: SAFE, opacity: titleOp, transform: `translateY(${titleY}px)` }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 4, color: COLORS.dataBlue, textTransform: 'uppercase', margin: 0 }}>
          EDITING WEAPONS SYSTEM — CUT TELEMETRY
        </p>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 54, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: '8px 0 0', lineHeight: 1.0 }}>
          THE CUT FIRES BEFORE<br />YOUR BRAIN GETS BORED
        </h2>
      </div>

      {/* Chart */}
      <svg style={{ position: 'absolute', top: 0, left: 0 }} width={W} height={H}>
        {/* Ghost curve — no cuts */}
        <path d={ghostCurve()} fill="none" stroke="rgba(255,59,48,0.25)" strokeWidth={2} strokeDasharray="6 4" />
        {/* Cut-reinforced curve */}
        <path d={decayCurve()} fill="none" stroke={COLORS.dataBlue} strokeWidth={3.5} />

        {/* Axis */}
        <line x1={chartX} y1={chartY} x2={chartX} y2={chartY + chartH + 10} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        <line x1={chartX} y1={chartY + chartH} x2={chartX + chartW + 10} y2={chartY + chartH} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

        {/* Y axis labels */}
        {[100, 75, 50, 25].map((pct, i) => (
          <text key={i} x={chartX - 12} y={chartY + chartH * (1 - pct / 100) + 4}
            fill="rgba(255,255,255,0.25)" fontFamily={FONTS.mono} fontSize={11} textAnchor="end">
            {pct}%
          </text>
        ))}

        {/* Cut event markers */}
        {CUT_EVENTS.map((evt, i) => {
          if (f < evt.frame) return null;
          const x = chartX + evt.x * chartW;
          const markerOp = interpolate(f, [evt.frame, evt.frame + 12], [0, 1], { extrapolateRight: 'clamp' });
          return (
            <g key={i} opacity={markerOp}>
              <line x1={x} y1={chartY - 20} x2={x} y2={chartY + chartH} stroke={COLORS.gold} strokeWidth={1.5} strokeDasharray="3 3" />
              <polygon points={`${x},${chartY + chartH + 8} ${x - 6},${chartY + chartH + 20} ${x + 6},${chartY + chartH + 20}`} fill={COLORS.gold} />
              <text x={x} y={chartY - 28} textAnchor="middle" fill={COLORS.gold} fontFamily={FONTS.mono} fontSize={10} letterSpacing={1}>
                ✂
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <line x1={W - SAFE - 200} y1={chartY - 30} x2={W - SAFE - 160} y2={chartY - 30} stroke={COLORS.dataBlue} strokeWidth={3} />
        <text x={W - SAFE - 152} y={chartY - 26} fill={COLORS.dataBlue} fontFamily={FONTS.mono} fontSize={11}>WITH CUTS</text>
        <line x1={W - SAFE - 200} y1={chartY - 10} x2={W - SAFE - 160} y2={chartY - 10} stroke="rgba(255,59,48,0.5)" strokeWidth={2} strokeDasharray="6 4" />
        <text x={W - SAFE - 152} y={chartY - 6} fill="rgba(255,59,48,0.7)" fontFamily={FONTS.mono} fontSize={11}>WITHOUT CUTS</text>
      </svg>
    </AbsoluteFill>
  );
};
