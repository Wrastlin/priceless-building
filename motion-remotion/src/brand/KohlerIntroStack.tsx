import { loadFont } from "@remotion/google-fonts/Montserrat";
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors, typeWeights } from "./tokens";

/** Italic lead-in (Kohler Shorts "Introducing"). */
const italicFace = loadFont("italic", {
  weights: ["300"],
  subsets: ["latin"],
});

/** Upright bold + skinny (hero + category). */
const normalFace = loadFont("normal", {
  weights: ["300", "700"],
  subsets: ["latin"],
});

export type KohlerIntroStackProps = {
  italic?: string;
  bold: string;
  skinny?: string;
  fadeIn?: [number, number];
  color?: string;
  align?: "left" | "center";
  /**
   * Absolute scale on 1080×1920 display metrics (Opus type floor).
   * Punch void should stay near 1. Do not use scale to "keep type small."
   */
  scale?: number;
  /** Real mid-film slam only. Close/punch: leave false (hard cut). */
  slam?: boolean;
  /** Display punch: larger hero (FOR/LESS). Default true for void graphics. */
  display?: boolean;
};

/**
 * Kohler Shorts type for 9:16 — Opus-locked display metrics.
 * @see docs/motion/TYPE-CRITIQUE-OPUS.md
 */
export const KohlerIntroStack: React.FC<KohlerIntroStackProps> = ({
  italic,
  bold,
  skinny,
  fadeIn = [0, 8],
  color = colors.cream,
  align = "center",
  scale = 1,
  slam = false,
  display = true,
}) => {
  const frame = useCurrentFrame();

  const fadeEnd = slam ? fadeIn[0] + 4 : fadeIn[1];
  const opacity = interpolate(frame, [fadeIn[0], fadeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [fadeIn[0], fadeEnd], [slam ? 20 : 0, 0], {
    easing: slam
      ? Easing.bezier(0.16, 1, 0.3, 1)
      : Easing.linear,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Real slam only when requested (mid-film). Close = hard cut.
  const slamScale = slam
    ? interpolate(frame, [fadeIn[0], fadeIn[0] + 4], [1.16, 1], {
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Opus absolute floors @ 1080×1920 (display punch)
  const italicSize = (display ? 58 : 44) * scale;
  const boldSize = (display ? 210 : 124) * scale;
  const skinnySize = (display ? 30 : 22) * scale;

  return (
    <div
      style={{
        color,
        opacity,
        transform: `translateY(${y - 48}px) scale(${slamScale})`,
        textAlign: align,
        lineHeight: 1,
        width: "100%",
        maxWidth: 936 * scale,
        marginLeft: align === "center" ? "auto" : undefined,
        marginRight: align === "center" ? "auto" : undefined,
        paddingLeft: 0,
        paddingRight: 0,
        boxSizing: "border-box",
      }}
    >
      {italic ? (
        <div
          style={{
            fontFamily: italicFace.fontFamily,
            fontStyle: "italic",
            fontWeight: Number(typeWeights.skinny),
            fontSize: italicSize,
            letterSpacing: "0.02em",
            textTransform: "none",
            marginBottom: 34 * scale,
            lineHeight: 1.15,
          }}
        >
          {italic}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: normalFace.fontFamily,
          fontWeight: Number(typeWeights.bold),
          fontSize: boldSize,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          lineHeight: display ? 0.86 : 0.9,
          whiteSpace: "pre-line",
        }}
      >
        {bold}
      </div>
      {skinny ? (
        <div
          style={{
            fontFamily: normalFace.fontFamily,
            fontWeight: Number(typeWeights.skinny),
            fontSize: skinnySize,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            marginTop: 44 * scale,
            lineHeight: 1.2,
          }}
        >
          {skinny}
        </div>
      ) : null}
    </div>
  );
};
