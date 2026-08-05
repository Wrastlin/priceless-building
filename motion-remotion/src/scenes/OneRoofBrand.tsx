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
import { WeightStack } from "../brand/WeightStack";
import { colors } from "../brand/tokens";

type PlateSpec = {
  src: string;
  duration: number;
  line1: string;
  brand: string;
  line2?: string;
  objectPosition?: string;
  verticalPosition?: string;
  contain?: boolean;
  footer?: string;
};

const chapterA: readonly PlateSpec[] = [
  {
    src: "one-roof/A/storefront-sign-on-brick.webp",
    duration: 60,
    line1: "Wausau",
    brand: "Since 1978",
    contain: true,
  },
  {
    src: "one-roof/A/mural-wide.webp",
    duration: 60,
    line1: "Three businesses",
    brand: "One roof",
    verticalPosition: "48% center",
  },
];

const chapterB: readonly PlateSpec[] = [
  {
    src: "one-roof/B/dark-base-cabinets-warehouse-row.jpg",
    duration: 38,
    line1: "The warehouse",
    brand: "Price-Less",
    verticalPosition: "56% center",
  },
  {
    src: "one-roof/B/floor-door-aisle-light-and-dark.jpg",
    duration: 37,
    line1: "Walk the aisles",
    brand: "Doors",
    verticalPosition: "center center",
  },
  {
    src: "one-roof/B/floor-window-aisle-warehouse.jpg",
    duration: 37,
    line1: "Ready to discover",
    brand: "Windows",
    verticalPosition: "49% center",
  },
  {
    src: "one-roof/B/floor-vanity-row-mirrors-lights.jpg",
    duration: 38,
    line1: "Room by room",
    brand: "Vanities",
    verticalPosition: "46% center",
  },
  {
    src: "one-roof/B/floor-globe-crystal-chandelier.jpg",
    duration: 37,
    line1: "Statement pieces",
    brand: "Lighting",
    verticalPosition: "center center",
  },
  {
    src: "one-roof/B/floor-butcher-block-rack-stacks.jpg",
    duration: 38,
    line1: "Solid surfaces",
    brand: "Countertops",
    verticalPosition: "58% center",
  },
  {
    src: "one-roof/B/floor-lumber-millwork-room.jpg",
    duration: 37,
    line1: "Finish the room",
    brand: "Trim",
    verticalPosition: "58% center",
  },
  {
    src: "one-roof/B/intake-black-craftsman-door.jpg",
    duration: 38,
    line1: "Hundreds of",
    brand: "Finds",
    footer: "Inventory changes constantly",
    verticalPosition: "center center",
  },
];

const chapterC: readonly PlateSpec[] = [
  {
    src: "one-roof/C/builders-corner-hero.jpg",
    duration: 40,
    line1: "Design starts at",
    brand: "Builders Corner",
    verticalPosition: "57% center",
  },
  {
    src: "one-roof/C/white-kitchen-marble-island.jpg",
    duration: 40,
    line1: "Premier brands",
    brand: "For real remodels",
    verticalPosition: "58% center",
  },
  {
    src: "one-roof/C/kohler-vessel-sink-gold-faucet.jpg",
    duration: 40,
    line1: "Fixtures with",
    brand: "A point of view",
    verticalPosition: "center center",
  },
];

const chapterD: readonly PlateSpec[] = [
  {
    src: "one-roof/D/kitchen-wood-island-black-pendants.jpg",
    duration: 45,
    line1: "Built by",
    brand: "4 Squared",
    verticalPosition: "center center",
  },
  {
    src: "one-roof/D/kitchen-white-island-shiplap.jpg",
    duration: 45,
    line1: "Installed by",
    brand: "Our crew",
    verticalPosition: "center center",
  },
  {
    src: "one-roof/D/install-kitchen-walnut-island-windows.webp",
    duration: 45,
    line1: "Craftsmanship",
    brand: "You can see",
    verticalPosition: "center center",
  },
  {
    src: "one-roof/D/pergola-patio-daylight.jpg",
    duration: 45,
    line1: "From inside",
    brand: "To outdoors",
    verticalPosition: "center center",
  },
];

const SoftPhoto: React.FC<{
  spec: PlateSpec;
  vertical: boolean;
}> = ({ spec, vertical }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, spec.duration], [1, 1.04], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const position = vertical
    ? (spec.verticalPosition ?? spec.objectPosition ?? "center center")
    : (spec.objectPosition ?? "center center");

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: colors.ink }}>
      {spec.contain ? (
        <Img
          src={staticFile(spec.src)}
          style={{
            position: "absolute",
            inset: -45,
            width: "calc(100% + 90px)",
            height: "calc(100% + 90px)",
            objectFit: "cover",
            filter: "blur(30px)",
            opacity: 0.54,
            transform: `scale(${scale * 1.05})`,
          }}
        />
      ) : null}
      <Img
        src={staticFile(spec.src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: spec.contain ? "contain" : "cover",
          objectPosition: position,
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(26,24,24,0.76) 0%, rgba(26,24,24,0.28) 53%, rgba(26,24,24,0.08) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(26,24,24,0.42) 0%, transparent 42%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Plate: React.FC<{ spec: PlateSpec; vertical: boolean }> = ({
  spec,
  vertical,
}) => {
  const frame = useCurrentFrame();
  const exitOpacity = interpolate(
    frame,
    [spec.duration - 4, spec.duration],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <SoftPhoto spec={spec} vertical={vertical} />
      <div
        style={{
          position: "absolute",
          left: vertical ? 72 : 112,
          right: vertical ? 60 : 112,
          bottom: vertical ? 250 : 112,
        }}
      >
        <WeightStack
          line1={spec.line1}
          line2={spec.line2}
          brand={spec.brand}
          color={colors.cream}
          scale={vertical ? 1.08 : 1.34}
          fadeIn={[2, Math.min(12, spec.duration - 8)]}
        />
        {spec.footer ? (
          <div
            style={{
              marginTop: 24,
              color: colors.cream,
              fontFamily: "Montserrat, sans-serif",
              fontSize: vertical ? 27 : 31,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              opacity: interpolate(frame, [8, 16], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {spec.footer}
          </div>
        ) : null}
      </div>
      <div
        style={{
          position: "absolute",
          top: vertical ? 64 : 48,
          right: vertical ? 58 : 72,
          width: vertical ? 92 : 118,
          height: 8,
          backgroundColor: colors.rust,
        }}
      />
    </AbsoluteFill>
  );
};

const PlateRun: React.FC<{
  plates: readonly PlateSpec[];
  vertical: boolean;
}> = ({ plates, vertical }) => {
  let from = 0;
  return (
    <>
      {plates.map((spec) => {
        const start = from;
        from += spec.duration;
        return (
          <Sequence
            key={spec.src}
            from={start}
            durationInFrames={spec.duration}
            premountFor={30}
          >
            <Plate spec={spec} vertical={vertical} />
          </Sequence>
        );
      })}
    </>
  );
};

const ChapterWipe: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 14], [-110, 110], {
    easing: Easing.bezier(0.65, 0, 0.35, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.rust,
        transform: `translateX(${x}%)`,
      }}
    />
  );
};

const CloseScene: React.FC<{ vertical: boolean }> = ({ vertical }) => {
  const frame = useCurrentFrame();
  const logoScale = interpolate(frame, [0, 60], [0.94, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardIn = interpolate(frame, [72, 88], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.parchment }}>
      <Sequence durationInFrames={78} premountFor={30}>
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.parchment,
          }}
        >
          <Img
            src={staticFile("one-roof/E/logo-official@2x.webp")}
            style={{
              width: vertical ? 620 : 420,
              height: vertical ? 620 : 420,
              objectFit: "contain",
              transform: `scale(${logoScale})`,
            }}
          />
          <div
            style={{
              marginTop: vertical ? 44 : 20,
              color: colors.ink,
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: vertical ? 30 : 28,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
            }}
          >
            Price-Less · Builders Corner · 4 Squared
          </div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={72} durationInFrames={108} premountFor={30}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            padding: vertical ? "0 74px" : "0 150px",
            backgroundColor: colors.ink,
            opacity: cardIn,
          }}
        >
          <WeightStack
            line1="Come see it"
            brand={"825 Washington St\nWausau"}
            color={colors.cream}
            scale={vertical ? 1.12 : 1.44}
            fadeIn={[4, 17]}
          />
          <div
            style={{
              width: vertical ? 170 : 210,
              height: 10,
              backgroundColor: colors.rust,
              margin: "38px 0 30px",
            }}
          />
          <div
            style={{
              color: colors.cream,
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: vertical ? 29 : 34,
              lineHeight: 1.55,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            PRICELESSBUILDING.COM
            <br />
            (715) 848-3855
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export const OneRoofBrand: React.FC = () => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <Sequence durationInFrames={120} premountFor={30}>
        <PlateRun plates={chapterA} vertical={vertical} />
      </Sequence>
      <Sequence from={120} durationInFrames={300} premountFor={30}>
        <PlateRun plates={chapterB} vertical={vertical} />
      </Sequence>
      <Sequence from={420} durationInFrames={120} premountFor={30}>
        <PlateRun plates={chapterC} vertical={vertical} />
      </Sequence>
      <Sequence from={540} durationInFrames={180} premountFor={30}>
        <PlateRun plates={chapterD} vertical={vertical} />
      </Sequence>
      <Sequence from={720} durationInFrames={180} premountFor={30}>
        <CloseScene vertical={vertical} />
      </Sequence>

      {[120, 420, 540, 720].map((from) => (
        <Sequence
          key={from}
          from={from - 7}
          durationInFrames={15}
          premountFor={15}
        >
          <ChapterWipe />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
