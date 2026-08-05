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

export type PhotoBedPlate = {
  src: string;
  from: number;
  to: number;
  objectPosition?: string;
  /** cover (default) or contain for wide plates in 9:16 */
  objectFit?: "cover" | "contain";
  /** Override bed transition for this plate */
  fade?: number;
  scaleFrom?: number;
  scaleTo?: number;
};

type PhotoBedProps = {
  plates: readonly PhotoBedPlate[];
  washOpacity?: number;
  /** dissolve = soft cake; cut = hard store snaps (Opus craft) */
  transition?: "dissolve" | "cut";
  /** Default Ken Burns endpoints when plate omits scaleFrom/To */
  scaleFrom?: number;
  scaleTo?: number;
  /** On cut mode: brief overshoot settle */
  cutSnap?: boolean;
};

/**
 * Photo bed — cake dissolves / store hard cuts.
 * @see docs/motion/CRAFT-CRITIQUE-OPUS.md
 */
export const PhotoBed: React.FC<PhotoBedProps> = ({
  plates,
  washOpacity = 0,
  transition = "dissolve",
  scaleFrom = 1,
  scaleTo = 1.04,
  cutSnap = false,
}) => {
  const frame = useCurrentFrame();
  const defaultFade = transition === "cut" ? 1 : 8;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      {plates.map((plate) => {
        const fade = plate.fade ?? defaultFade;
        const s0 = plate.scaleFrom ?? scaleFrom;
        const s1 = plate.scaleTo ?? scaleTo;

        let opacity: number;
        if (transition === "cut" && fade <= 2) {
          opacity =
            frame >= plate.from && frame < plate.to
              ? 1
              : 0;
        } else {
          opacity = interpolate(
            frame,
            [plate.from, plate.from + fade, plate.to - fade, plate.to],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
        }

        let scale = interpolate(frame, [plate.from, plate.to], [s0, s1], {
          easing: Easing.bezier(0.45, 0, 0.55, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        if (cutSnap && transition === "cut" && frame >= plate.from && frame < plate.to) {
          const local = frame - plate.from;
          const snap = interpolate(local, [0, 4], [1.06, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          scale = scale * snap;
        }

        if (opacity <= 0.001) return null;
        return (
          <AbsoluteFill key={`${plate.src}-${plate.from}`} style={{ opacity }}>
            <Img
              src={staticFile(plate.src)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: plate.objectFit ?? "cover",
                objectPosition: plate.objectPosition ?? "center center",
                transform: `scale(${scale})`,
              }}
            />
          </AbsoluteFill>
        );
      })}
      {washOpacity > 0.001 ? (
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, rgba(26,24,24,${washOpacity * 0.5}) 0%, rgba(26,24,24,${washOpacity * 0.2}) 42%, rgba(26,24,24,${washOpacity + 0.18}) 100%)`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
