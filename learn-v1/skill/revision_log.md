# REVISION LOG

## Scene_13 → Scene_13_v2_camLeft
- Trigger: Webcam screen split re-anchoring — graphics to left 35%
- Delta: All elements rescaled and repositioned into PANEL_W = W * 0.35 (672px). Right 65% fully cleared for webcam overlay. Font sizes reduced proportionally. Phone mockup scaled down. Separator line at 672px marks webcam boundary.
- Render: Untested (ready for npx remotion render)

## Scene_13 → Scene_13_v2_chromakey
- Trigger: Green-screen background for chroma keying in DaVinci Resolve / Premiere
- Delta: Background replaced with #00B140 (Broadcast-safe chroma green, Hue 141°). All animated elements use Magenta (#FF0050), Orange (#FF6B00), Purple (#A855F7) — all >100° hue distance from key color. Full keying instructions in component header comment.
- Render: Untested (ready for npx remotion render)

## Scene_13 → Scene_13_v3_pngInject
- Trigger: PNG custom thumbnail ingestion — replace vector phone screen with real image assets
- Delta: Phone screen area (306×560px) now renders <Img> components loaded via staticFile(). PNG_ASSETS array at top of file controls which files load and how long each holds. Crossfade between PNGs over 10 frames. Status bar and notch overlay preserved above PNG content. Place PNGs in: learn-v1/remotion-project/public/pngs/
- Render: Untested (requires PNG files in public/pngs/ to avoid 404)
