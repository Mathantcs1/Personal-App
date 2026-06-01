#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# REMOTION BULK RENDER — Three Reasons Mr Beast Has Mastered the Art of Retention
# Output: learn-v1/out/  (1080p MP4, h.264, 30fps)
# Usage:  bash render_all.sh
#         bash render_all.sh 4k          → renders at 3840×2160
#         bash render_all.sh scene 13    → renders only Scene_13
# ─────────────────────────────────────────────────────────────────────────────
set -e
cd "$(dirname "$0")/remotion-project"

MODE="${1:-all}"
SCENE_ID="${2:-}"
OUT_DIR="../out"
mkdir -p "$OUT_DIR"

# Resolution
if [ "$MODE" = "4k" ]; then
  SCALE="--scale=2"
  SUFFIX="_4k"
  echo "Rendering in 4K (3840×2160)"
else
  SCALE=""
  SUFFIX=""
fi

RENDER_OPTS="--codec=h264 --crf=18 --fps=30 $SCALE"

SCENES=(
  Scene_01 Scene_02 Scene_03 Scene_04 Scene_05
  Scene_06 Scene_07 Scene_08 Scene_09 Scene_10
  Scene_11 Scene_12 Scene_13 Scene_14 Scene_15
  Scene_16 Scene_17 Scene_18 Scene_19 Scene_20
  Scene_13_v2_camLeft
  Scene_13_v2_chromakey
  Scene_13_v3_pngInject
)

render_scene() {
  local ID="$1"
  local OUT="$OUT_DIR/${ID}${SUFFIX}.mp4"
  echo "▶ Rendering $ID → $OUT"
  npx remotion render src/index.ts "$ID" "$OUT" $RENDER_OPTS
  echo "✓ $ID complete"
}

if [ "$MODE" = "scene" ] && [ -n "$SCENE_ID" ]; then
  render_scene "Scene_${SCENE_ID}"
  exit 0
fi

# Render all
TOTAL=${#SCENES[@]}
COUNT=0
for SCENE in "${SCENES[@]}"; do
  COUNT=$((COUNT + 1))
  echo "[$COUNT/$TOTAL] Starting $SCENE"
  render_scene "$SCENE"
done

echo ""
echo "════════════════════════════════════════"
echo "  ALL RENDERS COMPLETE — $OUT_DIR/"
echo "  Total: $TOTAL clips"
echo "════════════════════════════════════════"
