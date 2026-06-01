// narrativeSlice: Reason #3 — The Cast: every person on screen has a defined role that generates conflict
// visualMetaphor: Flight crew manifest — each crew member role and mission-critical function displayed
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS, W, H, SAFE } from '../utils/tokens';
import { useFadeIn } from '../utils/interpolations';

export const Scene_10_meta = {
  id: 'Scene_10', duration: 240,
  narrativeSlice: 'Reason 3: Every cast member has a role-defined conflict function — no passengers',
  visualMetaphor: 'Flight crew manifest — each member\'s seat, role, and mission function',
  palette: ['#060810', COLORS.dataBlue, COLORS.gold, COLORS.offWhite],
};

const CREW = [
  { seat: 'CMD', name: 'MR. BEAST',      role: 'PROTAGONIST / ARBITER',  function: 'Stakes setter, rule maker, emotional anchor', color: COLORS.gold },
  { seat: 'CO1', name: 'CHANDLER',        role: 'THE UNDERDOG',           function: 'Failure generator, sympathy engine, comedy relief', color: COLORS.dataBlue },
  { seat: 'CO2', name: 'KARL',            role: 'THE CHAOS AGENT',        function: 'Unpredictable outcomes, emotional wildcard', color: COLORS.liveGreen },
  { seat: 'CO3', name: 'NOLAN',           role: 'THE STRATEGIST',         function: 'Tension through competence, threat to protagonist', color: COLORS.dataBlue },
  { seat: 'CO4', name: 'GUEST/STRANGER',  role: 'THE WILDCARD',           function: 'Viewer proxy, introduces genuine unpredictability', color: 'rgba(240,237,232,0.6)' },
];

export const Scene_10: React.FC = () => {
  const f = useCurrentFrame();

  const headerOp = useFadeIn(0, 18);
  const blinkOp  = Math.sin(f * 0.3) > 0 ? 1 : 0.4;

  const rowOps = CREW.map((_, i) =>
    interpolate(f, [20 + i * 22, 45 + i * 22], [0, 1], { extrapolateRight: 'clamp' })
  );
  const rowX = CREW.map((_, i) =>
    interpolate(f, [20 + i * 22, 45 + i * 22], [-40, 0], { extrapolateRight: 'clamp' })
  );

  const calloutOp = useFadeIn(160, 20);
  const reasonOp  = useFadeIn(180, 20);

  return (
    <AbsoluteFill style={{ background: '#060810', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 64, background: '#04060E', borderBottom: `2px solid ${COLORS.dataBlue}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${SAFE}px`, opacity: headerOp }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ background: COLORS.dataBlue, padding: '6px 14px' }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 900, color: COLORS.black, letterSpacing: 3 }}>CREW MANIFEST</span>
          </div>
          <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: 'rgba(240,237,232,0.6)', letterSpacing: 2 }}>
            CAST CONFLICT ARCHITECTURE — MISSION FILE
          </span>
        </div>
        <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.dataBlue, opacity: blinkOp, letterSpacing: 2 }}>
          03 / CAST SYSTEM
        </span>
      </div>

      {/* Crew roster */}
      <div style={{ position: 'absolute', top: 88, left: SAFE, right: SAFE }}>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 2fr', gap: 0, padding: '8px 0', borderBottom: `1px solid rgba(79,195,247,0.3)`, marginBottom: 4 }}>
          {['SEAT', 'NAME', 'ROLE', 'CONFLICT FUNCTION'].map(h => (
            <span key={h} style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 3, color: COLORS.dataBlue, textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>

        {CREW.map((member, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '80px 1fr 1fr 2fr', gap: 0,
            height: 68, alignItems: 'center',
            borderBottom: `1px solid rgba(255,255,255,0.05)`,
            opacity: rowOps[i], transform: `translateX(${rowX[i]}px)`,
            background: i === 0 ? 'rgba(245,197,24,0.04)' : 'transparent',
          }}>
            <div style={{ background: member.color === COLORS.gold ? COLORS.gold : 'rgba(255,255,255,0.08)', padding: '6px 10px', display: 'inline-flex', width: 'fit-content' }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 900, color: member.color === COLORS.gold ? COLORS.black : member.color, letterSpacing: 2 }}>
                {member.seat}
              </span>
            </div>
            <span style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: member.color, letterSpacing: -0.5 }}>
              {member.name}
            </span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: 'rgba(240,237,232,0.6)', letterSpacing: 1 }}>
              {member.role}
            </span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(240,237,232,0.35)', lineHeight: 1.5 }}>
              {member.function}
            </span>
          </div>
        ))}
      </div>

      {/* Callout */}
      <div style={{ position: 'absolute', bottom: SAFE + 24, left: SAFE, right: SAFE, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ opacity: calloutOp }}>
          <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: 'rgba(240,237,232,0.35)', letterSpacing: 2, margin: 0, textTransform: 'uppercase' }}>
            NO PASSENGERS — EVERY SEAT GENERATES CONFLICT
          </p>
        </div>
        <div style={{ opacity: reasonOp, textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-end' }}>
            <div style={{ width: 48, height: 48, background: COLORS.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 22, fontWeight: 900, color: COLORS.black }}>03</span>
            </div>
            <p style={{ fontFamily: FONTS.mono, fontSize: 13, letterSpacing: 4, color: COLORS.gold, textTransform: 'uppercase', margin: 0 }}>
              THE CAST SYSTEM
            </p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
