import { interpolate, useCurrentFrame } from 'remotion';

// Fade in over `dur` frames starting at `start`
export const useFadeIn = (start = 0, dur = 15): number => {
  const f = useCurrentFrame();
  return interpolate(f, [start, start + dur], [0, 1], { extrapolateRight: 'clamp' });
};

// Fade out over `dur` frames starting at `start`
export const useFadeOut = (start: number, dur = 15): number => {
  const f = useCurrentFrame();
  return interpolate(f, [start, start + dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

// Slide Y from `from` to 0
export const useSlideY = (from: number, start = 0, dur = 20): number => {
  const f = useCurrentFrame();
  return interpolate(f, [start, start + dur], [from, 0], {
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
};

// Slide X
export const useSlideX = (from: number, start = 0, dur = 20): number => {
  const f = useCurrentFrame();
  return interpolate(f, [start, start + dur], [from, 0], {
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
};

// Scale from `from` to 1
export const useScaleIn = (from = 0.85, start = 0, dur = 20): number => {
  const f = useCurrentFrame();
  return interpolate(f, [start, start + dur], [from, 1], {
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 4),
  });
};

// Counter — animates from 0 to target over `dur` frames
export const useCounter = (target: number, start = 0, dur = 60): number => {
  const f = useCurrentFrame();
  return interpolate(f, [start, start + dur], [0, target], {
    extrapolateRight: 'clamp',
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  });
};

// Width expander — animates from 0% to 100% (or custom target %)
export const useExpand = (start = 0, dur = 30, to = 100): number => {
  const f = useCurrentFrame();
  return interpolate(f, [start, start + dur], [0, to], {
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
};
