// Design tokens — single source of truth for all scenes
export const COLORS = {
  // Neutrals
  black:       '#0A0A0A',
  panel:       '#111111',
  mid:         '#1E1E1E',
  border:      '#2A2A2A',
  white:       '#FFFFFF',
  offWhite:    '#F0EDE8',
  // Accent
  gold:        '#F5C518',
  cyan:        '#00E5FF',
  liveGreen:   '#00FF87',
  red:         '#FF3B30',
  orange:      '#FF6B00',
  dataBlue:    '#4FC3F7',
  purple:      '#A855F7',
  // Chromakey
  chromaGreen: '#00B140',
  // Alpha helpers
  overlay72:   'rgba(0,0,0,0.72)',
  overlay40:   'rgba(0,0,0,0.40)',
};

export const FONTS = {
  display: '"Space Grotesk", "DM Sans", "Inter", sans-serif',
  body:    '"Inter", "DM Sans", system-ui, sans-serif',
  mono:    '"JetBrains Mono", "Space Mono", monospace',
};

export const EASING = {
  spring: { damping: 18, stiffness: 120, mass: 1 },
  snappy: { damping: 25, stiffness: 200, mass: 0.8 },
  heavy:  { damping: 30, stiffness: 80,  mass: 1.5 },
};

export const FPS = 30;
export const W  = 1920;
export const H  = 1080;
export const SAFE = 80; // px inset all edges
