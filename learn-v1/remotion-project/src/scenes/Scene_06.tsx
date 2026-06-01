// narrativeSlice: Reason #2 — The Escalation Engine: every 60 seconds stakes must double or viewers eject
// visualMetaphor: Mission control launch sequence — T-minus countdown, systems nominal panel
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn, useCounter } from '../utils/interpolations';

export const Scene_06_meta = {
  id: 'Scene_06', duration: 240,
  narrativeSlice: 'Reason 2: Stakes must escalate every 60 seconds or the audience ejects',
  visualMetaphor: 'Mission control launch sequence — nominal systems confirm escalation readiness',
  palette: [COLORS.black, COLORS.dataBlue, COLORS.liveGreen, COLORS.gold],
};

const SYSTEMS = [
  { id: 'SYS-01', label: 'HOOK DEPLOYED',       status: 'NOMINAL', value: '100%', color: COLORS.liveGreen },
  { id: 'SYS-02', label: 'TENSION RISING',       status: 'NOMINAL', value: '94%',  color: COLORS.liveGreen },
  { id: 'SYS-03', label: 'STAKES DOUBLING',      status: 'ACTIVE',  value: '2×',   color: COLORS.gold },
  { id: 'SYS-04', label: 'VIEWER LOCK',          status: 'NOMINAL', value: '87%',  color: COLORS.liveGreen },
  { id: 'SYS-05', label: 'CURIOSITY PRESSURE',   status: 'PEAK',    value: '↑↑',   color: COLORS.dataBlue },
  { id: 'SYS-06', label: 'EXIT INTENT',          status: 'MINIMAL', value: '3%',   color: COLORS.liveGreen },
];

export const Scene_06: React.FC = () => {
  const f = useCurrentFrame();

  const headerOp = useFadeIn(0, 15);
  const counter  = useCounter(100, 0, 90);
  const blinkOp  = Math.sin(f * 0.3) > 0 ? 1 : 0;

  const sysOps = SYSTEMS.map((_, i) =>
    interpolate(f, [20 + i * 15, 40 + i * 15], [0, 1], { extrapolateRight: 'clamp' })
  );

  const scanlineY = interpolate(f, [0, 240], [0, H], { extrapolateRight: 'wrap' });
  const reasonOp  = useFadeIn(140, 20);

  return (
    <AbsoluteFill style={{ background: '#020C04', overflow: 'hidden' }}>
      {/* CRT scanline */}
      <div style={{ position: 'absolute', left: 0, top: scanlineY, width: W, height: 3, background: 'rgba(0,255,135,0.04)', pointerEvents: 'none' }} />

      {/* Grid overlay */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.06 }} width={W} height={H}>
        {Array.from({ length: 24 }, (_, i) => (
          <line key={i} x1={(i + 1) * (W / 25)} y1={0} x2={(i + 1) * (W / 25)} y2={H} stroke={COLORS.liveGreen} strokeWidth={1} />
        ))}
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={0} y1={(i + 1) * (H / 15)} x2={W} y2={(i + 1) * (H / 15)} stroke={COLORS.liveGreen} strokeWidth={1} />
        ))}
      </svg>

      {/* Header bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 64, background: '#071410', borderBottom: `2px solid ${COLORS.liveGreen}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${SAFE}px`, opacity: headerOp }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.liveGreen, boxShadow: `0 0 12px ${COLORS.liveGreen}` }} />
          <span style={{ fontFamily: FONTS.mono, fontSize: 13, letterSpacing: 4, color: COLORS.liveGreen, textTransform: 'uppercase' }}>
            RETENTION MISSION CONTROL — ROOM 02
          </span>
        </div>
        <div style={{ display: 'flex', gap: 40 }}>
          <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.dataBlue, letterSpacing: 2 }}>T+{String(Math.floor(f / 30)).padStart(2, '0')}:{String(f % 30).padStart(2, '0')}</span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.liveGreen, letterSpacing: 2, opacity: blinkOp }}>● LIVE</span>
        </div>
      </div>

      {/* Systems panel */}
      <div style={{ position: 'absolute', top: 90, left: SAFE, width: W * 0.54 }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 3, color: COLORS.dataBlue, margin: '0 0 16px', textTransform: 'uppercase' }}>
          ESCALATION SYSTEMS CHECKLIST
        </p>
        {SYSTEMS.map((sys, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: 52, borderBottom: `1px solid rgba(0,255,135,0.1)`,
            opacity: sysOps[i], padding: '0 16px 0 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(0,255,135,0.4)', letterSpacing: 1 }}>{sys.id}</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.offWhite, letterSpacing: 1 }}>{sys.label}</span>
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: sys.color, letterSpacing: 2 }}>{sys.value}</span>
              <div style={{ background: `rgba(${sys.color === COLORS.liveGreen ? '0,255,135' : sys.color === COLORS.gold ? '245,197,24' : '79,195,247'},0.15)`, padding: '4px 10px' }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: sys.color, letterSpacing: 2 }}>{sys.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Big metric panel — right */}
      <div style={{ position: 'absolute', top: 90, right: SAFE, width: W * 0.34, border: `1px solid rgba(0,255,135,0.2)`, padding: 32 }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 3, color: COLORS.dataBlue, margin: '0 0 12px', textTransform: 'uppercase' }}>
          ESCALATION INDEX
        </p>
        <p style={{ fontFamily: FONTS.display, fontSize: 120, fontWeight: 900, color: COLORS.liveGreen, margin: 0, lineHeight: 1, letterSpacing: -6 }}>
          {Math.round(counter).toString().padStart(3, '0')}
        </p>
        <div style={{ height: 2, background: 'rgba(0,255,135,0.3)', margin: '16px 0' }} />
        <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(0,255,135,0.5)', letterSpacing: 2, margin: 0 }}>
          NOMINAL THRESHOLD: 085<br />CURRENT: ABOVE LIMIT
        </p>
      </div>

      {/* Reason label */}
      <div style={{ position: 'absolute', bottom: SAFE + 20, left: SAFE, opacity: reasonOp }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, background: COLORS.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 22, fontWeight: 900, color: COLORS.black }}>02</span>
          </div>
          <p style={{ fontFamily: FONTS.mono, fontSize: 13, letterSpacing: 4, color: COLORS.gold, textTransform: 'uppercase', margin: 0 }}>
            THE ESCALATION ENGINE
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
