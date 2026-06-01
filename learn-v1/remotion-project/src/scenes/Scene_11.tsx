// narrativeSlice: Mr Beast engineers virality — his videos are designed as FYP delivery systems
// visualMetaphor: Phone screen with endless FYP scroll, each card a Mr Beast thumbnail dominating the feed
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H } from '../utils/tokens';
import { useFadeIn } from '../utils/interpolations';

export const Scene_11_meta = {
  id: 'Scene_11', duration: 240,
  narrativeSlice: 'The video is engineered as a FYP delivery system — it spreads before it finishes',
  visualMetaphor: 'FYP infinite scroll with Mr Beast cards dominating every third slot',
  palette: ['#0D0D0D', COLORS.gold, '#FF0050', COLORS.offWhite],
};

const FEED_CARDS = [
  { title: 'I Gave Away $1,000,000',   color: '#FF0050', tag: '94% AVD' },
  { title: 'Survival Challenge',        color: '#6C63FF', tag: 'FOR YOU' },
  { title: 'Last To Leave Wins',        color: COLORS.gold, tag: '#1 TRENDING' },
  { title: '100 Players, 1 Prize',      color: '#00E5FF', tag: 'VIRAL' },
  { title: 'Extreme Makeover',          color: '#FF6B00', tag: 'REWATCH' },
  { title: 'Challenge Impossible',      color: '#A855F7', tag: 'FOR YOU' },
];

export const Scene_11: React.FC = () => {
  const f = useCurrentFrame();

  const bgOp    = useFadeIn(0, 20);
  const phoneOp = useFadeIn(10, 20);

  // Feed scrolls upward
  const scrollY = interpolate(f, [30, 240], [0, -520], { extrapolateRight: 'clamp' });

  // Phone dimensions
  const PH = 720, PW = 380;
  const px = W * 0.5 - PW * 0.5, py = H * 0.5 - PH * 0.5;

  const titleOp  = useFadeIn(0, 20);
  const labelOp  = useFadeIn(20, 20);
  const statsOp  = useFadeIn(160, 20);

  return (
    <AbsoluteFill style={{ background: '#0D0D0D', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 60%, rgba(255,0,80,0.08), transparent 70%)', opacity: bgOp }} />

      {/* Left panel — context */}
      <div style={{ position: 'absolute', left: 80, top: H * 0.25, width: W * 0.28, opacity: titleOp }}>
        <div style={{ display: 'inline-block', background: '#FF0050', padding: '6px 14px', marginBottom: 20 }}>
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, fontWeight: 900, color: '#FFF', letterSpacing: 3 }}>FOR YOU</span>
        </div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 54, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: 0, lineHeight: 1.0 }}>
          BUILT FOR THE ALGORITHM
        </h2>
        <p style={{ fontFamily: FONTS.mono, fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '20px 0 0', lineHeight: 1.7, letterSpacing: 0.5 }}>
          Every thumbnail, title, and first frame is an algorithm-optimized entry point — not a video.
        </p>
      </div>

      {/* Phone mockup */}
      <div style={{ position: 'absolute', left: px, top: py, width: PW, height: PH, opacity: phoneOp }}>
        {/* Phone shell */}
        <div style={{ width: PW, height: PH, background: '#111', borderRadius: 44, border: '3px solid #2A2A2A', overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.9), 0 0 60px rgba(255,0,80,0.12)', position: 'relative' }}>
          {/* Status bar */}
          <div style={{ height: 44, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: '#FFF' }}>9:41</span>
            <div style={{ width: 80, height: 8, background: '#333', borderRadius: 4 }} />
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: '#FFF' }}>100%</span>
          </div>
          {/* TikTok-style header */}
          <div style={{ height: 44, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Following</span>
            <span style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 900, color: '#FFF', borderBottom: '2px solid #FFF', paddingBottom: 2 }}>For You</span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>LIVE</span>
          </div>
          {/* Feed */}
          <div style={{ overflow: 'hidden', height: PH - 88 }}>
            <div style={{ transform: `translateY(${scrollY}px)` }}>
              {FEED_CARDS.map((card, i) => (
                <div key={i} style={{ width: PW, height: 160, background: card.color, position: 'relative', marginBottom: 4, flexShrink: 0, display: 'flex', alignItems: 'flex-end' }}>
                  {/* Dark overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
                  <div style={{ position: 'relative', padding: '12px 14px', width: '100%' }}>
                    <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', marginBottom: 6 }}>
                      <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: '#FFF', letterSpacing: 2 }}>{card.tag}</span>
                    </div>
                    <p style={{ fontFamily: FONTS.display, fontSize: 14, fontWeight: 900, color: '#FFF', margin: 0, lineHeight: 1.2 }}>{card.title}</p>
                  </div>
                  {/* Like / comment UI */}
                  <div style={{ position: 'absolute', right: 10, bottom: 20, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 14 }}>♥</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Notch */}
        <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 100, height: 24, background: '#000', borderRadius: 12 }} />
      </div>

      {/* Right stats */}
      <div style={{ position: 'absolute', right: 80, top: H * 0.3, opacity: statsOp }}>
        {[
          { v: '43B+', l: 'TOTAL VIEWS' },
          { v: '2.4×', l: 'FYP PUSH RATE' },
          { v: '68%', l: 'COMPLETION AVG' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <p style={{ fontFamily: FONTS.display, fontSize: 64, fontWeight: 900, color: i === 0 ? '#FF0050' : COLORS.offWhite, margin: 0, letterSpacing: -3, lineHeight: 1 }}>{s.v}</p>
            <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 3, margin: '4px 0 0', textTransform: 'uppercase' }}>{s.l}</p>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
