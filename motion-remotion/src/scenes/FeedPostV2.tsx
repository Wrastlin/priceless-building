import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/Montserrat";
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

const serifItalic = loadSerif("italic", { weights: ["400"], subsets: ["latin"] });
const serif = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const sans = loadSans("normal", { weights: ["300"], subsets: ["latin"] });

export type FeedPostV2Props = {
  /** Italic serif lead, sentence case, e.g. "Introducing" */
  intro?: string;
  /** Display serif name, SHORT (one or two words). Omit for a textless plate. */
  name?: string;
  /** Tracked caps descriptor under the name, e.g. "Black entry door" */
  descriptor?: string;
  /** Brand line, tiny tracked caps between hairlines, e.g. "Price-Less · Wausau" */
  tag?: string;
  /** Full-bleed scene image (placement render or color-drenched master) */
  src: string;
  /** Stack anchor: center of frame or lower third */
  anchor?: "center" | "low";
};

/**
 * Kohler-quiet feed creative, matched to the reference stack:
 * italic serif lead > large fine serif name > wide-tracked light sans
 * descriptor > hairline-flanked brand line. The scene carries the color.
 */
export const FeedPostV2: React.FC<FeedPostV2Props> = ({
  intro,
  name,
  descriptor,
  tag,
  src,
  anchor = "center",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Ambient breath on the scene, not a pan.
  const sceneScale =
    1 +
    0.025 *
      interpolate(frame, [0, durationInFrames], [0, 1], {
        easing: Easing.inOut(Easing.quad),
      });
  const typeIn = interpolate(frame, [6, 22], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#111", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${sceneScale})` }}>
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      {!name && !intro && !descriptor && !tag ? null : (
        <>
      {/* Whisper of a scrim for legibility; never a visible band */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.24) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: anchor === "center" ? "center" : "flex-end",
          paddingBottom: anchor === "center" ? 150 : 130,
          color: "#ffffff",
          textAlign: "center",
          opacity: typeIn,
          transform: `translateY(${(1 - typeIn) * 12}px)`,
          textShadow: "0 1px 26px rgba(0,0,0,0.4)",
        }}
      >
        {intro ? (
          <div
            style={{
              fontFamily: serifItalic.fontFamily,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 46,
              letterSpacing: "0.03em",
              marginBottom: 10,
            }}
          >
            {intro}
          </div>
        ) : null}
        {name ? (
          <div
            style={{
              fontFamily: serif.fontFamily,
              fontWeight: 400,
              fontSize: 128,
              lineHeight: 1.04,
              letterSpacing: "0.01em",
              maxWidth: 920,
            }}
          >
            {name}
          </div>
        ) : null}
        {descriptor ? (
          <div
            style={{
              fontFamily: sans.fontFamily,
              fontWeight: 300,
              fontSize: 26,
              letterSpacing: "0.52em",
              paddingLeft: "0.52em",
              textTransform: "uppercase",
              marginTop: 54,
              opacity: 0.95,
            }}
          >
            {descriptor}
          </div>
        ) : null}
        {tag ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              marginTop: 46,
              opacity: 0.85,
            }}
          >
            <div style={{ width: 74, height: 1, backgroundColor: "#ffffff" }} />
            <div
              style={{
                fontFamily: sans.fontFamily,
                fontWeight: 300,
                fontSize: 20,
                letterSpacing: "0.42em",
                paddingLeft: "0.42em",
                textTransform: "uppercase",
              }}
            >
              {tag}
            </div>
            <div style={{ width: 74, height: 1, backgroundColor: "#ffffff" }} />
          </div>
        ) : null}
      </AbsoluteFill>
        </>
      )}
    </AbsoluteFill>
  );
};
