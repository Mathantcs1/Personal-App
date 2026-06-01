import { SAFE, W, H } from './tokens';

// Grid helpers — 1920×1080 baseline
export const col = (n: number, total = 12): number =>
  SAFE + (n / total) * (W - SAFE * 2);

export const row = (n: number, total = 8): number =>
  SAFE + (n / total) * (H - SAFE * 2);

// Left-panel width in camLeft mode (35% of frame)
export const CAM_LEFT_WIDTH  = W * 0.35;
export const CAM_RIGHT_START = W * 0.35;

// Chromakey green string (import from tokens instead of redefining)
export { COLORS } from './tokens';
