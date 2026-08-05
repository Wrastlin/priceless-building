import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { colors } from "../brand/tokens";
import type { RoofBeat } from "./OneRoofSerif";
import { Stack } from "./OneRoofSerif";
import type { BCVideoBeat } from "./BCSerifSpot";

export type BCUnitProps = {
  sceneA: BCVideoBeat;
  sceneB: BCVideoBeat;
  /** Frames of overlap for the seam */
  transitionFrames: number;
};

/**
 * Small-stages doctrine (Aaron, 2026-07-23): the unit of ad production is TWO
 * scenes stitched with ONE excellent seam. Units get perfected and approved
 * individually, then blended into bigger ads. Seam = @remotion/transitions
 * fade by default; a generated kling start->end transition can replace it
 * later without touching the scenes.
 */
const Scene: React.FC<{ beat: BCVideoBeat }> = ({ beat }) => (
  <AbsoluteFill style={{ backgroundColor: colors.ink, overflow: "hidden" }}>
    <OffthreadVideo
      src={staticFile(beat.video!)}
      muted
      startFrom={Math.round((beat.startAt ?? 0) * 30)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.02) 58%, rgba(0,0,0,0.34) 100%)",
      }}
    />
    {beat.name || beat.intro ? (
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 720px 520px at 50% ${
            beat.anchor === "low" ? "76%" : "50%"
          }, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0) 72%)`,
        }}
      />
    ) : null}
    <Stack beat={{ ...beat, photo: beat.video } as RoofBeat} />
  </AbsoluteFill>
);

export const BCUnit: React.FC<BCUnitProps> = ({ sceneA, sceneB, transitionFrames }) => (
  <AbsoluteFill style={{ backgroundColor: colors.ink }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={sceneA.frames}>
        <Scene beat={sceneA} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />
      <TransitionSeries.Sequence durationInFrames={sceneB.frames}>
        <Scene beat={sceneB} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);

export const UNIT_01: BCUnitProps = {
  sceneA: {
    video: "bc-clips/clip-bc-darkshaker-push.mp4",
    startAt: 0.4,
    intro: "Built by",
    name: "Builders Corner",
    tag: "WAUSAU · SINCE 1983",
    frames: 126,
  },
  sceneB: {
    video: "bc-clips/clip-bc-whitebright-push.mp4",
    startAt: 0.8,
    name: "Kitchens",
    anchor: "low",
    frames: 126,
  },
  transitionFrames: 28,
};

export const bcUnitDuration = (p: BCUnitProps) =>
  p.sceneA.frames + p.sceneB.frames - p.transitionFrames;
