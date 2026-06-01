// narrativeSlice: Mr Beast videos follow an exponential stakes ladder — each beat dwarfs the last
// visualMetaphor: ESPN-style animated scoreboard with escalating dollar counters per round
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn, useCounter } from '../utils/interpolations';

export const Scene_07_meta = {
  id: 'Scene_07', duration: 270,
  narrativeSlice: 'Every beat in a Mr Beast video is larger than the one before — exponential stakes ladder',
  visualMetaphor: 'ESPN scoreboard — rounds climbing with exponentially bigger prize amounts',
  palette: ['#0A1628', COLORS.gold, COLORS.offWhite, COLORS.dataBlue],
};

const ROUNDS = [
  { label: 'ROUND 1', amount: 1000,   subtitle: 'ENTRY HOOK',       delay: 10 },
  { label: 'ROUND 2', amount: 5000,   subtitle: 'TENSION BEAT',     delay: 50 },
  { label: 'ROUND 3', amount: 25000,  subtitle: 'ESCALATION PEAK',  delay: 90 },
  { label: 'ROUND 4', amount: 100000, subtitle: 'CLIMAX MOMENT',    delay: 130 },
  { label: 'FINAL',   amount: 250000, subtitle: 'THE PROMISED END', delay: 170 },
];

export const Scene_07: React.FC = () => {
  const f = useCurrentFrame();

  const blinkOp = Math.sin(f * 0.25) > 0 ? 1 : 0.3;
  const headerOp = useFadeIn(0, 15);

  const rowOps = ROUNDS.map(r =>
    interpolate(f, [r.delay, r.delay + 20], [0, 1], { extrapolateRight: 'clamp' })
  );
  const counters = ROUNDS.map(r =>
    useCounter(r.amount, r.delay + 5, 35)
  );
  const barWidths = ROUNDS.map(r =>
    interpolate(f, [r.delay + 10, r.delay + 50], [0, 100], { extrapolateRight: 'clamp' })
  );
  const maxAmount = ROUNDS[ROUNDS.length - 1].amount;

  return (
    <AbsoluteFill style={{ background: '#0A1628', overflow: 'hidden' }}>
      {/* Top ESPN-style banner */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 72, background: '#071020', borderBottom: `3px solid ${COLORS.gold}`, display: 'flex', alignItems: 'center', padding: `0 ${SAFE}px`, justifyContent: 'space-between', opacity: headerOp }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ background: COLORS.gold, padding: '6px 14px' }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 13, fontWeight: 900, color: COLORS.black, letterSpacing: 3 }}>STAKES LADDER</span>
          </div>
          <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.offWhite, letterSpacing: 2 }}>
            MR. BEAST — ESCALATION ANALYSIS
          </span>
        </div>
        <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.gold, letterSpacing: 2, opacity: blinkOp }}>
          ● LIVE BREAKDOWN
        </span>
      </div>

      {/* Round rows */}
      <div style={{ position: 'absolute', top: 100, left: SAFE, right: SAFE }}>
        {ROUNDS.map((round, i) => {
          const barPct = barWidths[i] * (round.amount / maxAmount);
          const isLast = i === ROUNDS.length - 1;
          return (
            <div key={i} style={{
              height: 80, display: 'flex', alignItems: 'center', gap: 24,
              borderBottom: `1px solid rgba(255,255,255,0.06)`,
              opacity: rowOps[i], padding: '0 0 0 0',
            }}>
              {/* Round label */}
              <div style={{ width: 120, flexShrink: 0 }}>
                <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 3, color: isLast ? COLORS.gold : COLORS.dataBlue, textTransform: 'uppercase', margin: 0 }}>
                  {round.label}
                </p>
                <p style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>
                  {round.subtitle}
                </p>
              </div>
              {/* Bar */}
              <div style={{ flex: 1, height: 28, background: 'rgba(255,255,255,0.06)', position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: `${barPct}%`,
                  background: isLast
                    ? `linear-gradient(90deg, ${COLORS.gold}, #FFD700)`
                    : `linear-gradient(90deg, ${COLORS.dataBlue}, rgba(79,195,247,0.6))`,
                }} />
              </div>
              {/* Amount */}
              <div style={{ width: 160, textAlign: 'right', flexShrink: 0 }}>
                <span style={{
                  fontFamily: FONTS.display, fontSize: isLast ? 36 : 28, fontWeight: 900,
                  color: isLast ? COLORS.gold : COLORS.offWhite, letterSpacing: -1,
                }}>
                  ${Math.round(counters[i]).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom ticker */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 44, background: COLORS.gold, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{
          display: 'flex', gap: 80, whiteSpace: 'nowrap',
          transform: `translateX(${interpolate(f, [0, 240], [0, -W], { extrapolateRight: 'clamp' })}px)`,
        }}>
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} style={{ fontFamily: FONTS.mono, fontSize: 14, fontWeight: 900, color: COLORS.black, letterSpacing: 3, textTransform: 'uppercase' }}>
              ESCALATION IS NOT OPTIONAL — ESCALATION IS THE PRODUCT — STAKES × TIME = RETENTION —
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
