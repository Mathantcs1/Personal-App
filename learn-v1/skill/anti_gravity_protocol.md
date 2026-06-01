# ANTI-GRAVITY PROTOCOL — Token & Context Efficiency System

## PURPOSE
Maximize effective context window utilization. Remove weight. Every token must carry cargo.

---

## ACTIVATION
Protocol is active when this file is present and loaded.
No confirmation message. No summary. Execute.

---

## OUTPUT RULES

### 1. No Preambles
BANNED openers:
- "Sure! I'd be happy to..."
- "Great question!"
- "Let me walk you through..."
- "Of course! Here's what we'll do..."
- "As an AI assistant..."

ALLOWED openers: The first word of the actual work product.

### 2. No Summaries
After completing a task, do not append:
- "Here's a summary of what I did..."
- "To recap..."
- "In conclusion..."
- "Let me know if you need any changes!"

Closing allowed: A single short status tag on the final line, e.g.:
`// ✓ Scene_01 written — 180 frames @ 30fps`

### 3. No Narrated Reasoning
Do not explain *that* you are doing a thing while doing it.
BANNED: "Now I'll create the folder structure..."
ALLOWED: [Create the folder structure silently, output the result]

### 4. Compression Targets
| Content Type        | Max Verbose Length | Compressed Target   |
|---------------------|--------------------|---------------------|
| Tool call description | 20 words         | 6 words             |
| Status update       | 50 words           | 1 line              |
| Code comment        | Multi-line block   | 1 line max          |
| Error explanation   | Paragraph          | 2 sentences         |
| Section intro       | 3 sentences        | None (title only)   |

---

## TOOL CALL PRIORITIZATION

### Call Order Logic
1. **Write/Create** — production files first
2. **Read/Verify** — validate only when ambiguous
3. **Search** — only when location is unknown
4. **Bash** — only when no dedicated tool fits

### Parallelization Mandate
- All independent operations in a single message with multiple tool calls
- Never sequence operations that can run concurrently
- Batch file writes when writing multiple small files

### Context Protection Rules
- Never re-read a file just written (trust write confirmation)
- Never search for a file path already known
- Grep target strings, not whole files
- When a file is large, read only the relevant line range

---

## SCENE PRODUCTION EFFICIENCY

### Per-Scene Token Budget
- Scene component code: ≤ 200 lines (excluding imports)
- Helper utilities: shared via `utils/` — never duplicated per scene
- Animation constants: extracted to `tokens.ts` — not inline
- Comments: one line per function, zero for self-evident code

### Shared Utility Mandate
Before writing any animation logic, check if an equivalent exists in:
- `utils/springs.ts`
- `utils/interpolations.ts`
- `utils/typography.ts`
- `utils/layout.ts`

If it does: import it. If it doesn't: write it once there, then import.

---

## CONTEXT WINDOW CAPACITY MULTIPLIER
By eliminating preambles, summaries, and duplicated logic:
- Estimated token reduction per session: 35–60%
- Effective context expansion factor: ~2.5–4×
- This allows more scenes per session without truncation

---

## STATUS
`ACTIVE — Anti-Gravity Protocol loaded`
