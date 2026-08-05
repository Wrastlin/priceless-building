export type MotionBrand = "priceless" | "builders" | "foursquared";

export type MotionTemplateId =
  | "PL-sku-micro-v1"
  | "BC-claude-console-v1"
  | "PL-claude-console-twin-v1"
  | "PL-sunrise-archive-v1"
  | "PL-form-fetish-door-v1"
  | "PL-price-micro-v1"
  | "PL-doors-film-v1"
  | "PL-sinks-reel-v1"
  | "PL-lighting-reel-v1"
  | "PL-feed-post-v1"
  | "PL-feed-post-v2"
  | "ROOF-serif-oneroof-v1"
  | "ROOF-serif-doitall-v1"
  | "PL-sku-micro-v2";

/**
 * Serializable item payload consumed by data-driven item advertisements.
 * Every factual value must come from a CatalogItem or an approved derivative.
 */
export type ItemAdProps = {
  title: string;
  subtitle?: string;
  description?: string;
  dimensions?: string;
  price?: string;
  productSrc?: string;
  productCutoutSrc?: string;
  brand: MotionBrand;
  templateId: MotionTemplateId;
};
