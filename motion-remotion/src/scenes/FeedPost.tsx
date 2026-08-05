import { loadFont } from "@remotion/google-fonts/Montserrat";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../brand/tokens";

const { fontFamily } = loadFont("normal", {
  weights: ["300", "700"],
  subsets: ["latin"],
});

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export type FeedPostProps = {
  title: string;
  label: string;
  src: string;
  /** Rotating ground/accent treatment */
  styleIndex?: number;
};

const STYLES = [
  { ground: colors.cream, on: colors.ink, band: colors.rust },
  { ground: colors.ink, on: colors.cream, band: colors.rust },
  { ground: colors.parchment, on: colors.ink, band: colors.sage },
  { ground: colors.ink, on: colors.cream, band: colors.brass },
] as const;

/**
 * Feed creative: lives on a feed like a photo with a little motion.
 * 4:5, 3.5s: band sweep + product slam-in, then a breathing hold.
 */
export const FeedPost: React.FC<FeedPostProps> = ({
  title,
  label,
  src,
  styleIndex = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const st = STYLES[styleIndex % STYLES.length];

  const sweep = interpolate(frame, [0, 12], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slam = interpolate(frame, [2, 11], [1.16, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enter = interpolate(frame, [2, 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Gentle breathe on the hold; period tuned to land near 1.0 at the cut.
  const breathe =
    1 + 0.011 * Math.sin((2 * Math.PI * Math.max(0, frame - 11)) / (durationInFrames - 11));
  const typeIn = interpolate(frame, [8, 16], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: st.ground, overflow: "hidden", fontFamily }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: 330,
          backgroundColor: st.band,
          transform: `scaleY(${sweep})`,
          transformOrigin: "top",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 64,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: "0.2em",
          color: st.on,
          opacity: typeIn,
        }}
      >
        PRICE-LESS
        <div
          style={{
            width: 132,
            height: 6,
            marginTop: 14,
            backgroundColor: st.band === colors.rust ? colors.rust : st.band,
          }}
        />
      </div>
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 40,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            maxHeight: 880,
            maxWidth: 760,
            objectFit: "contain",
            opacity: enter,
            transform: `scale(${slam * breathe})`,
            filter: "drop-shadow(0 34px 32px rgba(26,24,24,0.28))",
          }}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 64,
          color: st.on,
          opacity: typeIn,
          transform: `translateY(${interpolate(typeIn, [0, 1], [22, 0])}px)`,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 62,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            maxWidth: 700,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 18,
            fontWeight: 300,
            fontSize: 24,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
