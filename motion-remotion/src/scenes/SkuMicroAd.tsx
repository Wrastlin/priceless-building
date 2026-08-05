import { loadFont } from "@remotion/google-fonts/Montserrat";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ProductAsset } from "../brand/ProductAsset";
import { brandKit, colors } from "../brand/tokens";
import type { ItemAdProps } from "../types";

const { fontFamily } = loadFont("normal", {
  weights: ["300", "700"],
  subsets: ["latin"],
});

const SCENE_SECONDS = 3.5 / 3;
const enterCurve = Easing.bezier(0.16, 1, 0.3, 1);

const enterProgress = (frame: number, fps: number, seconds = 0.3) =>
  interpolate(frame, [0, seconds * fps], [0, 1], {
    easing: enterCurve,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const ProductLayer: React.FC<{
  props: ItemAdProps;
  scaleFrom: number;
  scaleTo: number;
  style?: React.CSSProperties;
  fit?: "contain" | "cover";
}> = ({ props, scaleFrom, scaleTo, style, fit = "contain" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = interpolate(
    frame,
    [0, SCENE_SECONDS * fps],
    [scaleFrom, scaleTo],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        position: "absolute",
        transform: `scale(${scale})`,
        transformOrigin: "center",
        ...style,
      }}
    >
      <ProductAsset
        productSrc={props.productSrc}
        alt={props.title}
        fit={fit}
      />
    </div>
  );
};

const SceneProduct: React.FC<{ props: ItemAdProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = enterProgress(frame, fps, 0.24);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.cream,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 22,
          height: "100%",
          backgroundColor: colors.rust,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 58,
          top: 70,
          fontFamily,
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: "0.22em",
          color: colors.ink,
          opacity: enter,
        }}
      >
        01 / PRODUCT
      </div>
      <ProductLayer
        props={props}
        scaleFrom={0.96}
        scaleTo={1.035}
        style={{
          left: 34,
          right: 34,
          top: 190,
          bottom: 130,
          opacity: enter,
          filter: "drop-shadow(0 36px 34px rgba(26,24,24,0.18))",
        }}
      />
    </AbsoluteFill>
  );
};

const SceneName: React.FC<{ props: ItemAdProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = enterProgress(frame, fps);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.ink,
        overflow: "hidden",
        color: colors.cream,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 94,
          left: 58,
          right: 58,
          fontFamily,
          textTransform: "uppercase",
          zIndex: 2,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 38,
            fontWeight: 300,
            letterSpacing: "0.08em",
          }}
        >
          Introducing
        </div>
        <div
          style={{
            paddingLeft: 76,
            marginTop: 5,
            fontSize: 38,
            fontWeight: 300,
            letterSpacing: "0.08em",
          }}
        >
          {props.subtitle || "the"}
        </div>
        <div
          style={{
            maxWidth: 920,
            marginTop: 13,
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: "-0.025em",
          }}
        >
          {props.title}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 980,
          backgroundColor: colors.parchment,
          clipPath: "polygon(0 19%, 100% 0, 100% 100%, 0 100%)",
        }}
      />
      <ProductLayer
        props={props}
        scaleFrom={1.1}
        scaleTo={1.16}
        style={{
          left: -20,
          right: -20,
          top: 860,
          bottom: -40,
          filter: "drop-shadow(0 28px 32px rgba(26,24,24,0.2))",
        }}
      />
    </AbsoluteFill>
  );
};

const SceneBrandFacts: React.FC<{ props: ItemAdProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = enterProgress(frame, fps);
  const lockup = brandKit[props.brand].lockup;
  const facts = [props.dimensions, props.description].filter(Boolean);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.parchment,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0 0 0 56%",
          backgroundColor: colors.cream,
        }}
      />
      <ProductLayer
        props={{ ...props, productSrc: props.productCutoutSrc ?? props.productSrc }}
        scaleFrom={1.02}
        scaleTo={0.97}
        style={{
          left: "44%",
          right: -74,
          top: 160,
          bottom: 170,
          filter: "drop-shadow(0 32px 36px rgba(26,24,24,0.18))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 58,
          top: 94,
          width: 490,
          bottom: 92,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily,
          textTransform: "uppercase",
          color: colors.ink,
          opacity: enter,
          transform: `translateX(${interpolate(enter, [0, 1], [-28, 0])}px)`,
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 27,
              letterSpacing: "0.18em",
            }}
          >
            {lockup}
          </div>
          <div
            style={{
              width: 310,
              height: 8,
              marginTop: 24,
              backgroundColor: colors.rust,
            }}
          />
        </div>
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 58,
              lineHeight: 0.94,
              letterSpacing: "-0.02em",
            }}
          >
            {props.title}
          </div>
          {facts.map((fact) => (
            <div
              key={fact}
              style={{
                marginTop: 20,
                fontWeight: 300,
                fontSize: 23,
                lineHeight: 1.24,
                letterSpacing: "0.07em",
                textTransform: "none",
              }}
            >
              {fact}
            </div>
          ))}
          {props.price ? (
            <div
              style={{
                marginTop: 30,
                color: colors.rust,
                fontWeight: 700,
                fontSize: 74,
                letterSpacing: "-0.02em",
              }}
            >
              {props.price}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Flagship SKU micro: three distinct 35-frame scenes at 30fps.
 * The product and every displayed fact are driven by ItemAdProps.
 */
export const SkuMicroAd: React.FC<ItemAdProps> = (props) => {
  const { fps } = useVideoConfig();
  const sceneFrames = Math.round(SCENE_SECONDS * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream }}>
      <Sequence
        durationInFrames={sceneFrames}
        premountFor={fps}
        name="A-Product-Hero"
      >
        <SceneProduct props={props} />
      </Sequence>
      <Sequence
        from={sceneFrames}
        durationInFrames={sceneFrames}
        premountFor={fps}
        name="B-Name-Stack"
      >
        <SceneName props={props} />
      </Sequence>
      <Sequence
        from={sceneFrames * 2}
        durationInFrames={sceneFrames}
        premountFor={fps}
        name="C-Brand-Facts"
      >
        <SceneBrandFacts props={props} />
      </Sequence>
    </AbsoluteFill>
  );
};
