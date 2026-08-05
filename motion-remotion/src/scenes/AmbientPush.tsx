import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type AmbientPushProps = {
  photo: string;
  /** Final scale after the push (1.0 = none) */
  zoomTo: number;
};

/**
 * Camera-move fallback when generated travel keeps walking (2026-07-23):
 * a mathematically perfect push on a real photo. Linear scale = constant
 * speed, zero shake, zero pauses, by construction. Rendered at 60fps.
 */
export const AmbientPush: React.FC<AmbientPushProps> = ({ photo, zoomTo }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames - 1], [1, zoomTo]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Img
          src={staticFile(photo)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
