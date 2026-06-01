// REVISION: Scene_13_v2_chromakey
// PARENT: Scene_13.tsx
// CHANGE: All backgrounds replaced with chromakey green (#00B140). All on-screen elements use saturated non-green colors safe for luma/chroma keying in DaVinci or Premiere.
// DATE: 2026-06-01

/**
 * CHROMAKEY INSTRUCTIONS FOR EDITING SUITE:
 *
 * GREEN SCREEN COLOR:  #00B140  /  RGB(0, 177, 64)  /  Hue: ~141°
 *
 * DaVinci Resolve:
 *   1. Add Fusion page → Use Delta Keyer node
 *   2. Pick the green (#00B140) as your key color
 *   3. Adjust Clean Plate if needed
 *   4. All animated elements are in: Magenta, Orange, Cyan, White — safe from green
 *
 * Adobe Premiere / After Effects:
 *   1. Apply Ultra Key to clip
 *   2. Key Color: #00B140
 *   3. All elements will remain fully visible
 *
 * SAFE COLORS USED IN THIS COMPONENT (all far from green spectrum):
 *   - Text:           #FFFFFF, #F0EDE8
 *   - Accent:         #FF0050 (red-pink)  — 0° hue
 *   - Secondary:      #FF6B00 (orange)    — 26° hue
 *   - UI elements:    #A855F7 (purple)    — 290° hue
 *   - Notifications:  #FF0050             — 0° hue
 *   - Comment cards:  rgba(10,10,10,0.9) — near-black, won't bleed
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { FONTS, W, H } from '../utils/tokens';
import { useFadeIn } from '../utils/interpolations';

const CHROMA_GREEN = '#00B140';

// All UI colors deliberately far from green hue
const UI = {
  primary:   '#FF0050',   // red-pink
  secondary: '#FF6B00',   // orange
  accent:    '#A855F7',   // purple
  white:     '#FFFFFF',
  offWhite:  '#F0EDE8',
  dark:      'rgba(10,10,10,0.92)',
};

const COMMENTS = [
  { text: 'BRO THE ENDING 😭😭',       delay: 30,  x: W * 0.38, y: H * 0.15 },
  { text: 'Chandler finally won!!',     delay: 45,  x: W * 0.62, y: H * 0.22 },
  { text: 'I SCREAMED',                 delay: 55,  x: W * 0.44, y: H * 0.35 },
  { text: 'No way that happened 💀',    delay: 65,  x: W * 0.7,  y: H * 0.42 },
  { text: '43M watching this rn',      delay: 75,  x: W * 0.36, y: H * 0.52 },
  { text: 'This is literally cinema',  delay: 85,  x: W * 0.65, y: H * 0.58 },
  { text: 'repeat after me: GOAT',     delay: 95,  x: W * 0.42, y: H * 0.68 },
  { text: '2.4M comments in 24 hours', delay: 110, x: W * 0.6,  y: H * 0.76 },
];

export const Scene_13_v2_chromakey: React.FC = () => {
  const f = useCurrentFrame();

  const titleOp    = useFadeIn(0, 18);
  const notifCount = Math.min(Math.floor(f / 6), 999);

  const PH = 680, PW = 340;
  const phoneOp = useFadeIn(5, 20);

  return (
    <AbsoluteFill style={{ background: CHROMA_GREEN, overflow: 'hidden' }}>
      {/* Title — right side */}
      <div style={{ position: 'absolute', right: 80, top: H * 0.15, width: W * 0.32, opacity: titleOp }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 4, color: UI.primary, textTransform: 'uppercase', margin: '0 0 12px' }}>
          ALGORITHM SIGNAL
        </p>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 54, fontWeight: 900, letterSpacing: -2, color: UI.white, margin: 0, lineHeight: 1.0, textShadow: '0 2px 0 rgba(0,0,0,0.4)' }}>
          DESIGN THE<br />REACTION.<br />THE ALGORITHM<br />DOES THE REST.
        </h2>
      </div>

      {/* Phone mockup — non-green palette */}
      <div style={{ position: 'absolute', left: 80, top: H * 0.5 - PH * 0.5, width: PW, height: PH, opacity: phoneOp }}>
        <div style={{ width: PW, height: PH, background: '#111111', borderRadius: 40, border: `3px solid ${UI.secondary}`, overflow: 'hidden', boxShadow: `0 0 60px ${UI.primary}60` }}>
          <div style={{ height: 56, background: '#0A0A0A', display: 'flex', alignItems: 'center', padding: '0 18px', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 900, color: UI.white }}>Comments</span>
            <div style={{ background: UI.primary, borderRadius: 12, padding: '2px 10px' }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 900, color: UI.white }}>
                {notifCount > 99 ? '99+' : notifCount}
              </span>
            </div>
          </div>
          <div style={{ background: `${UI.primary}22`, padding: '14px 18px', borderBottom: '1px solid #222' }}>
            <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: UI.primary, margin: 0 }}>MrBeast · PINNED</p>
            <p style={{ fontFamily: FONTS.body, fontSize: 13, color: UI.white, margin: '4px 0 0', lineHeight: 1.4 }}>Who do you think deserved to win? 👇</p>
          </div>
          {['😭😭😭', 'Chandler era', 'Karl carried', 'GOAT VIDEO', 'I cried ngl', 'THIS IS CRAZY'].map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 18px', opacity: f > (i + 1) * 20 ? 1 : 0 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: [UI.accent, UI.secondary, '#FF1493', '#FF4500', UI.primary, '#CC00FF'][i], flexShrink: 0 }} />
              <p style={{ fontFamily: FONTS.body, fontSize: 13, color: UI.offWhite, margin: 0 }}>{c}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating comments */}
      {COMMENTS.map((c, i) => {
        const op = interpolate(f, [c.delay, c.delay + 14, c.delay + 90, c.delay + 110], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
        const cy = interpolate(f, [c.delay, c.delay + 110], [c.y + 20, c.y - 20], { extrapolateRight: 'clamp' });
        return (
          <div key={i} style={{ position: 'absolute', left: c.x, top: cy, opacity: op, transform: 'translateX(-50%)' }}>
            <div style={{ background: UI.dark, border: `1px solid ${UI.secondary}60`, borderRadius: 20, padding: '8px 16px' }}>
              <span style={{ fontFamily: FONTS.body, fontSize: 14, color: UI.white, whiteSpace: 'nowrap' }}>{c.text}</span>
            </div>
          </div>
        );
      })}

      {/* Counter */}
      <div style={{ position: 'absolute', right: 80, bottom: H * 0.18, textAlign: 'right', opacity: useFadeIn(140, 20) }}>
        <p style={{ fontFamily: FONTS.display, fontSize: 76, fontWeight: 900, color: UI.primary, margin: 0, lineHeight: 1, letterSpacing: -4, textShadow: '0 3px 0 rgba(0,0,0,0.4)' }}>2.4M</p>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: UI.offWhite, margin: '6px 0 0', letterSpacing: 3 }}>COMMENTS / 24HRS</p>
      </div>
    </AbsoluteFill>
  );
};
