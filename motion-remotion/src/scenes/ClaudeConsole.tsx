import { loadFont } from "@remotion/google-fonts/Montserrat";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { ProductPlaceholder } from "../brand/ProductPlaceholder";
import { WeightStack } from "../brand/WeightStack";
import { brandKit, colors, typeWeights } from "../brand/tokens";

const { fontFamily } = loadFont("normal", {
  weights: ["300", "700"],
  subsets: ["latin"],
});

type Variant = "builders" | "priceless";

type Palette = {
  ground: string;
  accent: string;
  lockup: string;
  detailGround: string;
  productAccent: string;
};

const palettes: Record<Variant, Palette> = {
  builders: {
    ground: brandKit.builders.ground,
    accent: colors.brass,
    lockup: brandKit.builders.lockup,
    detailGround: colors.cream,
    productAccent: colors.brass,
  },
  priceless: {
    ground: brandKit.priceless.ground,
    accent: colors.rust,
    lockup: brandKit.priceless.lockup,
    detailGround: colors.parchment,
    productAccent: colors.soft,
  },
};

export const CLAUDE_CONSOLE_SCENES = [
  { id: "S01", from: 0, duration: 36, label: "Wide hero" },
  { id: "S02", from: 36, duration: 24, label: "Brand field" },
  { id: "S03", from: 60, duration: 45, label: "Porcelain crop" },
  { id: "S04", from: 105, duration: 45, label: "Brass junction" },
  { id: "S05", from: 150, duration: 30, label: "Shelf insert" },
  { id: "S06", from: 180, duration: 45, label: "Type stack" },
  { id: "S07", from: 225, duration: 30, label: "Faucet detail" },
  { id: "S08", from: 255, duration: 45, label: "Final lockup" },
] as const;

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const reveal = (frame: number, end = 10) =>
  interpolate(frame, [0, end], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const SceneCode: React.FC<{ id: string; color?: string }> = ({
  id,
  color = colors.ink,
}) => (
  <div
    style={{
      position: "absolute",
      top: 62,
      right: 58,
      color,
      fontFamily,
      fontWeight: Number(typeWeights.bold),
      fontSize: 18,
      letterSpacing: "0.22em",
    }}
  >
    {id}
  </div>
);

const ProductStage: React.FC<{
  accent: string;
  scale?: number;
  x?: number;
  y?: number;
  motion?: number;
}> = ({ accent, scale = 1, x = 0, y = 0, motion = 0.04 }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 44], [1, 1 + motion], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale * push})`,
        transformOrigin: "center",
      }}
    >
      <ProductPlaceholder
        kind="console"
        accent={accent}
        push={[0, 44]}
        pushAmount={0}
      />
    </div>
  );
};

const BrassHardwareGeometry: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 44], [1, 1.05], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 420,
        top: 250,
        width: 560,
        height: 1040,
        transform: `scale(${push})`,
        transformOrigin: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 250,
          top: 0,
          width: 90,
          height: 1040,
          borderRadius: 45,
          background: `linear-gradient(90deg, ${accent}, #dfc28e, ${accent})`,
          boxShadow: "0 34px 70px rgba(26,24,24,0.2)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 430,
          width: 560,
          height: 84,
          borderRadius: 42,
          background: `linear-gradient(180deg, #dfc28e, ${accent})`,
        }}
      />
      {[390, 515].map((top) => (
        <div
          key={top}
          style={{
            position: "absolute",
            left: 222,
            top,
            width: 146,
            height: 32,
            borderRadius: 16,
            backgroundColor: "#d6b575",
            boxShadow: "0 8px 14px rgba(26,24,24,0.18)",
          }}
        />
      ))}
    </div>
  );
};

const ShelfGeometry: React.FC<{ accent: string }> = ({ accent }) => (
  <div
    style={{
      position: "absolute",
      left: 70,
      right: 70,
      top: 500,
      height: 620,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 90,
        height: 20,
        backgroundColor: accent,
      }}
    />
    {Array.from({ length: 10 }).map((_, index) => (
      <div
        key={index}
        style={{
          position: "absolute",
          left: index * 78,
          bottom: 88,
          width: 12,
          height: 270,
          backgroundColor: accent,
          transform: "skewX(-12deg)",
          opacity: 0.82,
        }}
      />
    ))}
    {[0, 1, 2].map((index) => (
      <div
        key={index}
        style={{
          position: "absolute",
          left: 280 - index * 18,
          bottom: 118 + index * 92,
          width: 430 + index * 34,
          height: 112,
          borderRadius: 18,
          backgroundColor: index === 2 ? colors.white : "#e4e0da",
          border: "2px solid rgba(26,24,24,0.08)",
          boxShadow: "0 16px 28px rgba(26,24,24,0.1)",
        }}
      />
    ))}
  </div>
);

const FaucetGeometry: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 29], [0.92, 1.03], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "relative",
        width: 600,
        height: 760,
        transform: `scale(${push})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 118,
          top: 70,
          width: 360,
          height: 470,
          border: `48px solid ${accent}`,
          borderBottom: 0,
          borderRadius: "210px 210px 0 0",
          boxShadow: "inset 18px 0 18px rgba(255,255,255,0.26)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 118,
          top: 500,
          width: 48,
          height: 140,
          backgroundColor: accent,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 74,
          top: 500,
          width: 180,
          height: 48,
          borderRadius: 24,
          backgroundColor: accent,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 32,
          right: 32,
          bottom: 60,
          height: 22,
          borderRadius: 11,
          backgroundColor: colors.white,
          boxShadow: "0 -12px 30px rgba(26,24,24,0.12)",
        }}
      />
    </div>
  );
};

const WideHero: React.FC<{ palette: Palette }> = ({ palette }) => {
  const frame = useCurrentFrame();
  const enter = reveal(frame, 12);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.ground,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 24,
          height: "100%",
          backgroundColor: palette.accent,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 76,
          left: 70,
          opacity: enter,
          color: colors.ink,
          fontFamily,
          fontWeight: Number(typeWeights.bold),
          fontSize: 23,
          letterSpacing: "0.18em",
        }}
      >
        {palette.lockup}
      </div>
      <div
        style={{
          transform: `translateY(${interpolate(enter, [0, 1], [28, 0])}px)`,
          opacity: enter,
        }}
      >
        <ProductStage accent={palette.productAccent} scale={1.62} y={20} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          bottom: 112,
          width: 430,
          height: 3,
          backgroundColor: palette.accent,
        }}
      />
      <SceneCode id="S01" />
    </AbsoluteFill>
  );
};

const BrandField: React.FC<{ palette: Palette }> = ({ palette }) => {
  const frame = useCurrentFrame();
  const enter = reveal(frame, 8);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.ink,
        justifyContent: "center",
        padding: 70,
        color: palette.ground,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 90,
          width: 18,
          height: `${interpolate(enter, [0, 1], [0, 1920])}px`,
          backgroundColor: palette.accent,
        }}
      />
      <div
        style={{
          opacity: enter,
          transform: `translateX(${interpolate(enter, [0, 1], [-70, 0])}px)`,
          fontFamily,
          textTransform: "uppercase",
        }}
      >
        <div
          style={{
            fontWeight: Number(typeWeights.skinny),
            fontSize: 44,
            letterSpacing: "0.16em",
          }}
        >
          Premier brands
        </div>
        <div
          style={{
            paddingLeft: 82,
            fontWeight: Number(typeWeights.bold),
            fontSize: 106,
            lineHeight: 0.9,
            marginTop: 12,
          }}
        >
          {palette.lockup}
        </div>
      </div>
      <SceneCode id="S02" color={palette.ground} />
    </AbsoluteFill>
  );
};

const PorcelainCrop: React.FC<{ palette: Palette }> = ({ palette }) => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [0, 44], [-400, 1180], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.detailGround,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "230px -340px 420px -260px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ProductStage
          accent={palette.productAccent}
          scale={3.7}
          x={-10}
          y={620}
          motion={0.025}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 268,
          left: 0,
          width: 430,
          height: 22,
          backgroundColor: palette.accent,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 250,
          left: sweep,
          width: 280,
          height: 560,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.52), transparent)",
          transform: "skewX(-12deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 70,
          bottom: 116,
          color: colors.ink,
          fontFamily,
          textTransform: "uppercase",
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 300 }}>Porcelain</div>
        <div
          style={{
            paddingLeft: 72,
            fontSize: 64,
            fontWeight: 700,
          }}
        >
          Profile
        </div>
      </div>
      <SceneCode id="S03" />
    </AbsoluteFill>
  );
};

const BrassJunction: React.FC<{ palette: Palette }> = ({ palette }) => (
  <AbsoluteFill
    style={{
      backgroundColor: palette.ground,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "38%",
        height: "100%",
        backgroundColor: palette.accent,
      }}
    />
    <BrassHardwareGeometry accent={palette.productAccent} />
    <div
      style={{
        position: "absolute",
        left: 56,
        bottom: 120,
        color: palette.ground,
        fontFamily,
        fontWeight: 700,
        fontSize: 28,
        letterSpacing: "0.16em",
        writingMode: "vertical-rl",
        transform: "rotate(180deg)",
      }}
    >
      BRUSHED METAL
    </div>
    <SceneCode id="S04" />
  </AbsoluteFill>
);

const ShelfInsert: React.FC<{ palette: Palette }> = ({ palette }) => {
  const frame = useCurrentFrame();
  const enter = reveal(frame, 8);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.ink,
        padding: 86,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 86,
          backgroundColor: palette.detailGround,
          border: `3px solid ${palette.accent}`,
          overflow: "hidden",
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        <ShelfGeometry accent={palette.productAccent} />
        <div
          style={{
            position: "absolute",
            right: 54,
            bottom: 52,
            color: colors.ink,
            fontFamily,
            textAlign: "right",
            textTransform: "uppercase",
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 300 }}>Craft</div>
          <div style={{ fontSize: 58, fontWeight: 700 }}>Detail</div>
        </div>
      </div>
      <SceneCode id="S05" color={palette.ground} />
    </AbsoluteFill>
  );
};

const TypeCard: React.FC<{ palette: Palette }> = ({ palette }) => {
  const frame = useCurrentFrame();
  const rule = interpolate(frame, [4, 24], [0, 650], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.detailGround,
        justifyContent: "center",
        padding: 74,
      }}
    >
      <WeightStack
        line1="Introducing"
        line2="the"
        brand={"Console\nCollection"}
        fadeIn={[0, 14]}
        color={colors.ink}
        scale={1.35}
      />
      <div
        style={{
          width: rule,
          height: 12,
          marginTop: 54,
          marginLeft: 74,
          backgroundColor: palette.accent,
        }}
      />
      <SceneCode id="S06" />
    </AbsoluteFill>
  );
};

const FaucetDetail: React.FC<{ palette: Palette }> = ({ palette }) => {
  const frame = useCurrentFrame();
  const enter = reveal(frame, 8);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.accent,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 790,
          height: 980,
          backgroundColor: palette.ground,
          borderRadius: 400,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${interpolate(enter, [0, 1], [0.86, 1])})`,
        }}
      >
        <FaucetGeometry accent={palette.productAccent} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 68,
          top: 110,
          color: palette.ground,
          fontFamily,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: "0.14em",
        }}
      >
        FIXTURE CLOSE
      </div>
      <SceneCode id="S07" color={palette.ground} />
    </AbsoluteFill>
  );
};

const FinalLockup: React.FC<{ palette: Palette; variant: Variant }> = ({
  palette,
  variant,
}) => {
  const frame = useCurrentFrame();
  const enter = reveal(frame, 12);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.ground,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 30,
          backgroundColor: palette.accent,
        }}
      />
      <div
        style={{
          transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px)`,
          opacity: enter,
          marginTop: -300,
        }}
      >
        <ProductStage accent={palette.productAccent} scale={1.35} motion={0.02} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          bottom: 108,
          opacity: enter,
          color: colors.ink,
          fontFamily,
          textTransform: "uppercase",
        }}
      >
        <div
          style={{
            fontWeight: 300,
            fontSize: 34,
            letterSpacing: "0.1em",
          }}
        >
          {variant === "builders" ? "Premier brands" : "In-store price"}
        </div>
        <div
          style={{
            paddingLeft: 72,
            fontWeight: 700,
            fontSize: 72,
            lineHeight: 0.92,
            marginTop: 8,
          }}
        >
          {palette.lockup}
        </div>
      </div>
      <SceneCode id="S08" />
    </AbsoluteFill>
  );
};

const ClaudeConsoleAd: React.FC<{ variant: Variant }> = ({ variant }) => {
  const palette = palettes[variant];
  return (
    <AbsoluteFill style={{ backgroundColor: palette.ground }}>
      <Sequence durationInFrames={36} premountFor={30}>
        <WideHero palette={palette} />
      </Sequence>
      <Sequence from={36} durationInFrames={24} premountFor={30}>
        <BrandField palette={palette} />
      </Sequence>
      <Sequence from={60} durationInFrames={45} premountFor={30}>
        <PorcelainCrop palette={palette} />
      </Sequence>
      <Sequence from={105} durationInFrames={45} premountFor={30}>
        <BrassJunction palette={palette} />
      </Sequence>
      <Sequence from={150} durationInFrames={30} premountFor={30}>
        <ShelfInsert palette={palette} />
      </Sequence>
      <Sequence from={180} durationInFrames={45} premountFor={30}>
        <TypeCard palette={palette} />
      </Sequence>
      <Sequence from={225} durationInFrames={30} premountFor={30}>
        <FaucetDetail palette={palette} />
      </Sequence>
      <Sequence from={255} durationInFrames={45} premountFor={30}>
        <FinalLockup palette={palette} variant={variant} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const ClaudeConsoleBuilders: React.FC = () => (
  <ClaudeConsoleAd variant="builders" />
);

export const ClaudeConsolePriceless: React.FC = () => (
  <ClaudeConsoleAd variant="priceless" />
);
