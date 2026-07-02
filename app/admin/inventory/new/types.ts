// Shared types for the Add Item flow. Pure type module — safe to import
// from the form and any of its extracted sub-components.

export type PhotoSource = "real" | "ai-cleaned" | "ai-variant";

export interface TrackedPhoto {
  url: string;
  source: PhotoSource;
}

export type Comparable = {
  source: string;
  title: string;
  price: number;
  url: string;
  image: string;
};

export type Suggestion = {
  title?: string;
  subtitle?: string;
  category?: string;
  manufacturer?: string;
  dimensions?: string;
  estimatedRetail?: number;
};
