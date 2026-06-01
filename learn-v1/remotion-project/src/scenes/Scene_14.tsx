// narrativeSlice: Rewatch value — scenes are dense enough to reward multiple viewings, boosting algorithmic weight
// visualMetaphor: High-speed timeline timeline scrub UI, multiple hidden detail layers being discovered
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn } from '../utils/interpolations';

export const Scene_14_meta = {
  id: 'Scene_14', duration: 240,
  narrativeSlice: 'Rewatch bait is embedded — dense detail layers reward return viewers and boost algorithmic weight',
  visualMetaphor: 'Video scrub UI revealing hidden annotation layers on re-watch',
  palette: ['#080808', COLORS.purple, COLORS.gold, COLORS.offWhite],
};

const HIDDEN_DETAILS = [
  { time: '0:04', note: 'Background sign foreshadows winner',    x: 0.04, y: 0.55, layer: 1 },
  { time: '1:22', note: 'Chandler's micro-expression tells all', x: 0.22, y: 0.42, layer: 2 },
  { time: '2:41', note: 'Hidden rule exploit telegraphed here',  x: 0.41, y: 0.58, layer: 1 },
  { time: '3:58', note: 'Easter egg: Beast's merch in frame',    x: 0.58, y: 0.44, layer: 3 },
  { time: '5:13', note: 'Outcome told in background crowd',      x: 0.73, y: 0.6,  layer: 2 },
];

export const Scene_14: React.FC = () => {
  const f = useCurrentFrame();

  const titleOp   = useFadeIn(0, 18);
  const playerOp  = useFadeIn(10, 20);

  // Scrubhead position oscillates, revealing layers
  const scrubX = interpolate(f, [20, 200], [0, W - SAFE * 2], { extrapolateRight: 'clamp', easing: (t) => t });

  // Each detail annotation appears as scrub passes it
  const detailOps = HIDDEN_DETAILS.map(d => {
    const triggerX = d.x * (W - SAFE * 2);
    return interpolate(f - 20, [0, 240], [0, W - SAFE * 2]) >= triggerX
      ? interpolate(f, [20 + d.x * 180, 20 + d.x * 180 + 15], [0, 1], { extrapolateRight: 'clamp' })
      : 0;
  });

  const PLAYER_Y = H * 0.3;
  const PLAYER_H = H * 0.42;

  return (
    <AbsoluteFill style={{ background: '#080808', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(168,85,247,0.07), transparent 65%)', opacity: useFadeIn(0, 30) }} />

      {/* Title */}
      <div style={{ position: 'absolute', top: SAFE, left: SAFE, opacity: titleOp }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 4, color: COLORS.purple, textTransform: 'uppercase', margin: 0 }}>
          REWATCH ARCHITECTURE
        </p>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 56, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: '8px 0 0', lineHeight: 1.0 }}>
          EVERY FRAME<br />IS A PUZZLE PIECE
        </h2>
      </div>

      {/* Player mockup */}
      <div style={{ position: 'absolute', left: SAFE, top: PLAYER_Y, width: W - SAFE * 2, height: PLAYER_H, opacity: playerOp }}>
        {/* Video area */}
        <div style={{ width: '100%', height: PLAYER_H - 60, background: '#111', position: 'relative', overflow: 'hidden' }}>
          {/* Simulated video frame content */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1A0A2E, #0A1428)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <p style={{ fontFamily: FONTS.display, fontSize: 48, fontWeight: 900, color: 'rgba(255,255,255,0.08)', textAlign: 'center', margin: 0 }}>▶</p>
          </div>

          {/* Annotation pins — appear as scrub reveals them */}
          {HIDDEN_DETAILS.map((d, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${d.x * 100}%`,
              top: `${d.y * 100}%`,
              opacity: detailOps[i],
              transform: 'translate(-50%, -50%)',
            }}>
              {/* Pin */}
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: COLORS.purple, border: `2px solid ${COLORS.offWhite}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 900, color: '#FFF' }}>{d.layer}</span>
              </div>
              {/* Tooltip */}
              <div style={{ position: 'absolute', left: 36, top: -8, background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: 8, padding: '8px 14px', width: 220, whiteSpace: 'normal' }}>
                <p style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.purple, margin: '0 0 3px', letterSpacing: 2 }}>{d.time}</p>
                <p style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.offWhite, margin: 0, lineHeight: 1.4 }}>{d.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Scrub bar */}
        <div style={{ height: 60, background: '#0E0E0E', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, position: 'relative' }}>
          <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>◀◀</span>
          <div style={{ flex: 1, height: 6, background: '#2A2A2A', borderRadius: 3, position: 'relative' }}>
            {/* Progress fill */}
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: scrubX / (W - SAFE * 2 - 100) * 100 + '%', background: COLORS.purple, borderRadius: 3 }} />
            {/* Scrub head */}
            <div style={{ position: 'absolute', top: '50%', left: scrubX / (W - SAFE * 2 - 100) * 100 + '%', transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', background: '#FFF', boxShadow: `0 0 12px ${COLORS.purple}` }} />
            {/* Marker ticks for hidden details */}
            {HIDDEN_DETAILS.map((d, i) => (
              <div key={i} style={{ position: 'absolute', left: `${d.x * 100}%`, top: -6, width: 2, height: 18, background: COLORS.gold, opacity: 0.6 }} />
            ))}
          </div>
          <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>▶▶</span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.purple, letterSpacing: 1 }}>LAYER VIEW</span>
        </div>
      </div>

      {/* Right callout */}
      <div style={{ position: 'absolute', right: SAFE, bottom: SAFE + 20, textAlign: 'right', opacity: useFadeIn(150, 20) }}>
        <p style={{ fontFamily: FONTS.display, fontSize: 64, fontWeight: 900, color: COLORS.purple, margin: 0, letterSpacing: -3 }}>3.2×</p>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(240,237,232,0.35)', margin: '6px 0 0', letterSpacing: 3 }}>AVG REWATCH RATE</p>
      </div>
    </AbsoluteFill>
  );
};
