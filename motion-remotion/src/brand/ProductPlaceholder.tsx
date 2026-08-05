import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors } from "./tokens";

export type ProductPlaceholderProps = {
  /** Visual stand-in until real cutout is wired */
  kind?: "console" | "door" | "vanity" | "fixture";
  /** Push-in scale over [start, end] frames */
  push?: [number, number];
  pushAmount?: number;
  color?: string;
  accent?: string;
};

/**
 * Geometric stand-in for isolated product cutouts.
 * Replace with <Img src={staticFile(...)} /> once cutouts exist.
 */
export const ProductPlaceholder: React.FC<ProductPlaceholderProps> = ({
  kind = "console",
  push = [0, 90],
  pushAmount = 0.05,
  color = colors.white,
  accent = colors.brass,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, push, [1, 1 + pushAmount], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shadow = interpolate(frame, push, [0.12, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (kind === "door") {
    return (
      <div
        style={{
          width: 280,
          height: 520,
          transform: `scale(${scale})`,
          background: colors.ink,
          borderRadius: 4,
          boxShadow: `0 28px 60px rgba(26,24,24,${shadow})`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: `2px solid ${colors.soft}`,
            borderRadius: 2,
            opacity: 0.35,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 36,
            top: "45%",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: accent,
          }}
        />
      </div>
    );
  }

  // console / vanity / fixture — white basin + brass legs
  return (
    <div
      style={{
        width: 340,
        transform: `scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 300,
          height: 140,
          background: color,
          borderRadius: 8,
          boxShadow: `0 24px 50px rgba(26,24,24,${shadow})`,
          border: `1px solid rgba(26,24,24,0.08)`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "18%",
            right: "18%",
            top: 28,
            bottom: 22,
            borderRadius: 6,
            background: "rgba(26,24,24,0.04)",
            border: "1px solid rgba(26,24,24,0.06)",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: 260,
          marginTop: -4,
        }}
      >
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 160,
              background: accent,
              borderRadius: 2,
            }}
          />
        ))}
      </div>
      <div
        style={{
          width: 220,
          height: 8,
          background: accent,
          marginTop: -8,
          opacity: 0.85,
        }}
      />
    </div>
  );
};
