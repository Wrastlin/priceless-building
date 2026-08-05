import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Ground, WeightStack } from "../brand/WeightStack";
import { ProductPlaceholder } from "../brand/ProductPlaceholder";
import { colors } from "../brand/tokens";

/**
 * Style 02 — Sunrise Archive
 * Distilled from Kohler Sunrise Short: color field IS the world.
 */
export const SunriseArchive: React.FC<{
  finishName?: string;
  fieldColor?: string;
  inkOnField?: string;
}> = ({
  finishName = "Sunrise",
  fieldColor = "#d4a84b",
  inkOnField = "#3a2a0a",
}) => {
  const frame = useCurrentFrame();
  const productIn = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Ground color={fieldColor}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Sequence layout="none">
          <div style={{ position: "absolute", top: "28%", left: 56, right: 56 }}>
            <WeightStack
              line1="Discover"
              brand={finishName}
              fadeIn={[5, 28]}
              color={inkOnField}
              align="center"
              scale={1.1}
            />
          </div>
        </Sequence>

        <div style={{ opacity: productIn, marginTop: 120 }}>
          <ProductPlaceholder
            kind="fixture"
            push={[50, 120]}
            color={fieldColor}
            accent={inkOnField}
          />
        </div>

        <Sequence from={200} layout="none">
          <ArchiveFooter color={inkOnField} />
        </Sequence>
      </AbsoluteFill>
    </Ground>
  );
};

const ArchiveFooter: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        color,
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 300,
        fontSize: 22,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}
    >
      Finish stories · Price-Less
    </div>
  );
};

/**
 * Style 05 — Price Micro (~6s)
 * Cream ground, weight stack, rust price.
 */
export const PriceMicro: React.FC = () => {
  return (
    <Ground color={colors.cream}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <ProductPlaceholder
          kind="door"
          push={[0, 60]}
          pushAmount={0.04}
          accent={colors.rust}
        />
        <Sequence from={40} layout="none">
          <div style={{ position: "absolute", left: 56, bottom: 140 }}>
            <WeightStack
              line1="The bold"
              line2="look of"
              brand="Price-Less"
              fadeIn={[0, 16]}
              scale={0.95}
            />
          </div>
        </Sequence>
        <Sequence from={110} layout="none">
          <MicroPrice />
        </Sequence>
      </AbsoluteFill>
    </Ground>
  );
};

const MicroPrice: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        right: 56,
        bottom: 150,
        opacity,
        textAlign: "right",
      }}
    >
      <div
        style={{
          color: colors.rust,
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 56,
        }}
      >
        $428
      </div>
      <div
        style={{
          color: colors.soft,
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 300,
          fontSize: 18,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: 8,
        }}
      >
        Wausau · verified
      </div>
    </div>
  );
};

/**
 * Style 03 — Form Fetish open (door on cream void)
 */
export const FormFetishDoor: React.FC = () => {
  const frame = useCurrentFrame();
  const edge = interpolate(frame, [30, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Ground color={colors.porcelain}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <ProductPlaceholder kind="door" push={[10, 120]} pushAmount={0.06} />
          <div
            style={{
              position: "absolute",
              inset: -12,
              border: `1px solid rgba(26,24,24,${0.15 * edge})`,
              pointerEvents: "none",
            }}
          />
        </div>
        <Sequence from={90} layout="none">
          <div style={{ position: "absolute", left: 56, bottom: 120 }}>
            <WeightStack
              line1="Built to"
              line2="make an"
              brand="Entrance"
              fadeIn={[0, 20]}
            />
          </div>
        </Sequence>
      </AbsoluteFill>
    </Ground>
  );
};
