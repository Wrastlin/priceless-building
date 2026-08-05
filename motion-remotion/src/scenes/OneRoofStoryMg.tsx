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
import { DoorHomeSlam } from "../components/one-roof/DoorHomeSlam";
import { DoorSelectLift } from "../components/one-roof/DoorSelectLift";
import { PhotoBed, type PhotoBedPlate } from "../components/one-roof/PhotoBed";
import { StoryTypeLayer } from "../components/one-roof/StoryTypeLayer";

const DOOR = "one-roof/B/intake-black-craftsman-door.jpg";
const AISLE = "one-roof/B/floor-door-aisle-light-and-dark.jpg";

/** ~40s @ 30fps — mobile Shorts master */
export const STORY_MG_DURATION = 1200;

const openBed: readonly PhotoBedPlate[] = [
  {
    src: "one-roof/A/storefront-sign-on-brick.webp",
    from: 0,
    to: 90,
    objectPosition: "center center",
  },
  {
    src: "one-roof/A/mural-wide.webp",
    from: 70,
    to: 150,
    objectPosition: "48% center",
  },
];

const huntBed: readonly PhotoBedPlate[] = [
  {
    src: "one-roof/B/dark-base-cabinets-warehouse-row.jpg",
    from: 0,
    to: 50,
    objectPosition: "56% center",
  },
  { src: "one-roof/B/floor-door-aisle-light-and-dark.jpg", from: 40, to: 95 },
  {
    src: "one-roof/B/floor-window-aisle-warehouse.jpg",
    from: 85,
    to: 140,
    objectPosition: "49% center",
  },
  {
    src: "one-roof/B/floor-vanity-row-mirrors-lights.jpg",
    from: 130,
    to: 185,
    objectPosition: "46% center",
  },
  { src: "one-roof/B/floor-globe-crystal-chandelier.jpg", from: 175, to: 210 },
];

const sisterBed: readonly PhotoBedPlate[] = [
  {
    src: "one-roof/C/builders-corner-hero.jpg",
    from: 0,
    to: 75,
    objectPosition: "57% center",
  },
  {
    src: "one-roof/C/white-kitchen-marble-island.jpg",
    from: 60,
    to: 150,
    objectPosition: "58% center",
  },
];

const homes: readonly {
  roomSrc: string;
  doorLeft: string;
  doorTop: string;
  doorWidth?: number;
  objectPosition?: string;
}[] = [
  {
    roomSrc: "one-roof/D/kitchen-wood-island-black-pendants.jpg",
    doorLeft: "58%",
    doorTop: "22%",
    doorWidth: 200,
  },
  {
    roomSrc: "one-roof/D/kitchen-white-island-shiplap.jpg",
    doorLeft: "10%",
    doorTop: "24%",
    doorWidth: 190,
  },
  {
    roomSrc: "one-roof/C/builders-corner-hero.jpg",
    doorLeft: "62%",
    doorTop: "20%",
    doorWidth: 190,
    objectPosition: "57% center",
  },
  {
    roomSrc: "one-roof/D/install-kitchen-walnut-island-windows.webp",
    doorLeft: "8%",
    doorTop: "26%",
    doorWidth: 190,
  },
  {
    roomSrc: "one-roof/D/pergola-patio-daylight.jpg",
    doorLeft: "52%",
    doorTop: "28%",
    doorWidth: 210,
  },
];

/** Hold italic steady; only the bold word changes. */
const DISCOVER = ["Doors", "Windows", "Cabinets"] as const;

const HOME_LEN = 66;

const VoidHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const doorW = Math.min(320, width * 0.52);
  const doorH = doorW * 1.85;
  const scale = interpolate(frame, [0, 9], [1.12, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 38%, ${colors.cream} 0%, ${colors.parchment} 40%, ${colors.ink} 90%)`,
      }}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          transform: `scale(${scale})`,
          paddingBottom: 80,
        }}
      >
        <div style={{ width: doorW, height: doorH, overflow: "hidden" }}>
          <Img
            src={staticFile(DOOR)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 8%",
            }}
          />
        </div>
        {/* Product speaks — one bold lock, no essay */}
        <KohlerIntroStack italic="Introducing" bold="This door" color={colors.ink} slam />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** End: one punch line, then logo + address. No card chrome. */
const PunchClose: React.FC = () => {
  const frame = useCurrentFrame();
  const endOp = interpolate(frame, [70, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <Sequence from={0} durationInFrames={75}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 56px",
          }}
        >
          <KohlerIntroStack bold="For less" color={colors.cream} slam scale={1.15} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={70} durationInFrames={130}>
        <AbsoluteFill
          style={{
            backgroundColor: colors.cream,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            opacity: endOp,
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
              fontFamily: "Montserrat, sans-serif",
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
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * One Roof Story MG — mobile Shorts master (9:16).
 * Sparse type. Photos + door MG do the talking.
 */
export const OneRoofStoryMg: React.FC = () => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  // Shorts-safe: sides ~56–64, bottom above UI chrome
  const side = vertical ? 56 : 100;
  const bottom = vertical ? 220 : 100;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      {/* OPEN 0–150: one lockup */}
      <Sequence from={0} durationInFrames={150}>
        <PhotoBed plates={openBed} />
        <Sequence from={18} durationInFrames={120}>
          <StoryTypeLayer
            sideInset={side}
            bottomInset={bottom}
            beat={{
              italic: "Wausau",
              bold: "One roof",
              placement: "center",
            }}
          />
        </Sequence>
      </Sequence>

      {/* HUNT 150–360: Ready to discover [WORD] */}
      <Sequence from={150} durationInFrames={210}>
        <PhotoBed plates={huntBed} washOpacity={0.45} />
        {DISCOVER.map((word, i) => (
          <Sequence
            key={word}
            from={20 + i * 60}
            durationInFrames={55}
          >
            <StoryTypeLayer
              sideInset={side}
              bottomInset={bottom}
              beat={{
                italic: "Ready to discover",
                bold: word,
                placement: "center",
                slam: true,
              }}
            />
          </Sequence>
        ))}
      </Sequence>

      {/* SISTERS 360–510: brand names only */}
      <Sequence from={360} durationInFrames={150}>
        <PhotoBed plates={sisterBed} washOpacity={0.38} />
        <Sequence from={12} durationInFrames={60}>
          <StoryTypeLayer
            sideInset={side}
            bottomInset={bottom}
            beat={{ bold: "Builders Corner", placement: "center", slam: true }}
          />
        </Sequence>
        <Sequence from={80} durationInFrames={70}>
          <StoryTypeLayer
            sideInset={side}
            bottomInset={bottom}
            beat={{ bold: "4 Squared", placement: "center", slam: true }}
          />
        </Sequence>
      </Sequence>

      {/* DOOR MG 510–1000 */}
      <Sequence from={510} durationInFrames={90}>
        <DoorSelectLift aisleSrc={AISLE} doorSrc={DOOR} selectEnd={45} liftEnd={90} />
      </Sequence>
      <Sequence from={600} durationInFrames={55}>
        <VoidHero />
      </Sequence>
      {homes.map((home, i) => (
        <Sequence
          key={home.roomSrc}
          from={655 + i * HOME_LEN}
          durationInFrames={HOME_LEN}
        >
          <DoorHomeSlam
            room={{
              roomSrc: home.roomSrc,
              objectPosition: home.objectPosition,
            }}
            doorSrc={DOOR}
            doorLeft={home.doorLeft}
            doorTop={home.doorTop}
            doorWidth={home.doorWidth ?? 200}
          />
          {/* No type on home hits — the slam is the message */}
        </Sequence>
      ))}

      {/* PUNCH 1000–1200 */}
      <Sequence from={1000} durationInFrames={200}>
        <PunchClose />
      </Sequence>
    </AbsoluteFill>
  );
};
