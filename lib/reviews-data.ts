/**
 * Curated customer reviews from Google, Facebook, and Yelp. Used by
 * the dedicated /reviews page and by the home-page reviews masonry.
 *
 * Real quotes only. See docs/SOURCE_OF_TRUTH.md §4. Do not add
 * fabricated reviews here. When the Google Places API is wired in
 * (see lib/google-reviews.ts) the live Google list will replace
 * those entries; the curated Facebook + Yelp pulls stay until those
 * platforms have an equivalent live pull.
 */
export interface CuratedReview {
  name: string;
  source: "Google" | "Facebook" | "Yelp";
  stars: 4 | 5;
  body: string;
  date?: string;
  photo?: { src: string; alt: string };
}

export const CURATED_REVIEWS: CuratedReview[] = [
  {
    name: "Pamela M.",
    source: "Google",
    stars: 5,
    body: "Contacted the staff to see if they had a countertop size we were having trouble finding. They searched for our measurements, sent us updates and went above and beyond to help. The best part? We found one in great condition for $25! Crazy good deal with the best customer service around.",
    date: "a year ago",
  },
  {
    name: "Ryan T.",
    source: "Google",
    stars: 5,
    body: "Great people to deal with! Josh installed our granite island and countertops with great detail and craftsmanship. Highly recommend.",
    date: "a year ago",
  },
  {
    name: "Gary G.",
    source: "Google",
    stars: 5,
    body: "My wife and I bought our quartz counter tops from Price-Less Building Center and couldn't be happier! From the expertise in the store to the installation, they were top notch! Thanks guys!",
    date: "a year ago",
  },
  {
    name: "Sarah S.",
    source: "Google",
    stars: 5,
    body: "Kind people here! Go here and dream it up. These people aim to please you. Lots to offer. Thank you.",
    date: "4 months ago",
  },
  {
    name: "Robin B.",
    source: "Google",
    stars: 5,
    body: "Great customer service and very helpful, knowing exactly what is available in inventory. Great products to choose from. I needed a new door. I got a new door and a new bathroom vanity!",
    date: "a year ago",
  },
  {
    name: "Jeff M.",
    source: "Google",
    stars: 4,
    body: "New in the box windows, great price. Exactly as listed.",
    date: "a year ago",
  },
  {
    name: "Damian B.",
    source: "Google",
    stars: 4,
    body: "Go and check out the products. Lots of items.",
    date: "5 months ago",
  },
  {
    name: "Facebook reviewer",
    source: "Facebook",
    stars: 5,
    body: "I just bought 6 doors and will be back for more because the quality and pricing is unmatched. Thanks for the great service Josh and Brian!",
  },
  {
    name: "Facebook reviewer",
    source: "Facebook",
    stars: 5,
    body: "Josh was awesome to work with and was very knowledgeable. The cabinets were exactly as advertised and very well built.",
  },
  {
    name: "Facebook reviewer",
    source: "Facebook",
    stars: 5,
    body: "Quality products and great people to work with. Won't disappoint. Come in and you'll see the selection and expertise.",
  },
  {
    name: "Yelp reviewer",
    source: "Yelp",
    stars: 5,
    body: "Friendly staff, great stock, great prices.",
  },
  {
    name: "Yelp reviewer",
    source: "Yelp",
    stars: 5,
    body: "This place was amazing! Beautiful butcher block countertops, vanities, windows, lights, and so much more. The best part was the people working there, so helpful and friendly and willing to spend the time to get exactly what you want.",
  },
];
