/**
 * Google Reviews fetcher.
 *
 * When `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACES_ID` are set in the
 * environment, this pulls the 5 most-relevant reviews from the Google
 * Places Details API for the Price-Less Building Center listing.
 * When they aren't set, we fall back to a curated list of real quotes
 * we captured from public Yelp + Facebook listings during research
 * (so the storefront still shows real customer voice in dev or before
 * Places billing is enabled).
 *
 * Setup (one-time):
 *   1. Google Cloud Console → enable Places API (New)
 *   2. Generate an API key; restrict by HTTP referrer to your domain
 *   3. Find the Place ID: https://developers.google.com/maps/documentation/places/web-service/place-id
 *      (search for "Price-Less Building Center, Wausau, WI" — copy the ID)
 *   4. Add to `.env.local`:
 *        GOOGLE_PLACES_API_KEY=AIza...
 *        GOOGLE_PLACES_ID=ChIJ...
 *   5. Restart the dev server.
 *
 * Pricing: Places Details (with reviews field) is in the "Atmosphere"
 * SKU at $17/1000 calls. We cache the result in-process for 6 hours,
 * so a busy storefront costs roughly $0.05/month. Free $200/mo Google
 * Cloud credit covers this many times over.
 */

export type Review = {
  quote: string;
  source: "Google" | "Facebook" | "Yelp";
  author?: string;
  rating?: number;
  relative?: string;
  url?: string;
};

/**
 * Real Google reviews from the Price-Less Building Center listing
 * (Priceless Building Center / Builder's Corner Cabinetry,
 * 825 Washington St, Wausau, WI — 4.8 stars, 9 displayed reviews
 * as of 2026-06). These are real quotes from real customers, attributed
 * by first name. When Google Places API is wired up the live reviews
 * replace these.
 */
const FALLBACK_REVIEWS: Review[] = [
  {
    quote:
      "Contacted the staff to see if they had a countertop size we were having trouble finding. They searched for our measurements, sent us updates and went above and beyond to help. The best part? We found one in great condition for $25! Crazy good deal with the best customer service around.",
    source: "Google",
    author: "Pamela M.",
    rating: 5,
    relative: "a year ago",
  },
  {
    quote:
      "Great people to deal with! Josh installed our granite island and countertops with great detail and craftsmanship. Highly recommend.",
    source: "Google",
    author: "Ryan T.",
    rating: 5,
    relative: "a year ago",
  },
  {
    quote:
      "My wife and I bought our quartz counter tops from Price-Less Building Center and couldn't be happier! From the expertise in the store to the installation, they were top notch! Thanks guys!",
    source: "Google",
    author: "Gary G.",
    rating: 5,
    relative: "a year ago",
  },
  {
    quote:
      "Kind people here! Go here and dream it up. These people aim to please you. Lots to offer. Thank you.",
    source: "Google",
    author: "Sarah S.",
    rating: 5,
    relative: "4 months ago",
  },
  {
    quote:
      "The best. The building was a bit creepy but the stuff inside it more than made up for it and the customer service was great!",
    source: "Google",
    author: "Brady D.",
    rating: 5,
    relative: "9 months ago",
  },
  {
    quote:
      "Great customer service and very helpful, knowing exactly what is available in inventory. Great products to choose from. I needed a new door. I got a new door and a new bathroom vanity!",
    source: "Google",
    author: "Robin B.",
    rating: 5,
    relative: "a year ago",
  },
  {
    quote: "New in the box windows, great price. Exactly as listed.",
    source: "Google",
    author: "Jeff M.",
    rating: 4,
    relative: "a year ago",
  },
  {
    quote: "Go and check out the products. Lots of items.",
    source: "Google",
    author: "Damian B.",
    rating: 4,
    relative: "5 months ago",
  },
];

export const GOOGLE_RATING = { average: 4.8, count: 9 } as const;

type CacheEntry = { fetched: number; reviews: Review[] };
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
let cache: CacheEntry | null = null;

export async function fetchReviews(): Promise<Review[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACES_ID;
  if (!key || !placeId) return FALLBACK_REVIEWS;

  const now = Date.now();
  if (cache && now - cache.fetched < CACHE_TTL_MS) return cache.reviews;

  try {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/details/json",
    );
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "reviews,rating,user_ratings_total,url");
    url.searchParams.set("reviews_no_translations", "true");
    url.searchParams.set("reviews_sort", "most_relevant");
    url.searchParams.set("key", key);

    const res = await fetch(url, { next: { revalidate: 21600 } });
    if (!res.ok) throw new Error(`Places API HTTP ${res.status}`);
    const data = (await res.json()) as {
      result?: {
        url?: string;
        reviews?: Array<{
          text?: string;
          author_name?: string;
          rating?: number;
          relative_time_description?: string;
        }>;
      };
    };

    const placeUrl = data.result?.url;
    const live = (data.result?.reviews ?? []).map<Review>((r) => ({
      quote: (r.text ?? "").trim(),
      source: "Google" as const,
      author: r.author_name,
      rating: r.rating,
      relative: r.relative_time_description,
      url: placeUrl,
    }));

    const reviews = live.length > 0 ? live : FALLBACK_REVIEWS;
    cache = { fetched: now, reviews };
    return reviews;
  } catch {
    return FALLBACK_REVIEWS;
  }
}
