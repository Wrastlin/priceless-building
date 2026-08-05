import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { colors } from "../../brand/tokens";

export type HomeSlamSpec = {
  roomSrc: string;
  objectPosition?: string;
};

type DoorHomeSlamProps = {
  room: HomeSlamSpec;
  doorSrc: string;
  /** Door overlay position as % of frame */
  doorLeft?: string;
  doorTop?: string;
  doorWidth?: number;
  doorHeight?: number;
  /** "contain" for transparent cutout heroes (adds seating shadow) */
  doorFit?: "cover" | "contain";
};

/**
 * Hard slam: room hits + door overlays with overshoot scale.
 * Impact cut energy. Buff-adjacent punch, not dissolve. No chrome.
 */
export const DoorHomeSlam: React.FC<DoorHomeSlamProps> = ({
  room,
  doorSrc,
  doorLeft = "58%",
  doorTop = "14%",
  // ~35% of 1080 — believable installed door, not a floaty postage stamp
  doorWidth = 380,
  doorHeight = 720,
  doorFit = "cover",
}) => {
  const frame = useCurrentFrame();

  // Room: 1.2 -> 1 in 8f (was 1.1/12f)
  const roomScale = interpolate(frame, [0, 8], [1.2, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Door: 1.28 -> 1 in 9f starting frame 1 (was 1.14/14f)
  const doorScale = interpolate(frame, [1, 10], [1.28, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const doorOpacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${roomScale})` }}>
        <Img
          src={staticFile(room.roomSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: room.objectPosition ?? "center center",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(26,24,24,0.12) 0%, rgba(26,24,24,0.04) 50%, rgba(26,24,24,0.28) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: doorLeft,
          top: doorTop,
          width: doorWidth,
          height: doorHeight,
          opacity: doorOpacity,
          transform: `scale(${doorScale})`,
          transformOrigin: "center bottom",
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(doorSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: doorFit,
            objectPosition: "center center",
            filter:
              doorFit === "contain"
                ? "drop-shadow(0 22px 26px rgba(26,24,24,0.42))"
                : undefined,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
