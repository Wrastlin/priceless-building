import { loadFont } from "@remotion/google-fonts/Montserrat";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { KohlerIntroStack } from "../brand/KohlerIntroStack";
import { colors } from "../brand/tokens";

const { fontFamily } = loadFont("normal", {
  weights: ["300", "700"],
  subsets: ["latin"],
});

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export type ReelItem = {
  src: string;
  label: string;
};

export type CategoryReelProps = {
  /** Bold hook lines, newline separated (e.g. "STATEMENT\nSINKS") */
  hookBold: string;
  hookSkinny: string;
  items: ReelItem[];
};

/** Rotating accent treatments so consecutive beats never repeat. */
const BEAT_STYLES = [
  { ground: colors.cream, on: colors.ink, band: colors.rust, bandSide: "right" },
  { ground: colors.ink, on: colors.cream, band: colors.rust, bandSide: "left" },
  { ground: colors.parchment, on: colors.ink, band: colors.sage, bandSide: "right" },
  { ground: colors.ink, on: colors.cream, band: colors.brass, bandSide: "left" },
  { ground: colors.cream, on: colors.ink, band: colors.ink, bandSide: "right" },
  { ground: colors.sage, on: colors.ink, band: colors.cream, bandSide: "left" },
] as const;

const ProductBeat: React.FC<{
  item: ReelItem;
  styleIndex: number;
}> = ({ item, styleIndex }) => {
  const frame = useCurrentFrame();
  const st = BEAT_STYLES[styleIndex % BEAT_STYLES.length];
  const enter = interpolate(frame, [0, 9], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sweep = interpolate(frame, [0, 12], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 42], [1.06, 1.0], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: st.ground, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          [st.bandSide]: 0,
          width: 380,
          backgroundColor: st.band,
          transform: `scaleY(${sweep})`,
          transformOrigin: st.bandSide === "right" ? "top" : "bottom",
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={staticFile(item.src)}
          style={{
            maxHeight: 1150,
            maxWidth: 820,
            objectFit: "contain",
            opacity: enter,
            transform: `scale(${scale})`,
            filter: "drop-shadow(0 38px 36px rgba(26,24,24,0.28))",
          }}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 120,
          textAlign: "center",
          fontFamily,
          fontWeight: 300,
          fontSize: 26,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: st.on,
          opacity: enter,
        }}
      >
        {item.label}
      </div>
    </AbsoluteFill>
  );
};

const ReelEndCard: React.FC<{ hookSkinny: string }> = ({ hookSkinny }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 10], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.cream,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        color: colors.ink,
        opacity: enter,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 150,
          letterSpacing: "-0.02em",
          lineHeight: 0.9,
        }}
      >
        PRICE-LESS
      </div>
      <div
        style={{
          width: 330,
          height: 8,
          marginTop: 46,
          backgroundColor: colors.rust,
          transform: `scaleX(${enter})`,
        }}
      />
      <div
        style={{
          marginTop: 46,
          fontWeight: 300,
          fontSize: 27,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
        }}
      >
        {hookSkinny}
      </div>
      <div
        style={{
          marginTop: 20,
          fontWeight: 300,
          fontSize: 27,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
        }}
      >
        825 Washington St · Wausau
      </div>
    </AbsoluteFill>
  );
};

/**
 * Category reel: hook card > one beat per product (alternating grounds/bands)
 * > brand end card. 12s at 6 items; duration scales with item count.
 */
export const CategoryReel: React.FC<CategoryReelProps> = ({
  hookBold,
  hookSkinny,
  items,
}) => {
  const { fps } = useVideoConfig();
  const HOOK = 50;
  const BEAT = 42;
  const END = 58;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <Sequence durationInFrames={HOOK} name="Hook">
        <AbsoluteFill
          style={{
            backgroundColor: colors.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <KohlerIntroStack
            bold={hookBold}
            skinny={hookSkinny}
            fadeIn={[4, 10]}
            slam
            color={colors.cream}
          />
        </AbsoluteFill>
      </Sequence>
      {items.map((item, i) => (
        <Sequence
          key={item.label + i}
          from={HOOK + i * BEAT}
          durationInFrames={BEAT}
          premountFor={fps}
          name={`P${i + 1}-${item.label}`}
        >
          <ProductBeat item={item} styleIndex={i} />
        </Sequence>
      ))}
      <Sequence from={HOOK + items.length * BEAT} durationInFrames={END} name="End">
        <ReelEndCard hookSkinny={hookSkinny} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const reelDuration = (itemCount: number) => 50 + itemCount * 42 + 58;
