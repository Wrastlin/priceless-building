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
import { colors } from "../brand/tokens";

const serif = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const serifItalic = loadSerif("italic", { weights: ["400"], subsets: ["latin"] });
const sans = loadSans("normal", { weights: ["300", "700"], subsets: ["latin"] });

/**
 * Approved-preset library for laying live type over a marketing shot — the
 * text analogue to the numbered music tracks in `08 Music`. Every preset uses
 * the same locked words over the same scene so the ONLY variable is the
 * treatment (entrance + layout). All type obeys the Kohler grammar
 * (Playfair serif contrast-by-size + Montserrat 300/700), legibility comes
 * from a soft radial grade + hairline scrims — never a band, chip, or slab.
 * @see docs/motion/TYPE-CRITIQUE-OPUS.md, memory priceless-creative-directives
 */
export type TextPreset =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J";

export const TEXT_PRESET_DURATION = 96; // 3.2s @ 30fps

export type SwatchCopy = {
  /** Italic serif lead, sentence case. */
  kicker: string;
  /** Serif display hero, one or two short words. */
  hero: string;
  /** Wide-tracked light-sans descriptor. */
  descriptor: string;
  /** Hairline-flanked brand line. */
  brand: string;
};

const DEFAULT_COPY: SwatchCopy = {
  kicker: "The best of the best",
  hero: "For Less",
  descriptor: "Banded crystal chandelier",
  brand: "Price-Less · Wausau",
};

export type TextPresetSwatchProps = {
  preset: TextPreset;
  /** Full-bleed scene image (placement render or color-drenched master). */
  src: string;
  copy?: Partial<SwatchCopy>;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const softOut = Easing.bezier(0.16, 1, 0.3, 1);
const settleBack = Easing.bezier(0.34, 1.42, 0.64, 1); // gentle overshoot

const shadow = "0 2px 34px rgba(0,0,0,0.42)";

// --- Scene bed: ambient breathe + hairline scrims + radial grade -----------

const SceneBed: React.FC<{ src: string; ax: string; ay: string }> = ({
  src,
  ax,
  ay,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const sceneScale =
    1 +
    0.022 *
      interpolate(frame, [0, durationInFrames], [0, 1], {
        easing: Easing.inOut(Easing.quad),
      });
  return (
    <>
      <AbsoluteFill style={{ transform: `scale(${sceneScale})` }}>
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      {/* Hairline top/bottom scrim — never a visible band */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.30) 100%)",
        }}
      />
      {/* Soft radial grade behind the type anchor for legibility */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 820px 600px at ${ax} ${ay}, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0) 66%)`,
        }}
      />
    </>
  );
};

// --- Shared type atoms ------------------------------------------------------

const kickerStyle: React.CSSProperties = {
  fontFamily: serifItalic.fontFamily,
  fontStyle: "italic",
  fontWeight: 400,
  fontSize: 52,
  letterSpacing: "0.02em",
  color: colors.cream,
  textShadow: shadow,
};

const heroStyle: React.CSSProperties = {
  fontFamily: serif.fontFamily,
  fontWeight: 400,
  fontSize: 150,
  lineHeight: 0.98,
  letterSpacing: "0.005em",
  color: colors.cream,
  textShadow: shadow,
  whiteSpace: "nowrap",
};

const descriptorStyle: React.CSSProperties = {
  fontFamily: sans.fontFamily,
  fontWeight: 300,
  fontSize: 27,
  letterSpacing: "0.5em",
  paddingLeft: "0.5em",
  textTransform: "uppercase",
  color: colors.cream,
  textShadow: shadow,
};

const BrandLine: React.FC<{ text: string; opacity: number; center?: boolean }> = ({
  text,
  opacity,
  center = true,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: center ? "center" : "flex-start",
      gap: 24,
      opacity,
    }}
  >
    <div style={{ width: 64, height: 1, backgroundColor: colors.cream, opacity: 0.7 }} />
    <div
      style={{
        fontFamily: sans.fontFamily,
        fontWeight: 300,
        fontSize: 20,
        letterSpacing: "0.42em",
        paddingLeft: "0.42em",
        textTransform: "uppercase",
        color: colors.cream,
        textShadow: shadow,
      }}
    >
      {text}
    </div>
    <div style={{ width: 64, height: 1, backgroundColor: colors.cream, opacity: 0.7 }} />
  </div>
);

// --- Preset A: Quiet Stack (current shipped baseline) -----------------------

const PresetA: React.FC<{ copy: SwatchCopy }> = ({ copy }) => {
  const f = useCurrentFrame();
  const kicker = interpolate(f, [6, 18], [0, 1], clamp);
  const heroIn = interpolate(f, [8, 24], [0, 1], { ...clamp, easing: softOut });
  const desc = interpolate(f, [16, 30], [0, 1], clamp);
  const brand = interpolate(f, [22, 36], [0, 1], clamp);
  return (
    <Stack anchor="center">
      <div style={{ ...kickerStyle, opacity: kicker, marginBottom: 18 }}>{copy.kicker}</div>
      <div
        style={{
          ...heroStyle,
          opacity: heroIn,
          transform: `translateY(${(1 - heroIn) * 14}px)`,
        }}
      >
        {copy.hero}
      </div>
      <div style={{ ...descriptorStyle, opacity: desc, marginTop: 46 }}>{copy.descriptor}</div>
      <div style={{ marginTop: 40 }}>
        <BrandLine text={copy.brand} opacity={brand} />
      </div>
    </Stack>
  );
};

// --- Preset B: Falling Words (live text falling — Aaron's cited axis) --------

const PresetB: React.FC<{ copy: SwatchCopy }> = ({ copy }) => {
  const f = useCurrentFrame();
  const words = copy.hero.split(" ");
  const kicker = interpolate(f, [26, 38], [0, 1], clamp);
  const desc = interpolate(f, [34, 46], [0, 1], clamp);
  const brand = interpolate(f, [40, 52], [0, 1], clamp);
  return (
    <Stack anchor="center">
      <div style={{ ...kickerStyle, opacity: kicker, marginBottom: 18 }}>{copy.kicker}</div>
      <div style={{ display: "flex", gap: 42 }}>
        {words.map((w, i) => {
          const start = 8 + i * 6;
          const drop = interpolate(f, [start, start + 18], [-90, 0], {
            ...clamp,
            easing: settleBack,
          });
          const op = interpolate(f, [start, start + 8], [0, 1], clamp);
          return (
            <span
              key={i}
              style={{ ...heroStyle, opacity: op, transform: `translateY(${drop}px)` }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div style={{ ...descriptorStyle, opacity: desc, marginTop: 46 }}>{copy.descriptor}</div>
      <div style={{ marginTop: 40 }}>
        <BrandLine text={copy.brand} opacity={brand} />
      </div>
    </Stack>
  );
};

// --- Preset C: Rail Lower-Third (editorial, left-aligned, rust rule) ---------

const PresetC: React.FC<{ copy: SwatchCopy }> = ({ copy }) => {
  const f = useCurrentFrame();
  const rail = interpolate(f, [6, 26], [0, 1], { ...clamp, easing: softOut });
  const line = (a: number, b: number) =>
    interpolate(f, [a, b], [0, 100], { ...clamp, easing: softOut });
  const brand = interpolate(f, [40, 54], [0, 1], clamp);
  const wipe = (from: number, to: number): React.CSSProperties => ({
    clipPath: `inset(0 ${100 - line(from, to)}% 0 0)`,
  });
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        paddingLeft: 96,
        paddingRight: 96,
        paddingBottom: 150,
      }}
    >
      <div style={{ display: "flex", gap: 34, alignItems: "stretch" }}>
        {/* Rust rail draws up */}
        <div
          style={{
            width: 3,
            alignSelf: "stretch",
            backgroundColor: colors.rust,
            transformOrigin: "bottom",
            transform: `scaleY(${rail})`,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ ...kickerStyle, ...wipe(8, 24), marginBottom: 14 }}>{copy.kicker}</div>
          <div style={{ ...heroStyle, ...wipe(14, 34), textAlign: "left" }}>{copy.hero}</div>
          <div style={{ ...descriptorStyle, ...wipe(26, 44), marginTop: 34, paddingLeft: 0 }}>
            {copy.descriptor}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 40, marginLeft: 40 }}>
        <BrandLine text={copy.brand} opacity={brand} center={false} />
      </div>
    </AbsoluteFill>
  );
};

// --- Preset D: Rise Reveal (letters surface up out of a mask) ---------------

const RiseLine: React.FC<{
  start: number;
  children: React.ReactNode;
  style: React.CSSProperties;
}> = ({ start, children, style }) => {
  const f = useCurrentFrame();
  const y = interpolate(f, [start, start + 22], [110, 0], { ...clamp, easing: softOut });
  const op = interpolate(f, [start, start + 10], [0, 1], clamp);
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
      <div style={{ ...style, transform: `translateY(${y}%)`, opacity: op }}>{children}</div>
    </div>
  );
};

const PresetD: React.FC<{ copy: SwatchCopy }> = ({ copy }) => {
  const f = useCurrentFrame();
  const desc = interpolate(f, [34, 48], [0, 1], clamp);
  const brand = interpolate(f, [40, 54], [0, 1], clamp);
  return (
    <Stack anchor="center">
      <RiseLine start={6} style={{ ...kickerStyle, marginBottom: 16 }}>
        {copy.kicker}
      </RiseLine>
      <RiseLine start={16} style={heroStyle}>
        {copy.hero}
      </RiseLine>
      <div style={{ ...descriptorStyle, opacity: desc, marginTop: 46 }}>{copy.descriptor}</div>
      <div style={{ marginTop: 40 }}>
        <BrandLine text={copy.brand} opacity={brand} />
      </div>
    </Stack>
  );
};

// --- Preset E: Split Flank (bold punch words flank the product) -------------

const PresetE: React.FC<{ copy: SwatchCopy }> = ({ copy }) => {
  const f = useCurrentFrame();
  const words = copy.hero.toUpperCase().split(" ");
  const left = words[0] ?? "";
  const right = words.slice(1).join(" ");
  const inL = interpolate(f, [8, 26], [-46, 0], { ...clamp, easing: settleBack });
  const inR = interpolate(f, [12, 30], [46, 0], { ...clamp, easing: settleBack });
  const opL = interpolate(f, [8, 18], [0, 1], clamp);
  const opR = interpolate(f, [12, 22], [0, 1], clamp);
  const kicker = interpolate(f, [2, 16], [0, 1], clamp);
  const desc = interpolate(f, [30, 44], [0, 1], clamp);
  const brand = interpolate(f, [36, 50], [0, 1], clamp);
  const punch: React.CSSProperties = {
    fontFamily: sans.fontFamily,
    fontWeight: 700,
    fontSize: 138,
    letterSpacing: "0.01em",
    lineHeight: 0.9,
    color: colors.cream,
    textShadow: shadow,
  };
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          paddingTop: 300,
        }}
      >
        <div style={{ ...kickerStyle, opacity: kicker }}>{copy.kicker}</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: 96,
            paddingRight: 96,
          }}
        >
          <div style={{ ...punch, opacity: opL, transform: `translateX(${inL}%)` }}>{left}</div>
          <div style={{ ...punch, opacity: opR, transform: `translateX(${inR}%)` }}>{right}</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flexDirection: "column",
          paddingBottom: 210,
        }}
      >
        <div style={{ ...descriptorStyle, opacity: desc, marginBottom: 34 }}>
          {copy.descriptor}
        </div>
        <BrandLine text={copy.brand} opacity={brand} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Preset F: Line-Draw Kicker (single hairline sweep annotation) ----------

const PresetF: React.FC<{ copy: SwatchCopy }> = ({ copy }) => {
  const f = useCurrentFrame();
  const kicker = interpolate(f, [2, 14], [0, 1], clamp);
  const rule = interpolate(f, [12, 30], [0, 1], { ...clamp, easing: softOut });
  const heroScale = interpolate(f, [18, 34], [1.08, 1], { ...clamp, easing: softOut });
  const heroOp = interpolate(f, [18, 32], [0, 1], clamp);
  const desc = interpolate(f, [34, 48], [0, 1], clamp);
  const brand = interpolate(f, [40, 54], [0, 1], clamp);
  return (
    <Stack anchor="center">
      <div style={{ ...kickerStyle, opacity: kicker }}>{copy.kicker}</div>
      <div
        style={{
          width: 360,
          height: 1.5,
          backgroundColor: colors.cream,
          opacity: 0.85,
          marginTop: 22,
          marginBottom: 26,
          transformOrigin: "left center",
          transform: `scaleX(${rule})`,
        }}
      />
      <div
        style={{
          ...heroStyle,
          opacity: heroOp,
          transform: `scale(${heroScale})`,
        }}
      >
        {copy.hero}
      </div>
      <div style={{ ...descriptorStyle, opacity: desc, marginTop: 46 }}>{copy.descriptor}</div>
      <div style={{ marginTop: 40 }}>
        <BrandLine text={copy.brand} opacity={brand} />
      </div>
    </Stack>
  );
};

// --- Preset G: Top Anchor (type high, subject sits below) -------------------

const PresetG: React.FC<{ copy: SwatchCopy }> = ({ copy }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [6, 18], [0, 1], clamp);
  const h = interpolate(f, [8, 24], [0, 1], { ...clamp, easing: softOut });
  const d = interpolate(f, [16, 30], [0, 1], clamp);
  const b = interpolate(f, [22, 36], [0, 1], clamp);
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        textAlign: "center",
        paddingTop: 168,
        paddingLeft: 72,
        paddingRight: 72,
      }}
    >
      <div style={{ ...kickerStyle, opacity: k, marginBottom: 18 }}>{copy.kicker}</div>
      <div
        style={{ ...heroStyle, opacity: h, transform: `translateY(${(1 - h) * -14}px)` }}
      >
        {copy.hero}
      </div>
      <div style={{ ...descriptorStyle, opacity: d, marginTop: 46 }}>{copy.descriptor}</div>
      <div style={{ marginTop: 40 }}>
        <BrandLine text={copy.brand} opacity={b} />
      </div>
    </AbsoluteFill>
  );
};

// --- Preset H: Bottom Bar (type pinned low, tight, centered) ----------------

const PresetH: React.FC<{ copy: SwatchCopy }> = ({ copy }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [10, 22], [0, 1], clamp);
  const h = interpolate(f, [6, 22], [0, 1], { ...clamp, easing: softOut });
  const d = interpolate(f, [16, 30], [0, 1], clamp);
  const b = interpolate(f, [24, 38], [0, 1], clamp);
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        textAlign: "center",
        paddingBottom: 120,
        paddingLeft: 72,
        paddingRight: 72,
      }}
    >
      <div style={{ ...kickerStyle, opacity: k, marginBottom: 12 }}>{copy.kicker}</div>
      <div
        style={{ ...heroStyle, opacity: h, transform: `translateY(${(1 - h) * 16}px)` }}
      >
        {copy.hero}
      </div>
      <div style={{ ...descriptorStyle, opacity: d, marginTop: 34 }}>{copy.descriptor}</div>
      <div style={{ marginTop: 32 }}>
        <BrandLine text={copy.brand} opacity={b} />
      </div>
    </AbsoluteFill>
  );
};

// --- Preset I: Left Column (vertical center, left-aligned, editorial) --------

const PresetI: React.FC<{ copy: SwatchCopy }> = ({ copy }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [6, 18], [0, 1], clamp);
  const h = interpolate(f, [8, 26], [0, 1], { ...clamp, easing: softOut });
  const d = interpolate(f, [18, 32], [0, 1], clamp);
  const b = interpolate(f, [26, 40], [0, 1], clamp);
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: 96,
        paddingRight: 200,
      }}
    >
      <div style={{ ...kickerStyle, opacity: k, marginBottom: 12 }}>{copy.kicker}</div>
      <div
        style={{
          ...heroStyle,
          textAlign: "left",
          opacity: h,
          transform: `translateX(${(1 - h) * -18}px)`,
        }}
      >
        {copy.hero}
      </div>
      <div style={{ ...descriptorStyle, paddingLeft: 0, opacity: d, marginTop: 30 }}>
        {copy.descriptor}
      </div>
      <div style={{ marginTop: 36 }}>
        <BrandLine text={copy.brand} opacity={b} center={false} />
      </div>
    </AbsoluteFill>
  );
};

// --- Preset J: Corner Tag (compact lockup, bottom-left) ---------------------

const PresetJ: React.FC<{ copy: SwatchCopy }> = ({ copy }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [6, 18], [0, 1], clamp);
  const h = interpolate(f, [10, 26], [0, 1], { ...clamp, easing: softOut });
  const d = interpolate(f, [20, 34], [0, 1], clamp);
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        paddingLeft: 90,
        paddingBottom: 150,
      }}
    >
      <div style={{ ...kickerStyle, fontSize: 34, opacity: k, marginBottom: 6 }}>
        {copy.kicker}
      </div>
      <div
        style={{
          ...heroStyle,
          fontSize: 82,
          textAlign: "left",
          opacity: h,
          transform: `translateY(${(1 - h) * 14}px)`,
        }}
      >
        {copy.hero}
      </div>
      <div
        style={{
          ...descriptorStyle,
          fontSize: 19,
          letterSpacing: "0.38em",
          paddingLeft: 0,
          opacity: d,
          marginTop: 16,
        }}
      >
        {copy.descriptor}
      </div>
    </AbsoluteFill>
  );
};

// --- Centered stack wrapper -------------------------------------------------

const Stack: React.FC<{ anchor: "center" | "low"; children: React.ReactNode }> = ({
  anchor,
  children,
}) => (
  <AbsoluteFill
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: anchor === "center" ? "center" : "flex-end",
      textAlign: "center",
      paddingLeft: 72,
      paddingRight: 72,
      paddingBottom: anchor === "center" ? 0 : 150,
    }}
  >
    {children}
  </AbsoluteFill>
);

const PRESETS: Record<TextPreset, React.FC<{ copy: SwatchCopy }>> = {
  A: PresetA,
  B: PresetB,
  C: PresetC,
  D: PresetD,
  E: PresetE,
  F: PresetF,
  G: PresetG,
  H: PresetH,
  I: PresetI,
  J: PresetJ,
};

/** Anchor the radial legibility grade where each preset's type sits. */
const ANCHOR: Record<TextPreset, { x: string; y: string }> = {
  A: { x: "50%", y: "52%" },
  B: { x: "50%", y: "52%" },
  C: { x: "34%", y: "82%" },
  D: { x: "50%", y: "52%" },
  E: { x: "50%", y: "50%" },
  F: { x: "50%", y: "52%" },
  G: { x: "50%", y: "22%" },
  H: { x: "50%", y: "84%" },
  I: { x: "32%", y: "50%" },
  J: { x: "28%", y: "82%" },
};

export const TextPresetSwatch: React.FC<TextPresetSwatchProps> = ({
  preset,
  src,
  copy,
}) => {
  const merged: SwatchCopy = { ...DEFAULT_COPY, ...copy };
  const Body = PRESETS[preset];
  const a = ANCHOR[preset];
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0d0d", overflow: "hidden" }}>
      <SceneBed src={src} ax={a.x} ay={a.y} />
      <Body copy={merged} />
    </AbsoluteFill>
  );
};
