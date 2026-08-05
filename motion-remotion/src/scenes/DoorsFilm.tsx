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
import { DoorHomeSlam } from "../components/one-roof/DoorHomeSlam";
import { DoorSelectLift } from "../components/one-roof/DoorSelectLift";
import { KohlerIntroStack } from "../brand/KohlerIntroStack";
import { colors } from "../brand/tokens";

const { fontFamily } = loadFont("normal", {
  weights: ["300", "700"],
  subsets: ["latin"],
});

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const rise = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** B1 — hook: tape-measure line draws up, 3-line bold stack slams. */
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lineH = interpolate(frame, [0, 26], [0, 1560], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink, overflow: "hidden" }}>
      {/* measure line + rust ticks, left of the type column */}
      <div
        style={{
          position: "absolute",
          left: 92,
          bottom: 180,
          width: 3,
          height: lineH,
          backgroundColor: colors.cream,
        }}
      />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const tickY = 180 + i * 260;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 92,
              bottom: tickY,
              width: lineH > tickY - 160 ? 34 : 0,
              height: 3,
              backgroundColor: colors.rust,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <KohlerIntroStack
          bold={"BEFORE\nYOU BUY\nA DOOR"}
          fadeIn={[10, 18]}
          slam
          scale={0.88}
          color={colors.cream}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

type TrioDoor = { src: string; label: string };

/** B2 — three door heroes rise staggered on cream with skinny labels. */
const TrioScene: React.FC<{ doors: TrioDoor[] }> = ({ doors }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, overflow: "hidden" }}>
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
          opacity: rise(frame, 2, 10),
        }}
      >
        DOORS / PRICE-LESS
      </div>
      {doors.map((door, i) => {
        const enter = rise(frame, 6 + i * 7, 24 + i * 7);
        const colW = 1080 / 3;
        return (
          <div
            key={door.label}
            style={{
              position: "absolute",
              left: colW * i,
              width: colW,
              top: 420,
              height: 900,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: enter,
              transform: `translateY(${(1 - enter) * 120}px)`,
            }}
          >
            <div
              style={{
                height: 800,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <Img
                src={staticFile(door.src)}
                style={{
                  maxHeight: 800,
                  maxWidth: colW - 44,
                  objectFit: "contain",
                  filter: "drop-shadow(0 26px 24px rgba(26,24,24,0.22))",
                }}
              />
            </div>
            <div
              style={{
                marginTop: 42,
                fontFamily,
                fontWeight: 300,
                fontSize: 23,
                letterSpacing: "0.26em",
                color: colors.ink,
                textTransform: "uppercase",
              }}
            >
              {door.label}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 1408,
          height: 6,
          backgroundColor: colors.rust,
          transform: `scaleX(${rise(frame, 20, 40)})`,
          transformOrigin: "left",
        }}
      />
    </AbsoluteFill>
  );
};

/** B3 — single hero on void with an accent band. */
const HeroCut: React.FC<{
  src: string;
  skinny: string;
  ground: string;
  inkOn: string;
  bandColor: string;
}> = ({ src, skinny, ground, inkOn, bandColor }) => {
  const frame = useCurrentFrame();
  const enter = rise(frame, 0, 10);
  const bandSweep = rise(frame, 0, 14);
  const scale = interpolate(frame, [0, 44], [1.0, 1.045], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: ground, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 620,
          width: 460,
          backgroundColor: bandColor,
          transform: `scaleY(${bandSweep})`,
          transformOrigin: "top",
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
          src={staticFile(src)}
          style={{
            maxHeight: 1400,
            maxWidth: 760,
            objectFit: "contain",
            opacity: enter,
            transform: `scale(${scale})`,
            filter: "drop-shadow(0 40px 38px rgba(26,24,24,0.3))",
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
          color: inkOn,
          opacity: enter,
        }}
      >
        {skinny}
      </div>
    </AbsoluteFill>
  );
};

/** B7 — honest category claim. */
const ClaimScene: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: colors.ink,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <KohlerIntroStack
      bold={"PAY LESS\nTHAN\nBIG-BOX"}
      skinny="NEW · SURPLUS · ONE-OF-A-KIND"
      fadeIn={[0, 6]}
      slam
      color={colors.cream}
    />
  </AbsoluteFill>
);

/** B8 — end card: lockup + address. */
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = rise(frame, 0, 10);

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
          transform: `scaleX(${rise(frame, 6, 22)})`,
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
        825 Washington St · Wausau
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
        pricelessbuilding.com
      </div>
    </AbsoluteFill>
  );
};

/**
 * Doors category film v1 — 20s 9:16 cutout-MG.
 * Hook > trio > hero cuts > select/lift > two home slams > claim > end card.
 */
export const DoorsFilm: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <Sequence durationInFrames={66} name="B1-Hook">
        <HookScene />
      </Sequence>
      <Sequence from={66} durationInFrames={104} premountFor={fps} name="B2-Trio">
        <TrioScene
          doors={[
            {
              src: "products/trim/intake-black-craftsman-door-trim.png",
              label: "Exterior",
            },
            {
              src: "products/trim/floor-arched-eight-panel-door-trim.png",
              label: "Interior",
            },
            {
              src: "products/trim/floor-barn-door-diamond-glass-trim.png",
              label: "One-of-a-kind",
            },
          ]}
        />
      </Sequence>
      <Sequence from={170} durationInFrames={45} premountFor={fps} name="B3-Hero-Artglass">
        <HeroCut
          src="products/trim/dark-wood-exterior-door-glass-trim.png"
          skinny="Art glass · dentil shelf"
          ground={colors.ink}
          inkOn={colors.cream}
          bandColor={colors.rust}
        />
      </Sequence>
      <Sequence from={215} durationInFrames={45} premountFor={fps} name="B3-Hero-Brownglass">
        <HeroCut
          src="products/trim/brown-exterior-door-decorative-glass-trim.png"
          skinny="Decorative leaded glass"
          ground={colors.cream}
          inkOn={colors.ink}
          bandColor={colors.sage}
        />
      </Sequence>
      <Sequence from={260} durationInFrames={120} premountFor={fps} name="B4-Select-Lift">
        <DoorSelectLift
          aisleSrc="one-roof/v3-a/floor-door-aisle-light-and-dark.jpg"
          doorSrc="products/trim/intake-black-craftsman-door-trim.png"
          doorFit="contain"
          selectEnd={50}
          liftEnd={86}
        />
      </Sequence>
      <Sequence from={380} durationInFrames={45} premountFor={fps} name="B5-Slam-Kitchen">
        <DoorHomeSlam
          room={{ roomSrc: "one-roof/homes/home-white-kitchen.png" }}
          doorSrc="products/trim/intake-black-craftsman-door-trim.png"
          doorFit="contain"
          doorLeft="10.1%"
          doorTop="28.1%"
          doorWidth={358}
          doorHeight={950}
        />
      </Sequence>
      <Sequence from={425} durationInFrames={45} premountFor={fps} name="B6-Slam-Study">
        <DoorHomeSlam
          room={{ roomSrc: "one-roof/homes/home-navy-study.png" }}
          doorSrc="products/trim/floor-barn-door-diamond-glass-trim.png"
          doorFit="contain"
          doorLeft="21%"
          doorTop="34.3%"
          doorWidth={224}
          doorHeight={560}
        />
      </Sequence>
      <Sequence from={470} durationInFrames={65} name="B7-Claim">
        <ClaimScene />
      </Sequence>
      <Sequence from={535} durationInFrames={65} name="B8-End">
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};

export const DOORS_FILM_DURATION = 600;
