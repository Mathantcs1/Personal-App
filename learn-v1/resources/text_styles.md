# TEXT STYLES — Design Typography System

## Font Stack (Geometric Sans Priority)
```
Primary:    'Inter', 'DM Sans', 'Geist', sans-serif
Display:    'Space Grotesk', 'Outfit', sans-serif
Mono:       'JetBrains Mono', 'Space Mono', monospace
Fallback:   system-ui, -apple-system, BlinkMacSystemFont
```

## Weight Scale
| Token       | Weight | Use Case                          |
|-------------|--------|-----------------------------------|
| `thin`      | 100    | Ghost labels, watermarks          |
| `light`     | 300    | Body copy, sub-captions           |
| `regular`   | 400    | Default body, UI labels           |
| `medium`    | 500    | Cards, stat readouts              |
| `semibold`  | 600    | Section headers, callouts         |
| `bold`      | 700    | Titles, key metrics               |
| `black`     | 900    | Hero display, impact words        |

## Title Heading Sizes (1080p baseline, scale ×1.78 for 4K)
| Level  | px   | Line Height | Letter Spacing | Role                    |
|--------|------|-------------|----------------|-------------------------|
| H1     | 96px | 1.0         | -4px           | Scene title / hero word |
| H2     | 64px | 1.1         | -2px           | Sub-section header      |
| H3     | 48px | 1.2         | -1px           | Card headline           |
| H4     | 36px | 1.3         | 0              | Callout / stat label    |
| Body   | 24px | 1.5         | +0.2px         | Explanatory copy        |
| Caption| 16px | 1.4         | +0.5px         | Footnotes, source tags  |
| Micro  | 11px | 1.2         | +1px           | HUD readouts, tickers   |

## Tracking / Letter-Spacing Map
| Context               | Value  |
|-----------------------|--------|
| Display ultra-wide    | -5px   |
| Editorial tight       | -2px   |
| Default               | 0      |
| ALL-CAPS label        | +3px   |
| Ticker / broadcast    | +1.5px |
| Micro HUD             | +2px   |

## Color Tokens
```
--text-primary:    #FFFFFF
--text-secondary:  rgba(255,255,255,0.65)
--text-muted:      rgba(255,255,255,0.35)
--text-accent:     #F5C518       /* cinematic gold */
--text-danger:     #FF3B30
--text-live:       #00FF87       /* broadcast green */
--text-data:       #4FC3F7       /* telemetry blue */
--bg-dark:         #0A0A0A
--bg-panel:        #111111
--bg-overlay:      rgba(0,0,0,0.72)
```

## Remotion Usage Pattern
```tsx
// Load via @remotion/google-fonts or staticFile()
import { loadFont } from '@remotion/google-fonts/Inter';
const { fontFamily } = loadFont();

const titleStyle: React.CSSProperties = {
  fontFamily,
  fontWeight: 900,
  fontSize: 96,
  letterSpacing: -4,
  lineHeight: 1.0,
  color: 'var(--text-primary)',
};
```

## Animation Typography Rules
- Kinetic text: reveal per-character with stagger ≤ 30ms between chars
- Never animate font-size directly; use `scale()` transforms
- Headline entrances: translate Y +40px → 0 with spring({ damping: 18, stiffness: 120 })
- Exit: opacity fade 0.2s, no position shift unless scene demands it
- ALL-CAPS reserved for labels, HUDs, broadcast overlays — never body copy
