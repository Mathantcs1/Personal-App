# SCENE REVISION BEHAVIOR — Version Control Protocol

## PRIME DIRECTIVE
**NEVER overwrite or destructively edit an existing scene file.**
All revisions produce new files. Original scenes are immutable once written.

---

## Versioning Schema

### File Naming Convention
```
Scene_01.tsx          ← original, locked
Scene_01_v2.tsx       ← first revision
Scene_01_v3.tsx       ← second revision
Scene_01_v2_camLeft.tsx  ← variant fork (specific modification type tag)
```

### Variant Tags Reference
| Tag Suffix        | Meaning                                                 |
|-------------------|---------------------------------------------------------|
| `_v2`, `_v3`      | Sequential creative revision                            |
| `_camLeft`        | Webcam split — elements compressed to left 35%         |
| `_camRight`       | Webcam split — elements compressed to right 35%        |
| `_chromakey`      | Green-screen background variant                        |
| `_pngInject`      | PNG asset injection variant                            |
| `_4k`             | 4K resolution override variant                         |
| `_portrait`       | 9:16 portrait reformat variant                         |

---

## Revision Workflow Steps

1. **Copy** the source file verbatim into a new file with the next version tag
2. **Document** the revision intent at the top of the new file in a single comment block:
   ```tsx
   // REVISION: Scene_XX_v2
   // PARENT: Scene_XX.tsx
   // CHANGE: [one sentence describing what was modified and why]
   // DATE: YYYY-MM-DD
   ```
3. **Apply** only the requested changes — do not refactor unrelated code
4. **Register** the new variant in `Composition.tsx` as a new `<Composition />` entry with a distinct `id`
5. **Never delete** the parent composition entry from `Composition.tsx`

---

## Scene Registry (`scenes/index.ts`)
All scene exports must be tracked here:
```ts
export { Scene_01 } from './Scene_01';
export { Scene_01_v2 } from './Scene_01_v2';
export { Scene_13 } from './Scene_13';
export { Scene_13_v2 } from './Scene_13_v2';
export { Scene_13_v2_camLeft } from './Scene_13_v2_camLeft';
// ... etc
```

---

## Comparison Notes File
When a revision is created, append an entry to `learn-v1/skill/revision_log.md`:
```
## Scene_XX → Scene_XX_v2
- Trigger: [user request summary]
- Delta: [what changed, what stayed same]
- Render: [tested / untested]
```

---

## Enforcement
- Any request phrased as "fix Scene X", "update Scene X", "change Scene X" = NEW version file
- Only exception: fixing broken syntax/compile errors in unreleased scenes = in-place edit allowed
- "Overwrite" as an explicit instruction requires explicit user confirmation before executing
