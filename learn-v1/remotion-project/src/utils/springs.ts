import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { EASING } from './tokens';

// Shared spring interpolation helpers
export const useSpringIn = (
  delay = 0,
  config = EASING.spring
): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

export const useSnappyIn = (delay = 0): number =>
  useSpringIn(delay, EASING.snappy);

export const useHeavyIn = (delay = 0): number =>
  useSpringIn(delay, EASING.heavy);

// Staggered spring for N items — returns array of progress values
export const useStaggerSprings = (
  count: number,
  staggerFrames = 6,
  config = EASING.spring
): number[] => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return Array.from({ length: count }, (_, i) =>
    spring({ frame: frame - i * staggerFrames, fps, config })
  );
};
