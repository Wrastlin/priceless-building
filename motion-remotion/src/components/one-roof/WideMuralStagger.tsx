import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { colors } from "../../brand/tokens";

type StaggerProps = {
  topSrc: string;
  midSrc: string;
  bottomSrc: string;
  topPosition?: string;
  bottomPosition?: string;
  /** Intrinsic aspect of the wide mid plate (w/h). Mural ~2.34 */
  midAspect?: number;
};

/**
 * 9:16 stagger: portrait / wide mural / portrait.
 * Mid band height follows mural aspect so the full wide image reads.
 */
export const WideMuralStagger: React.FC<StaggerProps> = ({
  topSrc,
  midSrc,
  bottomSrc,
  topPosition = "center center",
  bottomPosition = "center center",
  midAspect = 2048 / 874,
}) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 50], [1, 1.025], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.ink,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", position: "relative" }}>
        <Img
          src={staticFile(topSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: topPosition,
            transform: `scale(${push})`,
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          aspectRatio: `${midAspect}`,
          flexShrink: 0,
          overflow: "hidden",
          backgroundColor: colors.ink,
        }}
      >
        <Img
          src={staticFile(midSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            transform: `scale(${push})`,
          }}
        />
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", position: "relative" }}>
        <Img
          src={staticFile(bottomSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: bottomPosition,
            transform: `scale(${push})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
