import type { ItemAdProps, MotionTemplateId } from "./types";

export type CompositionFamily =
  | "SKU-Micro"
  | "Builders-Twin"
  | "Finish-Sunrise"
  | "Door-Form"
  | "Category-Film"
  | "Category-Reel";

export type CompositionRegistryEntry = {
  id: MotionTemplateId;
  family: CompositionFamily;
  durationInFrames: number;
  sceneCount: number;
};

export const compositionRegistry: readonly CompositionRegistryEntry[] = [
  {
    id: "PL-sku-micro-v1",
    family: "SKU-Micro",
    durationInFrames: 105,
    sceneCount: 3,
  },
  {
    id: "BC-claude-console-v1",
    family: "Builders-Twin",
    durationInFrames: 300,
    sceneCount: 8,
  },
  {
    id: "PL-claude-console-twin-v1",
    family: "Builders-Twin",
    durationInFrames: 300,
    sceneCount: 8,
  },
  {
    id: "PL-sunrise-archive-v1",
    family: "Finish-Sunrise",
    durationInFrames: 300,
    sceneCount: 3,
  },
  {
    id: "PL-form-fetish-door-v1",
    family: "Door-Form",
    durationInFrames: 360,
    sceneCount: 4,
  },
  {
    id: "PL-price-micro-v1",
    family: "SKU-Micro",
    durationInFrames: 180,
    sceneCount: 3,
  },
  {
    id: "PL-doors-film-v1",
    family: "Category-Film",
    durationInFrames: 600,
    sceneCount: 8,
  },
  {
    id: "PL-sinks-reel-v1",
    family: "Category-Reel",
    durationInFrames: 360,
    sceneCount: 8,
  },
  {
    id: "PL-lighting-reel-v1",
    family: "Category-Reel",
    durationInFrames: 318,
    sceneCount: 7,
  },
  {
    id: "PL-feed-post-v1",
    family: "SKU-Micro",
    durationInFrames: 105,
    sceneCount: 1,
  },
  {
    id: "PL-feed-post-v2",
    family: "SKU-Micro",
    durationInFrames: 105,
    sceneCount: 1,
  },
  {
    id: "ROOF-serif-oneroof-v1",
    family: "Category-Film",
    durationInFrames: 480,
    sceneCount: 5,
  },
  {
    id: "ROOF-serif-doitall-v1",
    family: "Category-Film",
    durationInFrames: 480,
    sceneCount: 5,
  },
  {
    id: "PL-sku-micro-v2",
    family: "SKU-Micro",
    durationInFrames: 105,
    sceneCount: 3,
  },
] as const;

export const skuMicroDefaultProps = {
  title: "Kohler Floral Vessel Sink",
  subtitle: "Decorative ceramic vessel",
  description: "",
  dimensions: "",
  price: "",
  productSrc: "products/sample-vessel-sink.svg",
  brand: "priceless",
  templateId: "PL-sku-micro-v1",
} satisfies ItemAdProps;
