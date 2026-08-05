import { loadFont } from "@remotion/google-fonts/Montserrat";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, typeWeights } from "./tokens";

const { fontFamily } = loadFont("normal", {
  weights: ["300", "700"],
  subsets: ["latin"],
});

export type WeightStackProps = {
  line1: string;
  line2?: string;
  brand: string;
  /** Frames when type becomes fully visible */
  fadeIn?: [number, number];
  color?: string;
  align?: "left" | "center";
  /** Scale relative to 1080-wide */
  scale?: number;
};

/**
 * Locked type recipe: sans 300 lead-in + 700 brand lock.
 * All caps. Optional indented second skinny line.
 */
export const WeightStack: React.FC<WeightStackProps> = ({
  line1,
  line2,
  brand,
  fadeIn = [0, 18],
  color = colors.ink,
  align = "left",
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, fadeIn, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, fadeIn, [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const skinnySize = 42 * scale;
  const boldSize = 72 * scale;

  return (
    <div
      style={{
        fontFamily,
        color,
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: align,
        textTransform: "uppercase",
        lineHeight: 0.94,
        letterSpacing: "0.02em",
      }}
    >
      <div
        style={{
          fontWeight: Number(typeWeights.skinny),
          fontSize: skinnySize,
        }}
      >
        {line1}
      </div>
      {line2 ? (
        <div
          style={{
            fontWeight: Number(typeWeights.skinny),
            fontSize: skinnySize,
            paddingLeft: align === "left" ? "1.35em" : undefined,
          }}
        >
          {line2}
        </div>
      ) : null}
      <div
        style={{
          fontWeight: Number(typeWeights.bold),
          fontSize: boldSize,
          letterSpacing: "-0.01em",
          marginTop: 4,
          whiteSpace: "pre-line",
        }}
      >
        {brand}
      </div>
    </div>
  );
};

export const BrandLockupTiny: React.FC<{
  text: string;
  color?: string;
  fadeIn?: [number, number];
}> = ({ text, color = colors.ink, fadeIn = [0, 12] }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, fadeIn, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        fontFamily,
        fontWeight: Number(typeWeights.bold),
        fontSize: 22,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color,
        opacity,
      }}
    >
      {text}
    </div>
  );
};

/** Full-bleed ground helper */
export const Ground: React.FC<{
  color: string;
  children?: React.ReactNode;
}> = ({ color, children }) => (
  <AbsoluteFill style={{ backgroundColor: color }}>{children}</AbsoluteFill>
);
