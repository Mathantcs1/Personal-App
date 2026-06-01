// narrativeSlice: Reason #1 — The Promise: Mr Beast opens every video with an unmissable stakes declaration
// visualMetaphor: A contract materialises — the "promise" signed in bold kinetic type, ticking clock overhead
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn, useSlideY, useExpand } from '../utils/interpolations';

export const Scene_03_meta = {
  id: 'Scene_03', duration: 210,
  narrativeSlice: 'Reason 1: The hook is a binding promise — stakes declared in frame one',
  visualMetaphor: 'A contract forms on screen — the promise written and countersigned',
  palette: [COLORS.black, COLORS.gold, COLORS.offWhite],
};

const PROMISE_WORDS = ['LAST', 'ONE', 'WINS', '$250,000'];

export const Scene_03: React.FC = () => {
  const f = useCurrentFrame();

  const reasonOp  = useFadeIn(0, 15);
  const reasonY   = useSlideY(25, 0, 20);
  const ruleW     = useExpand(20, 40, W - SAFE * 2);
  const wordDelay = 40;

  // Each promise word slams in sequentially
  const wordProgress = PROMISE_WORDS.map((_, i) =>
    interpolate(f, [wordDelay + i * 18, wordDelay + i * 18 + 12], [0, 1], { extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 4) })
  );
  const wordScale = PROMISE_WORDS.map((_, i) =>
    interpolate(f, [wordDelay + i * 18, wordDelay + i * 18 + 12], [1.6, 1], { extrapolateRight: 'clamp' })
  );

  // Signature underline draws
  const sigW = useExpand(120, 30, W * 0.46);
  const sigOp = useFadeIn(120, 15);

  // Clock ticks
  const seconds = Math.floor(f / 30);
  const clockOp = useFadeIn(10, 10);
  const clockAngle = interpolate(f, [0, 210], [0, 360 * 3]);

  return (
    <AbsoluteFill style={{ background: '#0D0B08', overflow: 'hidden' }}>
      {/* Subtle texture lines */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.04 }} width={W} height={H}>
        {Array.from({ length: 30 }, (_, i) => (
          <line key={i} x1={0} y1={i * 36} x2={W} y2={i * 36} stroke={COLORS.offWhite} strokeWidth={1} />
        ))}
      </svg>

      {/* Reason label */}
      <div style={{ position: 'absolute', top: SAFE, left: SAFE, opacity: reasonOp, transform: `translateY(${reasonY}px)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, background: COLORS.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 22, fontWeight: 900, color: COLORS.black }}>01</span>
          </div>
          <p style={{ fontFamily: FONTS.mono, fontSize: 13, letterSpacing: 4, color: COLORS.gold, textTransform: 'uppercase', margin: 0 }}>
            THE PROMISE
          </p>
        </div>
      </div>

      {/* Horizontal rule */}
      <div style={{ position: 'absolute', top: SAFE + 64, left: SAFE, height: 2, background: COLORS.gold, width: ruleW }} />

      {/* Promise words — kinetic slam type */}
      <div style={{ position: 'absolute', top: H * 0.26, left: SAFE, display: 'flex', gap: 24, alignItems: 'baseline', flexWrap: 'wrap', width: W * 0.72 }}>
        {PROMISE_WORDS.map((word, i) => (
          <span key={i} style={{
            fontFamily: FONTS.display,
            fontSize: word === '$250,000' ? 100 : 110,
            fontWeight: 900,
            letterSpacing: -5,
            lineHeight: 1.0,
            color: word === '$250,000' ? COLORS.gold : COLORS.offWhite,
            opacity: wordProgress[i],
            transform: `scale(${wordScale[i]})`,
            display: 'inline-block',
            transformOrigin: 'left bottom',
          }}>
            {word}
          </span>
        ))}
      </div>

      {/* Signature line */}
      <div style={{ position: 'absolute', top: H * 0.74, left: SAFE, opacity: sigOp }}>
        <div style={{ width: sigW, height: 3, background: COLORS.gold }} />
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(240,237,232,0.4)', letterSpacing: 2, margin: '8px 0 0', textTransform: 'uppercase' }}>
          Promise declared — Frame 00:00:01 — Stakes binding
        </p>
      </div>

      {/* Clock — top right */}
      <div style={{ position: 'absolute', top: SAFE, right: SAFE, opacity: clockOp, textAlign: 'right' }}>
        <svg width={80} height={80}>
          <circle cx={40} cy={40} r={34} fill="none" stroke="rgba(240,237,232,0.1)" strokeWidth={2} />
          <circle cx={40} cy={40} r={34} fill="none" stroke={COLORS.gold} strokeWidth={2}
            strokeDasharray={`${213.6 * (f % 90) / 90} 213.6`} strokeLinecap="round"
            transform="rotate(-90 40 40)" />
          <line x1={40} y1={40} x2={40 + 22 * Math.sin(clockAngle * Math.PI / 180)} y2={40 - 22 * Math.cos(clockAngle * Math.PI / 180)}
            stroke={COLORS.gold} strokeWidth={2} strokeLinecap="round" />
        </svg>
        <p style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.offWhite, margin: '4px 0 0', letterSpacing: -1 }}>
          00:{String(seconds % 60).padStart(2, '0')}
        </p>
      </div>
    </AbsoluteFill>
  );
};
