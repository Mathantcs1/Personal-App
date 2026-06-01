// narrativeSlice: Thumbnail design is a science — faces, numbers, and color contrast engineered for stop-scroll
// visualMetaphor: A/B card stack — thumbnails racing past, winner card snapping to front
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H } from '../utils/tokens';
import { useFadeIn } from '../utils/interpolations';

export const Scene_12_meta = {
  id: 'Scene_12', duration: 240,
  narrativeSlice: 'Thumbnails are a stop-scroll machine — face expression + number + color contrast = click',
  visualMetaphor: 'A/B card stack race — thumbnails competing for stop-scroll dominance',
  palette: ['#0D0D0D', '#FF0050', COLORS.gold, COLORS.offWhite],
};

const THUMB_DATA = [
  { bg: '#FF0050', text: '$1,000,000', sub: 'LAST PERSON TO LEAVE', emoji: '😱' },
  { bg: '#1A1AFF', text: '100 HOURS', sub: 'INSIDE A BOX', emoji: '😨' },
  { bg: '#FF6B00', text: '$500K', sub: 'BURIED ALIVE', emoji: '😰' },
  { bg: '#7C3AED', text: 'IMPOSSIBLE', sub: 'CHALLENGE', emoji: '😤' },
];

export const Scene_12: React.FC = () => {
  const f = useCurrentFrame();

  const bgOp   = useFadeIn(0, 20);
  const titleOp = useFadeIn(0, 20);

  // Cards fan out then stack/race
  const cardProps = THUMB_DATA.map((_, i) => {
    const delay = i * 18;
    const entranceOp  = interpolate(f, [delay, delay + 20], [0, 1], { extrapolateRight: 'clamp' });
    const startX = -300 + i * 80;
    const startY = -100 + i * 40;
    const entryX  = interpolate(f, [delay, delay + 25], [startX, i % 2 === 0 ? -20 + i * 10 : 20 - i * 10], { extrapolateRight: 'clamp' });
    const entryY  = interpolate(f, [delay, delay + 25], [startY, i * 6], { extrapolateRight: 'clamp' });
    const rotate  = interpolate(f, [delay, delay + 25], [-8 + i * 4, -3 + i * 1.5], { extrapolateRight: 'clamp' });
    return { op: entranceOp, x: entryX, y: entryY, r: rotate };
  });

  // Winner card (first) snaps forward
  const winnerScale = interpolate(f, [130, 160], [1, 1.08], { extrapolateRight: 'clamp' });
  const winnerGlow  = interpolate(f, [130, 160], [0, 1], { extrapolateRight: 'clamp' });

  const CARD_W = 380, CARD_H = 214;
  const stackCX = W * 0.52, stackCY = H * 0.5;

  const labelOp = useFadeIn(165, 20);

  return (
    <AbsoluteFill style={{ background: '#0D0D0D', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 55% 55%, rgba(255,100,0,0.07), transparent 65%)', opacity: bgOp }} />

      {/* Title left */}
      <div style={{ position: 'absolute', left: 80, top: H * 0.2, width: W * 0.3, opacity: titleOp }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 4, color: '#FF0050', textTransform: 'uppercase', margin: '0 0 12px' }}>
          STOP-SCROLL ENGINEERING
        </p>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 58, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: 0, lineHeight: 1.0 }}>
          THE<br />THUMBNAIL<br />IS THE<br />PRODUCT
        </h2>
      </div>

      {/* Card stack */}
      {THUMB_DATA.map((card, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: stackCX - CARD_W * 0.5 + cardProps[i].x,
          top: stackCY - CARD_H * 0.5 + cardProps[i].y,
          width: CARD_W, height: CARD_H,
          background: card.bg,
          borderRadius: 12,
          opacity: cardProps[i].op,
          transform: `rotate(${cardProps[i].r}deg) scale(${i === 0 ? winnerScale : 1})`,
          boxShadow: i === 0 ? `0 0 ${60 * winnerGlow}px ${card.bg}` : '0 20px 60px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)' }} />
          <span style={{ fontSize: 64, lineHeight: 1, position: 'relative' }}>{card.emoji}</span>
          <p style={{ fontFamily: FONTS.display, fontSize: 42, fontWeight: 900, color: '#FFF', margin: '8px 0 0', letterSpacing: -2, lineHeight: 1, textAlign: 'center', position: 'relative' }}>
            {card.text}
          </p>
          <p style={{ fontFamily: FONTS.mono, fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: '6px 0 0', letterSpacing: 2, textAlign: 'center', position: 'relative' }}>
            {card.sub}
          </p>
        </div>
      ))}

      {/* Formula */}
      <div style={{ position: 'absolute', bottom: 80, left: 80, right: 80, display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'center', opacity: labelOp }}>
        {['FACE EXPRESSION', '+', 'BIG NUMBER', '+', 'COLOR SHOCK', '=', 'STOP SCROLL'].map((t, i) => (
          <span key={i} style={{
            fontFamily: ['+', '='].includes(t) ? FONTS.display : FONTS.mono,
            fontSize: ['+', '='].includes(t) ? 36 : 13,
            fontWeight: ['+', '='].includes(t) ? 900 : 600,
            color: t === '=' ? COLORS.gold : t === 'STOP SCROLL' ? '#FF0050' : 'rgba(240,237,232,0.6)',
            letterSpacing: ['+', '='].includes(t) ? 0 : 2,
          }}>
            {t}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
