/**
 * Shared brand metadata for the two sister storefronts that share
 * 825 Washington St in Wausau: Price-Less Building Center (warehouse /
 * discount) and Builders Corner Cabinetry & Design (premium / custom).
 *
 * Pulled from public listings (Yelp, Facebook, MapQuest, BBB) during
 * research; hours vary across sources, so we mirror the Facebook page
 * which is the closest thing to an owner-controlled feed.
 */

export const ADDRESS = {
  street: "825 Washington St",
  city: "Wausau",
  state: "WI",
  zip: "54403",
  phone: "(715) 848-3855",
  geo: { lat: 44.958065, lng: -89.617963 },
} as const;

export const PRICELESS = {
  name: "Price-Less Building Center",
  shortName: "Price-Less",
  tagline: "The Home Improvement Warehouse",
  founded: 1978,
  founder: "Don Midlikowski",
  owner: "Josh Nickel",
  ownerSince: 2019,
  description:
    "Discount and surplus building materials in central Wisconsin since 1978. Doors, windows, cabinets, vanities, hardware and trim, all at warehouse prices.",
  // Verified 2026-06-08 from the Google Business profile.
  hours: [
    { day: "Sun", hours: "Closed" },
    { day: "Mon", hours: "8:30 AM – 5:30 PM" },
    { day: "Tue", hours: "8:30 AM – 5:30 PM" },
    { day: "Wed", hours: "8:30 AM – 5:30 PM" },
    { day: "Thu", hours: "8:30 AM – 5:30 PM" },
    { day: "Fri", hours: "8:30 AM – 4:30 PM" },
    { day: "Sat", hours: "8:30 AM – 12:30 PM" },
  ],
  socials: {
    facebook: "https://www.facebook.com/p/Price-Less-Building-Center-100057337665027/",
    instagram: "https://www.instagram.com/pricelessbuildingcenter/",
    yelp: "https://www.yelp.com/biz/price-less-building-center-wausau",
    googleMaps: "https://www.google.com/maps/search/?api=1&query=Price-Less+Building+Center+825+Washington+St+Wausau+WI",
  },
} as const;

export const BUILDERS = {
  name: "Builders Corner Cabinetry & Design",
  shortName: "Builders Corner",
  tagline: "Custom kitchens and baths. Built in Wausau since 1983.",
  description:
    "Custom kitchen and bath cabinets, built in our shop in Wausau since 1983. Come by the showroom at 825 Washington Street and look at real samples.",
  hours: PRICELESS.hours,
  socials: {
    facebook: "https://www.facebook.com/builderscornercabinetry/",
  },
} as const;

export const FOUR_SQUARED = {
  name: "Four Squared Construction",
  shortName: "Four Squared",
  tagline: "Custom installation and home renovations in central Wisconsin.",
  description:
    "Four Squared Construction is the install crew for the 825 Washington Street operation. Kitchens, baths, basements, and whole-house remodels in and around Wausau. Two-year labor warranty. Call (715) 848-3855.",
  hours: PRICELESS.hours,
  socials: {},
} as const;
