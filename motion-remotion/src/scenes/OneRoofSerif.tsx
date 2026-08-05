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

export type RoofBeat = {
  /** Full-bleed real photo; omit for an ink void card */
  photo?: string;
  intro?: string;
  name?: string;
  descriptor?: string;
  tag?: string;
  tag2?: string;
  anchor?: "center" | "low";
  frames: number;
};

export type OneRoofSerifProps = {
  beats: RoofBeat[];
};

/** Shared serif stack, identical metrics to PL-feed-post-v2. Transparent — safe to overlay on video. */
export const Stack: React.FC<{ beat: RoofBeat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const typeIn = interpolate(frame, [5, 20], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameSize = beat.name && beat.name.length > 10 ? 104 : 128;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: beat.anchor === "low" ? "flex-end" : "center",
        paddingBottom: beat.anchor === "low" ? 170 : 120,
        color: "#ffffff",
        textAlign: "center",
        opacity: typeIn,
        transform: `translateY(${(1 - typeIn) * 12}px)`,
        textShadow: beat.photo ? "0 1px 26px rgba(0,0,0,0.42)" : undefined,
      }}
    >
      {beat.intro ? (
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
          {beat.intro}
        </div>
      ) : null}
      {beat.name ? (
        <div
          style={{
            fontFamily: serif.fontFamily,
            fontWeight: 400,
            fontSize: nameSize,
            lineHeight: 1.06,
            letterSpacing: "0.01em",
            maxWidth: 940,
            whiteSpace: "pre-line",
          }}
        >
          {beat.name}
        </div>
      ) : null}
      {beat.descriptor ? (
        <div
          style={{
            fontFamily: sans.fontFamily,
            fontWeight: 300,
            fontSize: 26,
            letterSpacing: "0.52em",
            paddingLeft: "0.52em",
            textTransform: "uppercase",
            marginTop: 50,
            opacity: 0.95,
          }}
        >
          {beat.descriptor}
        </div>
      ) : null}
      {beat.tag ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            marginTop: 48,
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
            {beat.tag}
          </div>
          <div style={{ width: 74, height: 1, backgroundColor: "#ffffff" }} />
        </div>
      ) : null}
      {beat.tag2 ? (
        <div
          style={{
            fontFamily: sans.fontFamily,
            fontWeight: 300,
            fontSize: 20,
            letterSpacing: "0.42em",
            paddingLeft: "0.42em",
            textTransform: "uppercase",
            marginTop: 24,
            opacity: 0.85,
          }}
        >
          {beat.tag2}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Beat: React.FC<{ beat: RoofBeat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const scale =
    1 +
    0.028 *
      interpolate(frame, [0, beat.frames], [0, 1], {
        easing: Easing.inOut(Easing.quad),
      });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink, overflow: "hidden" }}>
      {beat.photo ? (
        <>
          <AbsoluteFill style={{ transform: `scale(${scale})` }}>
            <Img
              src={staticFile(beat.photo)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.02) 58%, rgba(0,0,0,0.34) 100%)",
            }}
          />
          {/* Soft radial grade behind the type so it reads over bright rooms */}
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse 720px 520px at 50% ${
                beat.anchor === "low" ? "76%" : "50%"
              }, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0) 72%)`,
            }}
          />
        </>
      ) : null}
      <Stack beat={beat} />
    </AbsoluteFill>
  );
};

/** Whole-business brand ad: quiet serif beats over real photos + ink voids. */
export const OneRoofSerif: React.FC<OneRoofSerifProps> = ({ beats }) => {
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      {beats.map((beat, i) => {
        const seq = (
          <Sequence
            key={i}
            from={from}
            durationInFrames={beat.frames}
            premountFor={30}
            name={`B${i + 1}-${beat.name ?? "void"}`}
          >
            <Beat beat={beat} />
          </Sequence>
        );
        from += beat.frames;
        return seq;
      })}
    </AbsoluteFill>
  );
};

export const roofSerifDuration = (beats: RoofBeat[]) =>
  beats.reduce((sum, b) => sum + b.frames, 0);
