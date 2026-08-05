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

export const ONE_STOP_V4_DURATION = 1050;

const STORE = "one-roof/v3-a";
const INSTALL = "one-roof/v3-install";
const DOOR = `${STORE}/intake-black-craftsman-door.jpg`;
const AISLE = `${STORE}/floor-door-aisle-light-and-dark.jpg`;
const MURAL = `${STORE}/mural-wide.webp`;

const { fontFamily } = loadFont("normal", {
  weights: ["300", "700"],
  subsets: ["latin"],
});

const KineticVoidPunch: React.FC<{
  line1: string;
  line2: string;
  ground?: string;
  ink?: string;
}> = ({
  line1,
  line2,
  ground = colors.ink,
  ink = colors.white,
}) => {
  const frame = useCurrentFrame();
  const enter = (delay: number) => {
    const local = frame - delay;
    return {
      opacity: interpolate(local, [0, 4], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
      scale: interpolate(local, [0, 7], [1.32, 1], {
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
      y: interpolate(local, [0, 7], [44, 0], {
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    };
  };
  const first = enter(0);
  const second = enter(7);
  const styleFor = (motion: ReturnType<typeof enter>) => ({
    color: ink,
    fontFamily,
    fontSize: 190,
    fontWeight: Number(typeWeights.bold),
    letterSpacing: "-0.045em",
    lineHeight: 0.85,
    opacity: motion.opacity,
    textAlign: "center" as const,
    textTransform: "uppercase" as const,
    transform: `translateY(${motion.y}px) scale(${motion.scale})`,
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        backgroundColor: ground,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 54px",
      }}
    >
      <div style={styleFor(first)}>{line1}</div>
      <div style={styleFor(second)}>{line2}</div>
    </AbsoluteFill>
  );
};

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

const storeDurations = [
  18, 17, 16, 16, 15, 14, 14, 13, 13, 12, 12, 11, 11, 10, 10, 9, 8, 9,
] as const;

const storeBed: readonly PhotoBedPlate[] = storeSrcs.map((src, index) => {
  const from = storeDurations
    .slice(0, index)
    .reduce<number>((sum, duration) => sum + duration, 0);
  return {
    src,
    from,
    to: from + storeDurations[index],
    objectPosition: index % 3 === 0 ? "center 42%" : "center center",
    scaleFrom: 1,
    scaleTo: 1.018,
  };
});

const buildersBed: readonly PhotoBedPlate[] = [
  {
    src: `${INSTALL}/kitchen-oak-mosaic-backsplash.jpg`,
    from: 0,
    to: 38,
    objectPosition: "center 42%",
    scaleFrom: 1,
    scaleTo: 1.035,
  },
  {
    src: `${INSTALL}/kitchen-white-open-wood-accents.jpg`,
    from: 30,
    to: 68,
    objectPosition: "center 44%",
    scaleFrom: 1.035,
    scaleTo: 1,
  },
  {
    src: `${INSTALL}/dark-double-vanity-bathroom-install.jpg`,
    from: 60,
    to: 98,
    objectPosition: "center 34%",
    scaleFrom: 1,
    scaleTo: 1.035,
  },
  {
    src: `${INSTALL}/white-kitchen-marble-island.jpg`,
    from: 90,
    to: 128,
    objectPosition: "center 42%",
    scaleFrom: 1.035,
    scaleTo: 1,
  },
  {
    src: `${INSTALL}/kitchen-counter-marble-detail.jpg`,
    from: 120,
    to: 158,
    objectPosition: "center center",
    scaleFrom: 1,
    scaleTo: 1.035,
  },
];

const craftBed: readonly PhotoBedPlate[] = [
  {
    src: `${INSTALL}/kitchen-wood-island-black-pendants.jpg`,
    from: 0,
    to: 38,
    objectPosition: "center 42%",
    scaleFrom: 1,
    scaleTo: 1.035,
  },
  {
    src: `${INSTALL}/dark-cabinet-kitchen-install.jpg`,
    from: 30,
    to: 68,
    objectPosition: "center center",
    scaleFrom: 1.035,
    scaleTo: 1,
  },
  {
    src: `${INSTALL}/flooring-dark-plank-install.jpg`,
    from: 60,
    to: 98,
    objectPosition: "center center",
    scaleFrom: 1,
    scaleTo: 1.035,
  },
  {
    src: `${INSTALL}/kitchen-island-wood-cabinets-range.jpg`,
    from: 90,
    to: 128,
    objectPosition: "center 42%",
    scaleFrom: 1.035,
    scaleTo: 1,
  },
  {
    src: `${INSTALL}/pergola-patio-wide.jpg`,
    from: 120,
    to: 158,
    objectPosition: "center center",
    scaleFrom: 1,
    scaleTo: 1.035,
  },
];

const ContextLines: React.FC = () => {
  const frame = useCurrentFrame();
  const lines = ["One stop", "Premier remodel", "Discount supplies"];

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        backgroundColor: colors.ink,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 56px",
      }}
    >
      {lines.map((line, index) => {
        const local = frame - index * 8;
        const opacity = interpolate(local, [0, 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = interpolate(local, [0, 7], [index % 2 === 0 ? -90 : 90, 0], {
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={line}
            style={{
              color: index === 0 ? colors.rust : colors.white,
              fontFamily,
              fontSize: index === 0 ? 126 : 88,
              fontWeight: Number(typeWeights.bold),
              letterSpacing: "-0.04em",
              lineHeight: 0.98,
              opacity,
              textAlign: "center",
              textTransform: "uppercase",
              transform: `translateX(${x}px)`,
            }}
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const EndSeal: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 14], [0.92, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        backgroundColor: colors.cream,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        opacity,
        padding: "0 56px",
      }}
    >
      <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
        <Img
          src={staticFile("one-roof/E/logo-official@2x.webp")}
          style={{ height: "auto", width: 360 }}
        />
        <div
          style={{
            color: colors.ink,
            fontFamily,
            fontSize: 31,
            fontWeight: Number(typeWeights.bold),
            letterSpacing: "0.015em",
            lineHeight: 1.45,
            marginTop: 38,
            textTransform: "uppercase",
          }}
        >
          825 Washington St
          <br />
          Wausau, WI
        </div>
        <div
          style={{
            color: colors.soft,
            fontFamily,
            fontSize: 23,
            fontWeight: Number(typeWeights.skinny),
            letterSpacing: "0.03em",
            lineHeight: 1.55,
            marginTop: 20,
          }}
        >
          PricelessBuilding.com
          <br />
          (715) 848-3855
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const OneRoofOneStopV4: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <Sequence from={0} durationInFrames={64} premountFor={30}>
        <WideMuralStagger
          topSrc={`${INSTALL}/kitchen-white-island-shiplap.jpg`}
          midSrc={MURAL}
          bottomSrc={`${INSTALL}/pergola-patio-daylight.jpg`}
          topPosition="center 42%"
          bottomPosition="center 40%"
        />
      </Sequence>
      <Sequence from={64} durationInFrames={35} premountFor={30}>
        <KineticVoidPunch line1="One" line2="Roof" />
      </Sequence>

      <Sequence from={99} durationInFrames={228} premountFor={30}>
        <PhotoBed
          plates={storeBed}
          transition="cut"
          cutSnap
          washOpacity={0}
        />
      </Sequence>

      <Sequence from={327} durationInFrames={70} premountFor={30}>
        <DoorSelectLift
          aisleSrc={AISLE}
          doorSrc={DOOR}
          selectEnd={28}
          liftEnd={55}
        />
      </Sequence>
      <Sequence from={397} durationInFrames={40} premountFor={30}>
        <DoorHomeSlam
          room={{
            roomSrc: `${INSTALL}/kitchen-dark-shaker-marble-island.jpg`,
            objectPosition: "center 42%",
          }}
          doorSrc={DOOR}
          doorLeft="57%"
          doorTop="14%"
          doorWidth={380}
          doorHeight={720}
        />
      </Sequence>
      <Sequence from={437} durationInFrames={40} premountFor={30}>
        <DoorHomeSlam
          room={{
            roomSrc: `${INSTALL}/white-kitchen-wood-island.jpg`,
            objectPosition: "center 42%",
          }}
          doorSrc={DOOR}
          doorLeft="12%"
          doorTop="14%"
          doorWidth={380}
          doorHeight={720}
        />
      </Sequence>
      <Sequence from={477} durationInFrames={40} premountFor={30}>
        <DoorHomeSlam
          room={{
            roomSrc: `${INSTALL}/pergola-string-lights-night.jpg`,
            objectPosition: "center center",
          }}
          doorSrc={DOOR}
          doorLeft="58%"
          doorTop="14%"
          doorWidth={380}
          doorHeight={720}
        />
      </Sequence>

      <Sequence from={517} durationInFrames={158} premountFor={30}>
        <PhotoBed
          plates={buildersBed}
          transition="dissolve"
          washOpacity={0}
        />
      </Sequence>
      <Sequence from={675} durationInFrames={32} premountFor={30}>
        <KineticVoidPunch
          line1="Brands"
          line2="You Trust"
          ground={colors.parchment}
          ink={colors.ink}
        />
      </Sequence>

      <Sequence from={707} durationInFrames={158} premountFor={30}>
        <PhotoBed plates={craftBed} transition="dissolve" washOpacity={0} />
      </Sequence>
      <Sequence from={865} durationInFrames={32} premountFor={30}>
        <KineticVoidPunch
          line1="Craft"
          line2="Installed"
          ground={colors.sage}
          ink={colors.ink}
        />
      </Sequence>

      <Sequence from={897} durationInFrames={61} premountFor={30}>
        <ContextLines />
      </Sequence>
      <Sequence from={958} durationInFrames={92} premountFor={30}>
        <EndSeal />
      </Sequence>
    </AbsoluteFill>
  );
};
