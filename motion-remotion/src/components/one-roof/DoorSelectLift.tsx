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

type DoorSelectLiftProps = {
  aisleSrc: string;
  doorSrc: string;
  /** Local frames: 0 = start of select sequence */
  selectEnd?: number;
  liftEnd?: number;
  /** "contain" for transparent cutout heroes (adds grounding shadow) */
  doorFit?: "cover" | "contain";
};

/**
 * Shop select (thin rust line snap) -> lift door into cream/ink graphic void.
 * No UI chrome. Only a thin rust select rect and the product.
 */
export const DoorSelectLift: React.FC<DoorSelectLiftProps> = ({
  aisleSrc,
  doorSrc,
  selectEnd = 50,
  liftEnd = 86,
  doorFit = "cover",
}) => {
  const frame = useCurrentFrame();

  const borderOpacity = interpolate(
    frame,
    [3, 9, selectEnd - 5, selectEnd],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  // Snap-in: inset collapses faster (4->12 was soft; now 3->10)
  const borderInset = interpolate(frame, [3, 10], [22, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const aisleOpacity = interpolate(
    frame,
    [selectEnd - 4, liftEnd - 14],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Opus PRODUCT-VOID-FIX: hero owns frame — 75% height, land at scale 1.0
  const DOOR_H = 1440;
  const DOOR_W = Math.round(DOOR_H * 0.43); // ~620 native aspect

  const doorScale = interpolate(
    frame,
    [selectEnd - 6, liftEnd],
    [0.42, 1],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const doorY = interpolate(frame, [selectEnd - 6, liftEnd], [56, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const voidReveal = interpolate(frame, [selectEnd, liftEnd - 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      {/* Designed void: cream core sized to product, ink to every edge */}
      <AbsoluteFill
        style={{
          opacity: voidReveal,
          background: `radial-gradient(ellipse 640px 1000px at 50% 44%, ${colors.cream} 0%, ${colors.parchment} 40%, ${colors.ink} 90%)`,
        }}
      />

      {/* Aisle plate */}
      <AbsoluteFill style={{ opacity: aisleOpacity }}>
        <Img
          src={staticFile(aisleSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(26,24,24,0.2) 0%, rgba(26,24,24,0.5) 100%)",
          }}
        />
        {/* Select border: thin rust line only */}
        <div
          style={{
            position: "absolute",
            left: `calc(38% + ${borderInset}px)`,
            top: `calc(12% + ${borderInset}px)`,
            width: `calc(24% - ${borderInset * 2}px)`,
            height: `calc(76% - ${borderInset * 2}px)`,
            border: `2px solid ${colors.rust}`,
            opacity: borderOpacity,
            boxSizing: "border-box",
          }}
        />
      </AbsoluteFill>

      {/* Hero door owns the tall axis — no postage-stamp */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: interpolate(frame, [selectEnd - 8, selectEnd - 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: DOOR_W,
            height: DOOR_H,
            maxWidth: 840,
            transform: `translateY(calc(${doorY}px - 3%)) scale(${doorScale})`,
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
                  ? "drop-shadow(0 36px 34px rgba(26,24,24,0.32))"
                  : undefined,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
