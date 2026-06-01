import React from 'react';
import { Composition } from 'remotion';
import {
  Scene_01, Scene_01_meta,
  Scene_02, Scene_02_meta,
  Scene_03, Scene_03_meta,
  Scene_04, Scene_04_meta,
  Scene_05, Scene_05_meta,
  Scene_06, Scene_06_meta,
  Scene_07, Scene_07_meta,
  Scene_08, Scene_08_meta,
  Scene_09, Scene_09_meta,
  Scene_10, Scene_10_meta,
  Scene_11, Scene_11_meta,
  Scene_12, Scene_12_meta,
  Scene_13, Scene_13_meta,
  Scene_14, Scene_14_meta,
  Scene_15, Scene_15_meta,
  Scene_16, Scene_16_meta,
  Scene_17, Scene_17_meta,
  Scene_18, Scene_18_meta,
  Scene_19, Scene_19_meta,
  Scene_20, Scene_20_meta,
  Scene_13_v2_camLeft,
  Scene_13_v2_chromakey,
  Scene_13_v3_pngInject,
} from './scenes';

const W = 1920, H = 1080, FPS = 30;

const SCENES = [
  [Scene_01, Scene_01_meta], [Scene_02, Scene_02_meta], [Scene_03, Scene_03_meta],
  [Scene_04, Scene_04_meta], [Scene_05, Scene_05_meta], [Scene_06, Scene_06_meta],
  [Scene_07, Scene_07_meta], [Scene_08, Scene_08_meta], [Scene_09, Scene_09_meta],
  [Scene_10, Scene_10_meta], [Scene_11, Scene_11_meta], [Scene_12, Scene_12_meta],
  [Scene_13, Scene_13_meta], [Scene_14, Scene_14_meta], [Scene_15, Scene_15_meta],
  [Scene_16, Scene_16_meta], [Scene_17, Scene_17_meta], [Scene_18, Scene_18_meta],
  [Scene_19, Scene_19_meta], [Scene_20, Scene_20_meta],
] as const;

export const RemotionRoot: React.FC = () => (
  <>
    {/* Individual scene compositions */}
    {SCENES.map(([Component, meta]: any) => (
      <Composition
        key={meta.id}
        id={meta.id}
        component={Component}
        durationInFrames={meta.duration}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}

    {/* Variants */}
    <Composition id="Scene_13_v2_camLeft"    component={Scene_13_v2_camLeft}    durationInFrames={240} fps={FPS} width={W} height={H} />
    <Composition id="Scene_13_v2_chromakey"  component={Scene_13_v2_chromakey}  durationInFrames={240} fps={FPS} width={W} height={H} />
    <Composition id="Scene_13_v3_pngInject"  component={Scene_13_v3_pngInject}  durationInFrames={240} fps={FPS} width={W} height={H} />

    {/* Full sequence — all scenes concatenated */}
    {/* Use @remotion/series or manual offsetting via <Sequence> for a single timeline render */}
  </>
);
