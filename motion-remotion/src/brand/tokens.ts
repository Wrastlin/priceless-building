/** Shared brand tokens for all motion ads. */
export const colors = {
  ink: "#1a1818",
  rust: "#d04727",
  cream: "#f7f5f1",
  soft: "#57534f",
  brass: "#b08d57",
  parchment: "#f3eee6",
  porcelain: "#f8f6f3",
  sage: "#e8ebe4",
  white: "#ffffff",
} as const;

export const fps = 30;

/** Softened Kohler weight-stack — locked for every ad. */
export const typeWeights = {
  skinny: "300",
  bold: "700",
} as const;

export type BrandId = "priceless" | "builders" | "foursquared";

export const brandKit: Record<
  BrandId,
  { name: string; ground: string; accent: string; lockup: string }
> = {
  priceless: {
    name: "Price-Less",
    ground: colors.cream,
    accent: colors.rust,
    lockup: "PRICE-LESS",
  },
  builders: {
    name: "Builders Corner",
    ground: colors.parchment,
    accent: colors.brass,
    lockup: "BUILDERS CORNER",
  },
  foursquared: {
    name: "4 Squared",
    ground: colors.sage,
    accent: colors.ink,
    lockup: "4 SQUARED",
  },
};
