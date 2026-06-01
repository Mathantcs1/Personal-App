// REVISION: Scene_13_v2_camLeft
// PARENT: Scene_13.tsx
// CHANGE: All graphic elements compressed into left 35% of frame, clearing right 65% for webcam headshot overlay
// DATE: 2026-06-01
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H } from '../utils/tokens';
import { useFadeIn } from '../utils/interpolations';

// Left panel width = 35% of 1920 = 672px
const PANEL_W = W * 0.35;
const INNER_SAFE = 28;

const COMMENTS = [
  { text: 'BRO THE ENDING 😭',   delay: 30, y: H * 0.14 },
  { text: 'Chandler finally!!',  delay: 45, y: H * 0.26 },
  { text: 'I SCREAMED',          delay: 58, y: H * 0.38 },
  { text: 'No way 💀',           delay: 70, y: H * 0.50 },
  { text: '43M watching',        delay: 82, y: H * 0.62 },
  { text: 'cinema fr',           delay: 95, y: H * 0.74 },
];

export const Scene_13_v2_camLeft: React.FC = () => {
  const f = useCurrentFrame();

  const panelOp  = useFadeIn(0, 20);
  const titleOp  = useFadeIn(0, 18);
  const bgPulse  = interpolate(f, [0, 240], [0.05, 0.15], { extrapolateRight: 'clamp' });
  const notifCount = Math.min(Math.floor(f / 6), 999);

  // Comment floats — constrained to left panel x range
  const commentOps = COMMENTS.map(c => ({
    op: interpolate(f, [c.delay, c.delay + 14, c.delay + 90, c.delay + 110], [0, 1, 1, 0], { extrapolateRight: 'clamp' }),
    cy: interpolate(f, [c.delay, c.delay + 110], [c.y + 16, c.y - 16], { extrapolateRight: 'clamp' }),
  }));

  return (
    <AbsoluteFill style={{ background: 'transparent', overflow: 'hidden' }}>
      {/* Left panel — 35% width */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL_W, height: H, background: '#0D0D0D', opacity: panelOp }}>
        {/* Reactive glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(255,0,80,0.15), transparent 70%)', opacity: bgPulse }} />

        {/* Title */}
        <div style={{ position: 'absolute', top: 40, left: INNER_SAFE, right: INNER_SAFE, opacity: titleOp }}>
          <p style={{ fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 3, color: '#FF0050', textTransform: 'uppercase', margin: '0 0 8px' }}>
            ALGORITHM SIGNAL
          </p>
          <h2 style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 900, letterSpacing: -1, color: COLORS.offWhite, margin: 0, lineHeight: 1.0 }}>
            DESIGN THE<br />REACTION.
          </h2>
        </div>

        {/* Compact phone mockup */}
        {(() => {
          const PH = 280, PW = 140;
          const phoneOp = useFadeIn(5, 20);
          return (
            <div style={{ position: 'absolute', left: INNER_SAFE, top: H * 0.38, width: PW, height: PH, opacity: phoneOp }}>
              <div style={{ width: PW, height: PH, background: '#111', borderRadius: 20, border: '2px solid #222', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
                <div style={{ height: 24, background: '#000', display: 'flex', alignItems: 'center', padding: '0 8px', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 8, color: '#FFF' }}>9:41</span>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 8, color: '#FFF' }}>100%</span>
                </div>
                <div style={{ height: 24, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: FONTS.display, fontSize: 10, fontWeight: 900, color: '#FFF' }}>Comments</span>
                  <div style={{ background: '#FF0050', borderRadius: 8, padding: '1px 6px', marginLeft: 8 }}>
                    <span style={{ fontFamily: FONTS.mono, fontSize: 8, fontWeight: 900, color: '#FFF' }}>{notifCount > 99 ? '99+' : notifCount}</span>
                  </div>
                </div>
                {['😭😭', 'GOAT', 'Karl!', '43M!!', 'Cinema', 'crazy'].map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, padding: '5px 8px', opacity: f > (i + 1) * 20 ? 1 : 0 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: ['#6C63FF', '#FF6B00', '#00E5FF', '#A855F7', '#FF0050', '#FFD700'][i], flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontFamily: FONTS.body, fontSize: 9, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{c}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Floating mini comments */}
        {COMMENTS.map((c, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: INNER_SAFE + 150,
            top: commentOps[i].cy,
            opacity: commentOps[i].op,
            maxWidth: PANEL_W - INNER_SAFE - 160,
          }}>
            <div style={{ background: 'rgba(20,20,20,0.92)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '5px 10px' }}>
              <span style={{ fontFamily: FONTS.body, fontSize: 11, color: COLORS.offWhite, whiteSpace: 'nowrap' }}>{c.text}</span>
            </div>
          </div>
        ))}

        {/* Big counter bottom */}
        <div style={{ position: 'absolute', bottom: 36, left: INNER_SAFE, opacity: useFadeIn(140, 20) }}>
          <p style={{ fontFamily: FONTS.display, fontSize: 38, fontWeight: 900, color: '#FF0050', margin: 0, lineHeight: 1, letterSpacing: -2 }}>2.4M</p>
          <p style={{ fontFamily: FONTS.mono, fontSize: 9, color: 'rgba(255,255,255,0.35)', margin: '4px 0 0', letterSpacing: 2 }}>COMMENTS/24H</p>
        </div>
      </div>

      {/* Right 65% — intentionally empty for webcam */}
      {/* Thin separator line */}
      <div style={{ position: 'absolute', left: PANEL_W, top: 0, width: 2, height: H, background: 'rgba(255,0,80,0.3)' }} />
    </AbsoluteFill>
  );
};
