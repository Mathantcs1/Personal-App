# SCENE COMPOSITION — Visual Translation Protocol

## PRIME DIRECTIVE
**NEVER copy script sentences verbatim onto screen.**
Every scene must visually *embody* the meaning, emotion, and argument of its narrative moment.
The script is a semantic map — extract its core idea and build a motion metaphor around it.

---

## Translation Framework

### Step 1 — Semantic Extraction
Read the script segment. Identify:
- **Core Claim** — the one argument being made
- **Emotional Register** — tension / awe / momentum / confrontation / revelation
- **Data Anchor** — any number, stat, or comparative fact present
- **Implied Visual** — what physical/spatial metaphor lives inside the language

### Step 2 — Motion Metaphor Assignment
| Narrative Type     | Visual Metaphor Strategy                                           |
|--------------------|---------------------------------------------------------------------|
| Contrast/Compare   | Split-screen morphing panels, before/after wipe, diverging paths   |
| Growth / Scale     | Expanding geometry, zoom-out reveal, counter climbing              |
| Problem statement  | Fragmenting type, visual noise intrusion, red signal alert         |
| Revelation         | Masked wipe, spotlight iris, data point materializing from void    |
| Process / System   | Flow diagram, animated node graph, orbital loop                    |
| Human behavior     | Abstract avatar silhouettes, heat-map overlays, behavioral arc     |
| Momentum           | Velocity lines, kinetic typography, cascading tile reveals         |

### Step 3 — Spatial Composition Rules
- **Primary focal point**: Never center unless intentional authority framing
- **Rule of thirds**: Place anchoring element at 1/3 intersection by default
- **Depth layers**: Minimum 3 z-index layers — background field, mid-layer, foreground text
- **Safe margins**: 80px inset on all edges for 1080p; scale proportionally
- **Motion direction**: Left→Right = progress/forward; Right→Left = regression/challenge
- **Vertical motion**: Up = growth/reveal; Down = weight/authority/gravity

### Step 4 — Pacing Contract
| Scene Duration | Max Distinct Elements | Recommended Transitions |
|----------------|----------------------|-------------------------|
| 0–3s           | 2                    | Instant cut / flash     |
| 3–6s           | 4                    | Spring entrance         |
| 6–12s          | 6                    | Sequence stagger        |
| 12s+           | 8                    | Phased reveal           |

---

## Hard Rules

1. **No direct transcription** — script words may appear as 1–4 word abstracted fragments only
2. **No static frames** — every element must have at least one animated property over its lifetime
3. **Visual hierarchy first** — one dominant element per scene, all others subordinate
4. **Color tells story** — palette shifts must reflect narrative tone shifts
5. **Whitespace is active** — negative space is a compositional tool, not empty waste
6. **Transition = punctuation** — hard cut = period, dissolve = comma, wipe = dash, morph = parenthetical

---

## Scene File Structure
Each scene component must export:
```tsx
export const Scene_XX: React.FC = () => { ... }
export const Scene_XX_meta = {
  id: 'Scene_XX',
  duration: 180,         // frames at 30fps
  narrativeSlice: '',    // one sentence describing what this scene argues
  visualMetaphor: '',    // one sentence describing the motion metaphor used
  palette: [],           // hex array
}
```
