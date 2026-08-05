import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";
import { colors } from "../brand/tokens";
import type { RoofBeat } from "./OneRoofSerif";
import { Stack } from "./OneRoofSerif";

export type BCVideoBeat = RoofBeat & {
  /** Motion clip in public/, plays instead of a photo. Clip supplies its own camera move. */
  video?: string;
  /** Seconds into the source clip to start from */
  startAt?: number;
};

export type BCSerifSpotProps = {
  beats: BCVideoBeat[];
};

/**
 * First real commercial: serif prestige beats over VERIFIED motion clips of
 * finished Builders Corner rooms. Same type grammar as OneRoofSerif; video
 * beats play flat (no extra scale — the clips carry their own camera moves).
 */
const VideoBeat: React.FC<{ beat: BCVideoBeat }> = ({ beat }) => (
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
    <Stack beat={{ ...beat, photo: beat.video }} />
  </AbsoluteFill>
);

export const BCSerifSpot: React.FC<BCSerifSpotProps> = ({ beats }) => {
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      {beats.map((beat, i) => {
        const seq = (
          <Sequence
            key={i}
            from={from}
            durationInFrames={beat.frames}
            premountFor={45}
            name={`B${i + 1}-${beat.name ?? beat.video ?? "void"}`}
          >
            {beat.video ? <VideoBeat beat={beat} /> : null}
          </Sequence>
        );
        from += beat.frames;
        return seq;
      })}
    </AbsoluteFill>
  );
};

export const BC_SPOT_BEATS: BCVideoBeat[] = [
  {
    video: "bc-clips/clip-bc-darkshaker-push.mp4",
    startAt: 0.4,
    intro: "Built by",
    name: "Builders Corner",
    tag: "WAUSAU · SINCE 1983",
    frames: 84,
  },
  { video: "bc-clips/clip-bc-whitebright-push.mp4", startAt: 1.0, name: "Kitchens", anchor: "low", frames: 56 },
  { video: "bc-clips/clip-bc-woodrange-push.mp4", startAt: 1.2, frames: 50 },
  { video: "bc-clips/clip-bc-vanity-push.mp4", startAt: 1.0, name: "Baths", anchor: "low", frames: 56 },
  { video: "bc-clips/clip-bc-flooring-drift.mp4", startAt: 1.2, name: "Floors", anchor: "low", frames: 50 },
  { video: "bc-clips/clip-bc-shiplap-glow.mp4", startAt: 1.0, frames: 56 },
  {
    video: "bc-clips/clip-bc-hero-push.mp4",
    startAt: 0.6,
    intro: "Designed, built, and installed",
    name: "Under One Roof",
    tag: "BUILDERS CORNER · WAUSAU",
    frames: 98,
  },
];

export const BC_SPOT_DURATION = BC_SPOT_BEATS.reduce((s, b) => s + b.frames, 0);
