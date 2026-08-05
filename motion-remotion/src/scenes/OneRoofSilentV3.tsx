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
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { colors, typeWeights } from "../brand/tokens";
import { DoorHomeSlam } from "../components/one-roof/DoorHomeSlam";
import { DoorSelectLift } from "../components/one-roof/DoorSelectLift";
import { PhotoBed, type PhotoBedPlate } from "../components/one-roof/PhotoBed";
import { WideMuralStagger } from "../components/one-roof/WideMuralStagger";

/** ~30s @ 30fps — Silent Volume master (9:16) */
export const SILENT_V3_DURATION = 900;

const INSTALL = "one-roof/v3-install";
const STORE = "one-roof/v3-a";
const DOOR = `${STORE}/intake-black-craftsman-door.jpg`;
const AISLE = `${STORE}/floor-door-aisle-light-and-dark.jpg`;
const MURAL = `${STORE}/mural-wide.webp`;

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * Kinetic void type — lines slam in sequence. Not a static title card.
 */
const KineticVoidPunch: React.FC<{
  line1: string;
  line2: string;
}> = ({ line1, line2 }) => {
  const frame = useCurrentFrame();
  const enter = (delay: number) => {
    const local = frame - delay;
    const opacity = interpolate(local, [0, 4], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const scale = interpolate(local, [0, 6], [1.28, 1], {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const y = interpolate(local, [0, 6], [36, 0], {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { opacity: local < 0 ? 0 : opacity, scale, y };
  };
  const a = enter(0);
  const b = enter(7);

  const lineStyle = (m: { opacity: number; scale: number; y: number }) => ({
    fontFamily,
    fontWeight: Number(typeWeights.bold),
    fontSize: 200,
    letterSpacing: "-0.02em",
    textTransform: "uppercase" as const,
    color: "#ffffff",
    lineHeight: 0.86,
    textAlign: "center" as const,
    opacity: m.opacity,
    transform: `translateY(${m.y}px) scale(${m.scale})`,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.ink,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 72px",
        gap: 0,
      }}
    >
      <div style={lineStyle(a)}>{line1}</div>
      <div style={lineStyle(b)}>{line2}</div>
    </AbsoluteFill>
  );
};

/** Each path appears once in the whole film. */
const STAGGER_TOP = `${INSTALL}/kitchen-white-island-shiplap.jpg`;
const STAGGER_BOTTOM = `${INSTALL}/pergola-patio-daylight.jpg`;
const SLAM_ROOM = `${INSTALL}/kitchen-dark-shaker-marble-island.jpg`;

const installHeroes: readonly PhotoBedPlate[] = [
  {
    src: `${INSTALL}/kitchen-wood-island-black-pendants.jpg`,
    from: 0,
    to: 70,
    objectPosition: "center center",
    scaleFrom: 1,
    scaleTo: 1.05,
  },
  {
    src: `${INSTALL}/kitchen-oak-mosaic-backsplash.jpg`,
    from: 60,
    to: 130,
    objectPosition: "center 40%",
    scaleFrom: 1.04,
    scaleTo: 1,
  },
  {
    src: `${INSTALL}/kitchen-white-open-wood-accents.jpg`,
    from: 120,
    to: 190,
    objectPosition: "center 45%",
    scaleFrom: 1,
    scaleTo: 1.05,
  },
  {
    src: `${INSTALL}/dark-double-vanity-bathroom-install.jpg`,
    from: 180,
    to: 250,
    objectPosition: "center 35%",
    scaleFrom: 1.03,
    scaleTo: 1,
  },
  {
    src: `${INSTALL}/white-kitchen-marble-island.jpg`,
    from: 240,
    to: 310,
    objectPosition: "center center",
    scaleFrom: 1,
    scaleTo: 1.045,
  },
];

function buildAcceleratingStore(srcs: readonly string[]): PhotoBedPlate[] {
  const plates: PhotoBedPlate[] = [];
  let t = 0;
  srcs.forEach((src, i) => {
    const step = Math.max(8, Math.round(18 - i * 0.55));
    plates.push({
      src,
      from: t,
      to: t + step,
      objectPosition: i % 2 === 0 ? "center center" : "50% 40%",
      scaleFrom: 1,
      scaleTo: 1.02,
    });
    t += step;
  });
  return plates;
}

/** Store only — no aisle/door (those are MG-only). */
const storeSrcs = [
  `${STORE}/dark-base-cabinets-warehouse-row.jpg`,
  `${STORE}/floor-window-aisle-warehouse.jpg`,
  `${STORE}/floor-vanity-row-mirrors-lights.jpg`,
  `${STORE}/floor-globe-crystal-chandelier.jpg`,
  `${STORE}/floor-barn-door-diamond-glass.jpg`,
  `${STORE}/black-framed-windows-warehouse.jpg`,
  `${STORE}/floor-arched-iron-studded-doors.jpg`,
  `${STORE}/warehouse-lighting-inventory.jpg`,
  `${STORE}/discount-countertop-slabs.jpg`,
  `${STORE}/floor-butcher-block-rack-stacks.jpg`,
  `${STORE}/floor-hallman-lindsay-paint-stock.jpg`,
  `${STORE}/floor-door-hardware-lock-shelves.jpg`,
  `${STORE}/kohler-vessel-sink-gold-faucet.jpg`,
  `${STORE}/red-sputnik-chandelier.jpg`,
  `${STORE}/white-base-cabinets-warehouse.jpg`,
  `${STORE}/floor-white-and-wood-cabinet-displays.jpg`,
  `${STORE}/copper-sink-wood-counter-display.jpg`,
  `${STORE}/floor-stair-newels-and-balusters.jpg`,
] as const;

const storeBed = buildAcceleratingStore(storeSrcs);

const EndSeal: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 10], [0, 1], {
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
        gap: 28,
        opacity: op,
        padding: "0 56px",
      }}
    >
      <Img
        src={staticFile("one-roof/E/logo-official@2x.webp")}
        style={{ width: 240, height: "auto" }}
      />
      <div
        style={{
          textAlign: "center",
          fontFamily,
          color: colors.ink,
          fontWeight: 300,
          fontSize: 18,
          lineHeight: 1.65,
          letterSpacing: "0.04em",
        }}
      >
        825 Washington St · Wausau, WI
        <br />
        PricelessBuilding.com
        <br />
        (715) 848-3855
      </div>
    </AbsoluteFill>
  );
};

/**
 * Unique plates only. Type = kinetic void hits, not static cards.
 */
export const OneRoofSilentV3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      {/* Stagger open — three unique plates */}
      <Sequence from={0} durationInFrames={50}>
        <WideMuralStagger
          topSrc={STAGGER_TOP}
          midSrc={MURAL}
          bottomSrc={STAGGER_BOTTOM}
          topPosition="center 42%"
          bottomPosition="center 40%"
        />
      </Sequence>

      {/* Kinetic ONE / ROOF — slam in, short hold (~1s), cut */}
      <Sequence from={50} durationInFrames={32}>
        <KineticVoidPunch line1="One" line2="Roof" />
      </Sequence>

      {/* Install cake — no stagger plates, no slam room */}
      <Sequence from={82} durationInFrames={320}>
        <PhotoBed
          plates={installHeroes}
          washOpacity={0}
          transition="dissolve"
        />
      </Sequence>

      {/* Door MG — aisle + door + slam room only here */}
      <Sequence from={402} durationInFrames={48}>
        <DoorSelectLift
          aisleSrc={AISLE}
          doorSrc={DOOR}
          selectEnd={26}
          liftEnd={48}
        />
      </Sequence>
      <Sequence from={450} durationInFrames={42}>
        <DoorHomeSlam
          room={{
            roomSrc: SLAM_ROOM,
            objectPosition: "center 40%",
          }}
          doorSrc={DOOR}
          doorLeft="62%"
          doorTop="18%"
          doorWidth={200}
        />
      </Sequence>

      <Sequence from={492} durationInFrames={168}>
        <PhotoBed
          plates={storeBed}
          washOpacity={0}
          transition="cut"
          cutSnap
          scaleFrom={1}
          scaleTo={1.015}
        />
      </Sequence>

      {/* Kinetic FOR / LESS — hit then hold briefly */}
      <Sequence from={660} durationInFrames={70}>
        <KineticVoidPunch line1="For" line2="Less" />
      </Sequence>

      <Sequence from={730} durationInFrames={170}>
        <EndSeal />
      </Sequence>
    </AbsoluteFill>
  );
};
