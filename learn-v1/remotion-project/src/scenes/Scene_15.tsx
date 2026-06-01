// narrativeSlice: Share mechanics are engineered — moments designed to be screenshot, clipped, and sent
// visualMetaphor: Share sheet UI explosion — content fragmenting into platform icons flying outward
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H } from '../utils/tokens';
import { useFadeIn } from '../utils/interpolations';

export const Scene_15_meta = {
  id: 'Scene_15', duration: 210,
  narrativeSlice: 'Shareable moments are engineered into the script — clips distributed before the video ends',
  visualMetaphor: 'Share sheet explosion — content fragments flying to platform destinations',
  palette: ['#0A0A0A', '#FF0050', '#1DA1F2', '#6C63FF', COLORS.offWhite],
};

const PLATFORMS = [
  { name: 'TikTok',   color: '#FF0050', icon: '♪',  angle: -140, dist: 280 },
  { name: 'Twitter',  color: '#1DA1F2', icon: '🐦', angle: -100, dist: 310 },
  { name: 'Instagram',color: '#E1306C', icon: '◈',  angle: -60,  dist: 290 },
  { name: 'Discord',  color: '#6C63FF', icon: '◉',  angle: -20,  dist: 270 },
  { name: 'Reddit',   color: '#FF4500', icon: '●',  angle: 20,   dist: 300 },
  { name: 'WhatsApp', color: '#25D366', icon: '◆',  angle: 60,   dist: 280 },
  { name: 'YouTube',  color: '#FF0000', icon: '▶',  angle: 100,  dist: 295 },
];

export const Scene_15: React.FC = () => {
  const f = useCurrentFrame();

  const bgOp    = useFadeIn(0, 20);
  const titleOp = useFadeIn(0, 20);

  const cx = W * 0.55, cy = H * 0.52;
  const rad = (deg: number) => (deg * Math.PI) / 180;

  // Center card appears
  const cardOp    = useFadeIn(10, 20);
  const cardScale = interpolate(f, [10, 30], [0.5, 1], { extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) });

  // Explosion fires at frame 60
  const platformOps = PLATFORMS.map((_, i) => ({
    op:   interpolate(f, [60 + i * 10, 80 + i * 10], [0, 1], { extrapolateRight: 'clamp' }),
    dist: interpolate(f, [60 + i * 10, 80 + i * 10], [0, 1], { extrapolateRight: 'clamp' }),
    bobble: Math.sin((f + i * 20) * 0.05) * 8,
  }));

  const shareCountOp = useFadeIn(140, 20);
  const shareCount   = interpolate(f, [140, 200], [0, 4200000], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#0A0A0A', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 55% 52%, rgba(108,99,255,0.1), transparent 60%)', opacity: bgOp }} />

      {/* Title */}
      <div style={{ position: 'absolute', left: 80, top: H * 0.18, width: W * 0.28, opacity: titleOp }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 4, color: '#6C63FF', textTransform: 'uppercase', margin: '0 0 12px' }}>
          VIRAL DISTRIBUTION SYSTEM
        </p>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 56, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: 0, lineHeight: 1.0 }}>
          THE CLIP IS THE<br />MARKETING<br />BUDGET
        </h2>
      </div>

      {/* Center card — the shareable moment */}
      <div style={{ position: 'absolute', left: cx - 130, top: cy - 80, width: 260, height: 160, opacity: cardOp, transform: `scale(${cardScale})`, boxShadow: '0 0 60px rgba(108,99,255,0.4)' }}>
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1A1AFF, #6C63FF)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <p style={{ fontFamily: FONTS.display, fontSize: 32, fontWeight: 900, color: '#FFF', margin: 0 }}>CLIP THIS</p>
          <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: '8px 0 0', letterSpacing: 2 }}>DESIGNED MOMENT</p>
        </div>
      </div>

      {/* Platform icons flying out */}
      {PLATFORMS.map((p, i) => {
        const props = platformOps[i];
        const nx = cx + Math.cos(rad(p.angle)) * p.dist * props.dist;
        const ny = cy + Math.sin(rad(p.angle)) * p.dist * props.dist + props.bobble;
        return (
          <div key={i} style={{
            position: 'absolute', left: nx - 36, top: ny - 36,
            width: 72, height: 72, borderRadius: '50%',
            background: p.color, opacity: props.op,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 30px ${p.color}80`,
          }}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>{p.icon}</span>
            <p style={{ fontFamily: FONTS.mono, fontSize: 9, color: '#FFF', margin: '3px 0 0', letterSpacing: 1 }}>{p.name.toUpperCase()}</p>
          </div>
        );
      })}

      {/* Share count */}
      <div style={{ position: 'absolute', right: 80, bottom: H * 0.22, textAlign: 'right', opacity: shareCountOp }}>
        <p style={{ fontFamily: FONTS.display, fontSize: 80, fontWeight: 900, color: '#6C63FF', margin: 0, letterSpacing: -4, lineHeight: 1 }}>
          {(shareCount / 1000000).toFixed(1)}M
        </p>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(240,237,232,0.35)', margin: '6px 0 0', letterSpacing: 3 }}>SHARES / VIDEO AVG</p>
      </div>
    </AbsoluteFill>
  );
};
