import React from "react";
import { AbsoluteFill } from "remotion";
import { KohlerIntroStack } from "../../brand/KohlerIntroStack";
import { colors } from "../../brand/tokens";

export type StoryBeat = {
  italic?: string;
  bold: string;
  skinny?: string;
  /** Horizontal position of type block */
  align?: "left" | "center";
  color?: string;
  scale?: number;
  slam?: boolean;
  /** Vertical placement */
  bottom?: number | string;
  top?: number | string;
  /** Kohler Shorts: dead-center in frame */
  placement?: "bottom" | "center";
};

type StoryTypeLayerProps = {
  beat: StoryBeat;
  /** Side inset: Kohler central margins */
  sideInset?: number;
  bottomInset?: number;
};

/**
 * Continuous story type layer: Kohler italic -> bold -> skinny, no chrome.
 */
export const StoryTypeLayer: React.FC<StoryTypeLayerProps> = ({
  beat,
  sideInset = 112,
  bottomInset = 120,
}) => {
  const align = beat.align ?? "center";
  const placement = beat.placement ?? "bottom";
  const centered = placement === "center";
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        display: "flex",
        justifyContent: align === "center" ? "center" : "flex-start",
        alignItems: centered
          ? "center"
          : beat.top != null
            ? "flex-start"
            : "flex-end",
        paddingLeft: sideInset,
        paddingRight: sideInset,
        paddingBottom: centered || beat.top != null ? undefined : bottomInset,
        paddingTop: beat.top != null ? beat.top : undefined,
      }}
    >
      <KohlerIntroStack
        italic={beat.italic}
        bold={beat.bold}
        skinny={beat.skinny}
        align={align}
        color={beat.color ?? colors.cream}
        scale={beat.scale ?? 1}
        slam={beat.slam}
      />
    </AbsoluteFill>
  );
};
