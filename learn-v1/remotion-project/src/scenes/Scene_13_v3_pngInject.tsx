// REVISION: Scene_13_v3_pngInject
// PARENT: Scene_13.tsx
// CHANGE: Phone screen vector placeholder replaced with dynamic PNG asset mapping from pngs/ folder. Drop PNG files into learn-v1/pngs/ and update PNG_ASSETS array.
// DATE: 2026-06-01

/**
 * PNG INJECTION GUIDE:
 *
 * 1. Place your vertical-aspect-ratio PNG files into: learn-v1/pngs/
 *    e.g.: learn-v1/pngs/screen_01.png, screen_02.png, screen_03.png
 *
 * 2. Update PNG_ASSETS below with your filenames (relative to Remotion staticFile root)
 *    Remotion staticFile() resolves from: remotion-project/public/
 *    So copy your PNGs to: learn-v1/remotion-project/public/pngs/
 *
 * 3. The phone screen area is 306×560px (9:16 crop, within the 340×680 phone body)
 *    Your PNGs should ideally be 306×560 or 612×1120 (@2x). Any size will scale-fill.
 *
 * 4. PNG_ASSETS entries cycle on a frame timer — each shows for `holdFrames` duration
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, staticFile, Img } from 'remotion';
import { COLORS, FONTS, W, H } from '../utils/tokens';
import { useFadeIn } from '../utils/interpolations';

// ─── CONFIGURE YOUR PNG FILES HERE ──────────────────────────────────────────
const PNG_ASSETS = [
  { file: 'pngs/screen_01.png', holdFrames: 60 },
  { file: 'pngs/screen_02.png', holdFrames: 60 },
  { file: 'pngs/screen_03.png', holdFrames: 60 },
  { file: 'pngs/screen_04.png', holdFrames: 60 },
];
// ─────────────────────────────────────────────────────────────────────────────

const COMMENTS = [
  { text: 'BRO THE ENDING 😭😭',     delay: 30,  x: W * 0.38, y: H * 0.15 },
  { text: 'Chandler finally won!!',   delay: 45,  x: W * 0.62, y: H * 0.22 },
  { text: 'I SCREAMED',               delay: 55,  x: W * 0.44, y: H * 0.35 },
  { text: 'No way that happened 💀',  delay: 65,  x: W * 0.7,  y: H * 0.42 },
  { text: '43M watching this rn',    delay: 75,  x: W * 0.36, y: H * 0.52 },
  { text: 'This is literally cinema',delay: 85,  x: W * 0.65, y: H * 0.58 },
];

export const Scene_13_v3_pngInject: React.FC = () => {
  const f = useCurrentFrame();

  const titleOp    = useFadeIn(0, 18);
  const bgPulse    = interpolate(f, [0, 240], [0.05, 0.12], { extrapolateRight: 'clamp' });
  const notifCount = Math.min(Math.floor(f / 6), 999);

  // Determine which PNG to show and crossfade between them
  let elapsed = 0;
  let currentIdx = 0;
  let frameIntoSlot = 0;
  for (let i = 0; i < PNG_ASSETS.length; i++) {
    const hold = PNG_ASSETS[i].holdFrames;
    if (f < elapsed + hold) {
      currentIdx = i;
      frameIntoSlot = f - elapsed;
      break;
    }
    elapsed += hold;
    currentIdx = i; // clamp to last
    frameIntoSlot = f - elapsed;
  }

  const nextIdx = (currentIdx + 1) % PNG_ASSETS.length;
  const crossfadeDur = 10;
  const crossfadeOp  = interpolate(
    frameIntoSlot,
    [PNG_ASSETS[currentIdx].holdFrames - crossfadeDur, PNG_ASSETS[currentIdx].holdFrames],
    [0, 1], { extrapolateRight: 'clamp' }
  );

  const PH = 680, PW = 340;
  const SCREEN_INSET_X = 17, SCREEN_INSET_TOP = 56, SCREEN_INSET_BOT = 30;
  const screenW = PW - SCREEN_INSET_X * 2;
  const screenH = PH - SCREEN_INSET_TOP - SCREEN_INSET_BOT;

  const phoneOp = useFadeIn(5, 20);

  return (
    <AbsoluteFill style={{ background: '#0D0D0D', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(255,0,80,0.15), transparent 60%)', opacity: bgPulse }} />

      {/* Title */}
      <div style={{ position: 'absolute', right: 80, top: H * 0.15, width: W * 0.32, opacity: titleOp }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 4, color: '#FF0050', textTransform: 'uppercase', margin: '0 0 12px' }}>
          ALGORITHM SIGNAL
        </p>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 54, fontWeight: 900, letterSpacing: -2, color: COLORS.offWhite, margin: 0, lineHeight: 1.0 }}>
          DESIGN THE<br />REACTION.<br />THE ALGORITHM<br />DOES THE REST.
        </h2>
      </div>

      {/* Phone mockup with PNG screen */}
      <div style={{ position: 'absolute', left: 80, top: H * 0.5 - PH * 0.5, width: PW, height: PH, opacity: phoneOp }}>
        {/* Phone shell */}
        <div style={{ width: PW, height: PH, background: '#111', borderRadius: 40, border: '3px solid #222', overflow: 'hidden', boxShadow: '0 30px 100px rgba(0,0,0,0.8)', position: 'relative' }}>
          {/* Status bar — static, over PNG */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: SCREEN_INSET_TOP, background: '#000', zIndex: 10, display: 'flex', alignItems: 'center', padding: '0 18px', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: '#FFF' }}>9:41</span>
            <div style={{ background: '#FF0050', borderRadius: 12, padding: '2px 10px' }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 900, color: '#FFF' }}>{notifCount > 99 ? '99+' : notifCount}</span>
            </div>
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: '#FFF' }}>100%</span>
          </div>

          {/* PNG screen area */}
          <div style={{ position: 'absolute', left: SCREEN_INSET_X, top: SCREEN_INSET_TOP, width: screenW, height: screenH, overflow: 'hidden', background: '#111' }}>
            {/* Current PNG */}
            <Img
              src={staticFile(PNG_ASSETS[currentIdx].file)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
            />
            {/* Next PNG crossfade */}
            <Img
              src={staticFile(PNG_ASSETS[nextIdx].file)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, opacity: crossfadeOp }}
            />
          </div>

          {/* Bottom bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: SCREEN_INSET_BOT, background: '#000', zIndex: 10 }} />
        </div>
        {/* Notch */}
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

      {/* Counter */}
      <div style={{ position: 'absolute', right: 80, bottom: H * 0.18, textAlign: 'right', opacity: useFadeIn(140, 20) }}>
        <p style={{ fontFamily: FONTS.display, fontSize: 76, fontWeight: 900, color: '#FF0050', margin: 0, lineHeight: 1, letterSpacing: -4 }}>2.4M</p>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(240,237,232,0.35)', margin: '6px 0 0', letterSpacing: 3 }}>COMMENTS / 24HRS</p>
      </div>
    </AbsoluteFill>
  );
};
