import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/Montserrat";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { colors } from "../brand/tokens";

const serifItalic = loadSerif("italic", { weights: ["400"], subsets: ["latin"] });
const serif = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const sans = loadSans("normal", { weights: ["300"], subsets: ["latin"] });

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export type SkuMicroV2Props = {
  name: string;
  descriptor: string;
  /** Transparent trimmed cutout in public/ */
  cutout: string;
};

/** A: product settles on cream. No chrome, no chips. */
const SceneProduct: React.FC<{ cutout: string; name: string }> = ({
  cutout,
  name,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 10], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 35], [1.05, 1.0], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.cream,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img
        src={staticFile(cutout)}
        alt={name}
        style={{
          maxHeight: 1420,
          maxWidth: 880,
          objectFit: "contain",
          opacity: enter,
          transform: `scale(${scale})`,
          filter: "drop-shadow(0 40px 38px rgba(26,24,24,0.26))",
        }}
      />
    </AbsoluteFill>
  );
};

/** B: ink void, serif stack. */
const SceneName: React.FC<SkuMicroV2Props> = ({ name, descriptor }) => {
  const frame = useCurrentFrame();
  const typeIn = interpolate(frame, [3, 16], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameSize = name.length > 10 ? 108 : 132;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.ink,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        textAlign: "center",
        opacity: typeIn,
        transform: `translateY(${(1 - typeIn) * 12}px)`,
      }}
    >
      <div
        style={{
          fontFamily: serifItalic.fontFamily,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 48,
          letterSpacing: "0.03em",
          marginBottom: 12,
        }}
      >
        Introducing
      </div>
      <div
        style={{
          fontFamily: serif.fontFamily,
          fontWeight: 400,
          fontSize: nameSize,
          lineHeight: 1.06,
          letterSpacing: "0.01em",
          maxWidth: 940,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: sans.fontFamily,
          fontWeight: 300,
          fontSize: 27,
          letterSpacing: "0.52em",
          paddingLeft: "0.52em",
          textTransform: "uppercase",
          marginTop: 56,
          opacity: 0.95,
        }}
      >
        {descriptor}
      </div>
    </AbsoluteFill>
  );
};

/** C: product on parchment with ink serif name + hairline tag. */
const SceneClose: React.FC<SkuMicroV2Props> = ({ name, descriptor, cutout }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 12], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = interpolate(frame, [0, 35], [1.0, 1.03], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.parchment }}>
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 360,
        }}
      >
        <Img
          src={staticFile(cutout)}
          alt={name}
          style={{
            maxHeight: 1000,
            maxWidth: 820,
            objectFit: "contain",
            opacity: enter,
            transform: `scale(${drift})`,
            filter: "drop-shadow(0 34px 32px rgba(26,24,24,0.22))",
          }}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 150,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: colors.ink,
          textAlign: "center",
          opacity: enter,
        }}
      >
        <div
          style={{
            fontFamily: serif.fontFamily,
            fontWeight: 400,
            fontSize: 84,
            lineHeight: 1.04,
            letterSpacing: "0.01em",
            maxWidth: 900,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: sans.fontFamily,
            fontWeight: 300,
            fontSize: 23,
            letterSpacing: "0.5em",
            paddingLeft: "0.5em",
            textTransform: "uppercase",
            marginTop: 30,
            opacity: 0.95,
          }}
        >
          {descriptor}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginTop: 38,
            opacity: 0.8,
          }}
        >
          <div style={{ width: 70, height: 1, backgroundColor: colors.ink }} />
          <div
            style={{
              fontFamily: sans.fontFamily,
              fontWeight: 300,
              fontSize: 19,
              letterSpacing: "0.42em",
              paddingLeft: "0.42em",
              textTransform: "uppercase",
            }}
          >
            Price-Less · Wausau
          </div>
          <div style={{ width: 70, height: 1, backgroundColor: colors.ink }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Serif-quiet SKU micro: product / introducing stack / close card. */
export const SkuMicroV2: React.FC<SkuMicroV2Props> = (props) => (
  <AbsoluteFill style={{ backgroundColor: colors.cream }}>
    <Sequence durationInFrames={35} name="A-Product">
      <SceneProduct cutout={props.cutout} name={props.name} />
    </Sequence>
    <Sequence from={35} durationInFrames={35} premountFor={30} name="B-Introducing">
      <SceneName {...props} />
    </Sequence>
    <Sequence from={70} durationInFrames={35} premountFor={30} name="C-Close">
      <SceneClose {...props} />
    </Sequence>
  </AbsoluteFill>
);
