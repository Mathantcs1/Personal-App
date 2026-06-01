// narrativeSlice: The comment section is a retention weapon — Mr Beast designs moments that force reaction
// visualMetaphor: Mobile UI with comment notifications exploding in — reaction storm visualization
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H } from '../utils/tokens';
import { useFadeIn } from '../utils/interpolations';

export const Scene_13_meta = {
  id: 'Scene_13', duration: 240,
  narrativeSlice: 'Designed reaction moments force comment floods — comments signal the algorithm for distribution',
  visualMetaphor: 'Comment notification storm — reaction explosion from a single video moment',
  palette: ['#0D0D0D', '#FF0050', COLORS.dataBlue, COLORS.offWhite],
};

const COMMENTS = [
  { text: 'BRO THE ENDING 😭😭',         delay: 30,  x: W * 0.38, y: H * 0.15 },
  { text: 'Chandler finally won!!',       delay: 45,  x: W * 0.62, y: H * 0.22 },
  { text: 'I SCREAMED',                   delay: 55,  x: W * 0.44, y: H * 0.35 },
  { text: 'No way that happened 💀',      delay: 65,  x: W * 0.7,  y: H * 0.42 },
  { text: '43M watching this rn',        delay: 75,  x: W * 0.36, y: H * 0.52 },
  { text: 'This is literally cinema',    delay: 85,  x: W * 0.65, y: H * 0.58 },
  { text: 'repeat after me: GOAT',       delay: 95,  x: W * 0.42, y: H * 0.68 },
  { text: '2.4M comments in 24 hours',   delay: 110, x: W * 0.6,  y: H * 0.76 },
];

export const Scene_13: React.FC = () => {
  const f = useCurrentFrame();

  const titleOp = useFadeIn(0, 18);
  const bgPulse = interpolate(f, [0, 240], [0.05, 0.12], { extrapolateRight: 'clamp' });

  // Phone on left
  const PH = 680, PW = 340;
  const phoneOp = useFadeIn(5, 20);

  // Notification counter
  const notifCount = Math.min(Math.floor(f / 6), 999);

  return (
    <AbsoluteFill style={{ background: '#0D0D0D', overflow: 'hidden' }}>
      {/* Reactive glow pulse */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(255,0,80,0.15), transparent 60%)', opacity: bgPulse }} />

      {/* Title — right side */}
      <div style={{ position: 'absolute', right: 80, top: H * 0.15, width: W * 0.32, opacity: titleOp }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 4, color: '#FF0050', textTransform: 'uppercase', margin: '0 0 12px' }}>
          ALGORITHM SIGNAL
        </p>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 54, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: 0, lineHeight: 1.0 }}>
          DESIGN THE<br />REACTION.<br />THE ALGORITHM<br />DOES THE REST.
        </h2>
      </div>

      {/* Phone mockup */}
      <div style={{ position: 'absolute', left: 80, top: H * 0.5 - PH * 0.5, width: PW, height: PH, opacity: phoneOp }}>
        <div style={{ width: PW, height: PH, background: '#111', borderRadius: 40, border: '3px solid #222', overflow: 'hidden', boxShadow: '0 30px 100px rgba(0,0,0,0.8)' }}>
          {/* App header */}
          <div style={{ height: 56, background: '#000', display: 'flex', alignItems: 'center', padding: '0 18px', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 900, color: '#FFF' }}>Comments</span>
            <div style={{ background: '#FF0050', borderRadius: 12, padding: '2px 10px', minWidth: 36, textAlign: 'center' }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 900, color: '#FFF' }}>
                {notifCount > 99 ? '99+' : notifCount}
              </span>
            </div>
          </div>
          {/* Pinned comment */}
          <div style={{ background: 'rgba(255,0,80,0.1)', padding: '14px 18px', borderBottom: '1px solid #1A1A1A' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FF0050', flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: '#FF0050', margin: 0, letterSpacing: 1 }}>MrBeast · PINNED</p>
                <p style={{ fontFamily: FONTS.body, fontSize: 13, color: '#FFF', margin: '4px 0 0', lineHeight: 1.4 }}>
                  Who do you think deserved to win? 👇
                </p>
              </div>
            </div>
          </div>
          {/* Comment stream */}
          <div style={{ padding: '8px 0', overflow: 'hidden' }}>
            {['😭😭😭', 'Chandler era', 'Karl carried', 'GOAT VIDEO', 'I cried ngl', 'THIS IS CRAZY'].map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 18px', opacity: f > (i + 1) * 20 ? 1 : 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: ['#6C63FF', '#FF6B00', '#00E5FF', '#A855F7', '#FF0050', '#FFD700'][i], flexShrink: 0 }} />
                <p style={{ fontFamily: FONTS.body, fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.4 }}>{c}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 90, height: 22, background: '#000', borderRadius: 11 }} />
      </div>

      {/* Floating comments */}
      {COMMENTS.map((c, i) => {
        const op = interpolate(f, [c.delay, c.delay + 14, c.delay + 90, c.delay + 110], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
        const cy = interpolate(f, [c.delay, c.delay + 110], [c.y + 20, c.y - 20], { extrapolateRight: 'clamp' });
        return (
          <div key={i} style={{ position: 'absolute', left: c.x, top: cy, opacity: op, transform: 'translateX(-50%)' }}>
            <div style={{ background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '8px 16px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.offWhite, whiteSpace: 'nowrap' }}>{c.text}</span>
            </div>
          </div>
        );
      })}

      {/* Big counter */}
      <div style={{ position: 'absolute', right: 80, bottom: H * 0.18, textAlign: 'right', opacity: useFadeIn(140, 20) }}>
        <p style={{ fontFamily: FONTS.display, fontSize: 76, fontWeight: 900, color: '#FF0050', margin: 0, lineHeight: 1, letterSpacing: -4 }}>2.4M</p>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '6px 0 0', letterSpacing: 3 }}>COMMENTS / 24HRS</p>
      </div>
    </AbsoluteFill>
  );
};
