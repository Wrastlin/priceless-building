/**
 * Real business photos imported from the storefront's Facebook +
 * Instagram archives. Generated from labels produced by Gemini 3.1
 * Pro Preview via tools/photo-import/label-all.sh.
 *
 * Subjects:
 *   storefront-exterior, warehouse-interior, mural, install-kitchen,
 *   install-bath, install-other, product-shot, team-or-staff,
 *   community-event, holiday-event, sign, aerial, other
 *
 * best_for:
 *   hero, gallery, timeline-event, review-pair, catalog-tile, brand-card
 *
 * Use the helpers below to pull a subset for any section of the site
 * instead of hard-coding paths inline.
 */
export interface BusinessPhoto {
  src: string;
  alt: string;
  subject: string;
  brand: string;
  quality: string;
  best_for: string;
  notes: string;
}

export const BUSINESS_PHOTOS: BusinessPhoto[] = [
  {
    "src": "/real-photos/business/giveaway-prize-tote-bag.webp",
    "alt": "A black tote bag filled with gift certificates and small items, likely a giveaway prize.",
    "subject": "community-event",
    "brand": "community",
    "quality": "good",
    "best_for": "timeline-event",
    "notes": "Shows community involvement via a giveaway."
  },
  {
    "src": "/real-photos/business/price-less-paint-day-flyer.webp",
    "alt": "Flyer for Price-Less Paint Day mural event",
    "subject": "community-event",
    "brand": "community",
    "quality": "good",
    "best_for": "timeline-event",
    "notes": "Flyer for community mural painting event."
  },
  {
    "src": "/real-photos/business/dark-double-vanity-bathroom-install.jpg",
    "alt": "Double vanity with dark cabinets, white top, black fixtures, and two mirrors in a bathroom.",
    "subject": "install-bath",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Good shot of a completed bathroom vanity install. Lighting is a bit harsh from the fixture, but overall quality is good."
  },
  {
    "src": "/real-photos/business/double-sink-bathroom-vanity-black.webp",
    "alt": "Bathroom vanity with double sinks, black cabinets, and black framed mirrors.",
    "subject": "install-bath",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows completed bathroom vanity project."
  },
  {
    "src": "/real-photos/business/kitchen-remodel-before-after.jpg",
    "alt": "Before and after split image of a kitchen cabinet remodel",
    "subject": "install-kitchen",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows clear transformation."
  },
  {
    "src": "/real-photos/business/white-kitchen-marble-island.jpg",
    "alt": "White custom kitchen with marble countertops, large island, and dark tile backsplash",
    "subject": "install-kitchen",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Great showcase of custom cabinetry and countertop work. Good for portfolio gallery."
  },
  {
    "src": "/real-photos/business/rustic-wood-kitchen-island.jpg",
    "alt": "Rustic kitchen with wood cabinets, large island, and stainless appliances.",
    "subject": "install-kitchen",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows custom cabinetry and island design."
  },
  {
    "src": "/real-photos/business/kitchen-island-wood-cabinets-range.jpg",
    "alt": "Kitchen island with wood cabinets, dark countertop, and stainless steel range.",
    "subject": "install-kitchen",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows completed kitchen island installation."
  },
  {
    "src": "/real-photos/business/dark-cabinet-kitchen-install.jpg",
    "alt": "Kitchen with dark cabinets, stainless appliances, and a wood-topped island.",
    "subject": "install-kitchen",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows completed kitchen work."
  },
  {
    "src": "/real-photos/business/wood-cabinets-dark-counters.jpg",
    "alt": "Wood cabinets with dark countertops and stainless sink.",
    "subject": "install-kitchen",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Nighttime lighting with reflections. Good for gallery."
  },
  {
    "src": "/real-photos/business/wood-cabinets-granite-kitchen.jpg",
    "alt": "Wood cabinets with dark counters and tile backsplash",
    "subject": "install-kitchen",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows completed kitchen cabinetry and counters"
  },
  {
    "src": "/real-photos/business/white-kitchen-rustic-island.jpg",
    "alt": "Finished kitchen with white cabinets and rustic wood island.",
    "subject": "install-kitchen",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows completed kitchen design. Good for portfolio."
  },
  {
    "src": "/real-photos/business/white-kitchen-wood-island.jpg",
    "alt": "Finished kitchen with white cabinets and wood island.",
    "subject": "install-kitchen",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows completed cabinetry work."
  },
  {
    "src": "/real-photos/business/kitchen-sink-dark-wood-cabinets.webp",
    "alt": "Kitchen sink area with dark wood cabinets and laminate countertop",
    "subject": "install-kitchen",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows completed kitchen install, good for gallery."
  },
  {
    "src": "/real-photos/business/kitchen-and-bath-remodel-split.jpg",
    "alt": "Split image showing a dark wood kitchen remodel and a bright white bathroom remodel with glass shower",
    "subject": "install-other",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Good for showing range of capabilities, but split images are less ideal for hero spots."
  },
  {
    "src": "/real-photos/business/combined-company-logo.jpg",
    "alt": "Combined company logo graphic",
    "subject": "other",
    "brand": "mixed",
    "quality": "good",
    "best_for": "brand-card",
    "notes": "Logo graphic for brand card."
  },
  {
    "src": "/real-photos/business/newspaper-feature-branded-hat.webp",
    "alt": "Newspaper article about business growth next to branded hat.",
    "subject": "other",
    "brand": "mixed",
    "quality": "good",
    "best_for": "timeline-event",
    "notes": "Press clipping showing company history."
  },
  {
    "src": "/real-photos/business/pendant-light-fixture-warehouse.jpg",
    "alt": "Close-up of a decorative pendant light fixture hanging in the warehouse.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "good",
    "best_for": "catalog-tile",
    "notes": "Shows product detail well, suitable for catalog."
  },
  {
    "src": "/real-photos/business/hanging-light-fixture-textured-shade.jpg",
    "alt": "Close-up of a hanging light fixture with a textured shade in a warehouse setting.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "good",
    "best_for": "catalog-tile",
    "notes": "Clear product shot, suitable for inventory display."
  },
  {
    "src": "/real-photos/business/copper-sink-wood-counter-display.jpg",
    "alt": "Copper vessel sink and dark faucet on wood counter.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "good",
    "best_for": "catalog-tile",
    "notes": "Warehouse product display. Good for catalog."
  },
  {
    "src": "/real-photos/business/white-vanity-copper-sink.jpg",
    "alt": "White bathroom vanity with wood top and copper vessel sink in warehouse",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "good",
    "best_for": "catalog-tile",
    "notes": "Warehouse product display. Good for catalog."
  },
  {
    "src": "/real-photos/business/kohler-floral-sink-basin.jpg",
    "alt": "Close-up of a decorative Kohler bathroom sink basin with floral pattern and chrome faucet.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Clear product shot, suitable for gallery."
  },
  {
    "src": "/real-photos/business/stainless-double-sink-chrome-faucet.jpg",
    "alt": "Stainless steel double sink with chrome faucet in a dark countertop on display in a warehouse setting.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "good",
    "best_for": "catalog-tile",
    "notes": "Clear product shot suitable for catalog."
  },
  {
    "src": "/real-photos/business/dragon-pattern-sink-basin.jpg",
    "alt": "Close-up of an ornate blue and white dragon-patterned bathroom sink basin with matching faucet set in a dark wood vanity top.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "good",
    "best_for": "catalog-tile",
    "notes": "Great detail shot of a unique product, likely surplus or special order. Good for highlighting interesting inventory."
  },
  {
    "src": "/real-photos/business/vanity-top-black-faucet.jpg",
    "alt": "Dark vanity top with white sink and black faucet",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "good",
    "best_for": "catalog-tile",
    "notes": "Warehouse product shot. Good for inventory display."
  },
  {
    "src": "/real-photos/business/pedestal-sink-gold-faucet.jpg",
    "alt": "White pedestal sink with gold faucet hardware on display in warehouse",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "good",
    "best_for": "catalog-tile",
    "notes": "Good product shot for surplus inventory; shows item clearly but background is raw warehouse."
  },
  {
    "src": "/real-photos/business/vanity-sink-black-faucet.jpg",
    "alt": "Bathroom vanity sink with black faucet on dark countertop.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "good",
    "best_for": "catalog-tile",
    "notes": "Product display shot. Good for catalog."
  },
  {
    "src": "/real-photos/business/white-vanity-top-sink.jpg",
    "alt": "White bathroom vanity top with integrated sink.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "good",
    "best_for": "catalog-tile",
    "notes": "Standard product photo in warehouse."
  },
  {
    "src": "/real-photos/business/blue-patterned-bath-sink.jpg",
    "alt": "Decorative blue and white patterned bathroom sink basin in a wooden vanity top",
    "subject": "product-shot",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "catalog-tile",
    "notes": "Close-up of decorative sink. Minor glare. Good for product catalog."
  },
  {
    "src": "/real-photos/business/wood-countertop-edge-detail.jpg",
    "alt": "Close-up of a light wood countertop edge with a gray surface.",
    "subject": "product-shot",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows detail of custom work."
  },
  {
    "src": "/real-photos/business/decorative-bath-vanity-sinks.jpg",
    "alt": "Decorative bath sinks with brass fixtures.",
    "subject": "product-shot",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Showroom vanity display."
  },
  {
    "src": "/real-photos/business/kohler-vessel-sink-gold-faucet.jpg",
    "alt": "White Kohler vessel sink with gold faucet.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "good",
    "best_for": "catalog-tile",
    "notes": "Product display shot, good for catalog."
  },
  {
    "src": "/real-photos/business/dark-wood-cabinets-glass-knobs.jpg",
    "alt": "Close up of dark wood cabinets with glass knobs and silver pulls.",
    "subject": "product-shot",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows cabinet detail well."
  },
  {
    "src": "/real-photos/business/rustic-wood-furniture-display.jpg",
    "alt": "Rustic wooden coat rack and small table in front of a window looking into a warehouse.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows unique surplus/reclaimed items available."
  },
  {
    "src": "/real-photos/business/reclaimed-wood-framed-mirror.jpg",
    "alt": "Reclaimed wood framed mirror with decorative knobs sitting on a wooden counter",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "good",
    "best_for": "catalog-tile",
    "notes": "Good product shot showing rustic decor items available, likely in the Price-Less warehouse."
  },
  {
    "src": "/real-photos/business/builders-corner-logo.jpg",
    "alt": "Builder's Corner Cabinetry logo",
    "subject": "sign",
    "brand": "builders-corner",
    "quality": "good",
    "best_for": "brand-card",
    "notes": "Clear logo image, suitable for brand identification."
  },
  {
    "src": "/real-photos/business/combined-brand-logo.jpg",
    "alt": "Combined company logo graphic",
    "subject": "sign",
    "brand": "mixed",
    "quality": "good",
    "best_for": "brand-card",
    "notes": "Logo graphic for two brands"
  },
  {
    "src": "/real-photos/business/priceless-builders-corner-logo.webp",
    "alt": "Logo featuring a tree made of tools and house silhouettes",
    "subject": "sign",
    "brand": "mixed",
    "quality": "good",
    "best_for": "brand-card",
    "notes": "Clear logo graphic suitable for brand identification."
  },
  {
    "src": "/real-photos/business/staff-member-showroom-display.webp",
    "alt": "Man standing next to flooring and cabinet displays in a showroom.",
    "subject": "team-or-staff",
    "brand": "mixed",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows staff in showroom setting."
  },
  {
    "src": "/real-photos/business/bathroom-vanities-warehouse-display.jpg",
    "alt": "Rows of bathroom vanity cabinets with sinks on display in the warehouse",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows the large selection of in-stock vanities available at Price-Less."
  },
  {
    "src": "/real-photos/business/warehouse-dark-wood-vanities.jpg",
    "alt": "Row of dark wood vanities in warehouse.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows surplus vanity stock."
  },
  {
    "src": "/real-photos/business/dark-base-cabinets-warehouse-row.jpg",
    "alt": "Long row of dark brown or black base cabinets lined up on the warehouse floor",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "good",
    "best_for": "catalog-tile",
    "notes": "Shows surplus/discount cabinet inventory. Good depth of field, clear product shot for warehouse stock."
  },
  {
    "src": "/real-photos/business/dark-wood-vanities-warehouse.jpg",
    "alt": "Row of dark wood vanity cabinets on warehouse floor",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows surplus inventory well."
  },
  {
    "src": "/real-photos/business/white-base-cabinets-warehouse-2.jpg",
    "alt": "Long row of white base cabinets displayed in a warehouse setting.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows inventory layout well."
  },
  {
    "src": "/real-photos/business/grey-cabinets-warehouse.jpg",
    "alt": "Grey cabinets lined up in warehouse.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows surplus stock in warehouse aisle."
  },
  {
    "src": "/real-photos/business/paint-supplies-shelves.jpg",
    "alt": "Wooden shelves stocked with various cans and buckets of paint.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows inventory well."
  },
  {
    "src": "/real-photos/business/oak-double-vanity-warehouse-2.webp",
    "alt": "Long oak bathroom vanity with double sink top on warehouse floor",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows surplus inventory available in warehouse"
  },
  {
    "src": "/real-photos/business/paint-stain-caulk-inventory-shelves.webp",
    "alt": "Metal shelves stocked with paint cans, stains, and caulking tubes.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "good",
    "best_for": "gallery",
    "notes": "Shows paint and caulk inventory. Good for warehouse gallery."
  },
  {
    "src": "/real-photos/business/contest-winners-collage-priceless.webp",
    "alt": "Collage of contest winners holding prizes by store sign.",
    "subject": "community-event",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "timeline-event",
    "notes": "Giveaway winners collage. Best for social."
  },
  {
    "src": "/real-photos/business/dark-double-vanity-install.jpg",
    "alt": "Dark double vanity with white top.",
    "subject": "install-bath",
    "brand": "builders-corner",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Vanity install view."
  },
  {
    "src": "/real-photos/business/wood-cabinet-kitchen-display.jpg",
    "alt": "Wood kitchen cabinet display with stainless appliances.",
    "subject": "install-kitchen",
    "brand": "builders-corner",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Showroom display showing wood cabinets."
  },
  {
    "src": "/real-photos/business/white-shaker-kitchen-cabinets.jpg",
    "alt": "White shaker kitchen cabinets with black hardware and gas stove",
    "subject": "install-kitchen",
    "brand": "builders-corner",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Shows completed cabinets but counter is cluttered."
  },
  {
    "src": "/real-photos/business/exterior-mural-build-your-future.webp",
    "alt": "Exterior building mural with tools and text.",
    "subject": "mural",
    "brand": "community",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Split image showing physical mural and digital art."
  },
  {
    "src": "/real-photos/business/customer-thank-you-note.jpg",
    "alt": "Handwritten thank you note from customers Rosalie and Noah to Josh and Ty for a new kitchen.",
    "subject": "other",
    "brand": "four-squared",
    "quality": "acceptable",
    "best_for": "review-pair",
    "notes": "Good for pairing with a review or testimonial."
  },
  {
    "src": "/real-photos/business/wood-look-exterior-door-glass-insert.jpg",
    "alt": "A wood-look exterior door with decorative glass insert, wrapped in plastic for shipping or storage.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows inventory item in warehouse setting."
  },
  {
    "src": "/real-photos/business/brown-exterior-door-decorative-glass.jpg",
    "alt": "A brown exterior door with decorative glass, wrapped in plastic.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows product in warehouse setting."
  },
  {
    "src": "/real-photos/business/ceiling-fan-warehouse-display.jpg",
    "alt": "Ceiling fan with light fixture hanging in warehouse",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows product in warehouse setting."
  },
  {
    "src": "/real-photos/business/craftsman-door-warehouse.jpg",
    "alt": "Wrapped wooden craftsman door in warehouse.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows surplus door inventory."
  },
  {
    "src": "/real-photos/business/decorative-light-fixture-warehouse.jpg",
    "alt": "A decorative light fixture hanging in a warehouse setting.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows a product available in the warehouse."
  },
  {
    "src": "/real-photos/business/wrapped-wood-glass-door.jpg",
    "alt": "Wrapped wood door with glass panel.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Warehouse inventory shot."
  },
  {
    "src": "/real-photos/business/dark-wood-exterior-door-glass.jpg",
    "alt": "Dark wood exterior door with decorative glass in warehouse.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Warehouse background visible. Good for surplus inventory."
  },
  {
    "src": "/real-photos/business/red-sputnik-chandelier.jpg",
    "alt": "Red sputnik chandelier with price tag.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Product shot in warehouse setting."
  },
  {
    "src": "/real-photos/business/crystal-ceiling-fan-warehouse.jpg",
    "alt": "Ornate ceiling fan with crystal light fixture in warehouse.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows lighting inventory in warehouse setting."
  },
  {
    "src": "/real-photos/business/oak-double-vanity-warehouse.jpg",
    "alt": "Oak double vanity with white top in warehouse.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows surplus vanity inventory on floor."
  },
  {
    "src": "/real-photos/business/dark-wood-vanity-white-top.jpg",
    "alt": "Dark wood bathroom vanity with white top in warehouse setting",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows product in warehouse environment, suitable for catalog."
  },
  {
    "src": "/real-photos/business/dark-wood-vanity-white-top-2.jpg",
    "alt": "Dark wood bathroom vanity with white sink top in warehouse setting",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows product clearly but background is cluttered."
  },
  {
    "src": "/real-photos/business/knotty-pine-6-panel-door.jpg",
    "alt": "Unfinished knotty pine 6-panel interior door in warehouse setting",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Basic product shot, lighting is a bit harsh but shows detail."
  },
  {
    "src": "/real-photos/business/discount-countertop-slabs.jpg",
    "alt": "Vertical countertop slabs with handwritten price tags",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Basic inventory shot showing surplus countertops."
  },
  {
    "src": "/real-photos/business/trough-sink-vanity-display.jpg",
    "alt": "White trough sink on wood vanity in warehouse.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows vanity inventory in warehouse."
  },
  {
    "src": "/real-photos/business/patterned-sink-dark-wood.jpg",
    "alt": "Patterned sink basin in dark wood vanity.",
    "subject": "product-shot",
    "brand": "builders-corner",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Close-up product detail. Some dust visible."
  },
  {
    "src": "/real-photos/business/bathroom-sinks-holiday.jpg",
    "alt": "Two bathroom sinks on display near a Christmas tree.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Warehouse product display with holiday decor."
  },
  {
    "src": "/real-photos/business/surplus-stainless-double-sink.jpg",
    "alt": "Stainless steel double sink with dark countertop on wood cabinets",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Standard inventory shot suitable for product catalog."
  },
  {
    "src": "/real-photos/business/vanity-tops-inventory.jpg",
    "alt": "Bathroom vanity tops with sinks and faucets.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Surplus vanity inventory with plastic wrap."
  },
  {
    "src": "/real-photos/business/marble-vanity-black-legs.jpg",
    "alt": "Marble vanity with black legs in warehouse.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Warehouse setting. Good for product catalog."
  },
  {
    "src": "/real-photos/business/unfinished-wood-cabinet-workshop.jpg",
    "alt": "Unfinished wooden cabinet standing in a workshop setting.",
    "subject": "product-shot",
    "brand": "builders-corner",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Shows custom cabinetry work in progress."
  },
  {
    "src": "/real-photos/business/rustic-wood-bed-frame.jpg",
    "alt": "Rustic wooden bed frame in a workshop.",
    "subject": "product-shot",
    "brand": "builders-corner",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Workshop setting shows custom build process."
  },
  {
    "src": "/real-photos/business/light-wood-cabinet-display.jpg",
    "alt": "Light wood kitchen cabinet display set in warehouse setting",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows surplus/discount cabinet set in warehouse environment."
  },
  {
    "src": "/real-photos/business/rustic-beam-coat-rack.jpg",
    "alt": "Rustic wooden coat rack made from a beam with railroad spike hooks.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Shows unique surplus/upcycled item in warehouse setting."
  },
  {
    "src": "/real-photos/business/white-vanity-black-top.jpg",
    "alt": "White bathroom vanity with black countertop wrapped in plastic",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows product in warehouse setting."
  },
  {
    "src": "/real-photos/business/grey-vanity-white-top.jpg",
    "alt": "Grey bathroom vanity with white sink top wrapped in plastic",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Basic product shot, plastic wrap visible."
  },
  {
    "src": "/real-photos/business/vanity-top-plastic-wrap.jpg",
    "alt": "Bathroom vanity top with sink covered in plastic wrap",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows product condition."
  },
  {
    "src": "/real-photos/business/wood-vanity-white-sink.jpg",
    "alt": "Wood vanity with plastic-wrapped white sink top.",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Surplus inventory product shot."
  },
  {
    "src": "/real-photos/business/door-inventory-collage.webp",
    "alt": "Collage of various interior and exterior doors in warehouse",
    "subject": "product-shot",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Collage format shows variety but is less ideal for clean web design."
  },
  {
    "src": "/real-photos/business/blank-wall-planning.webp",
    "alt": "Two people looking at a blank exterior wall, plus a wider shot of the same wall.",
    "subject": "storefront-exterior",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "timeline-event",
    "notes": "Shows planning phase for mural."
  },
  {
    "src": "/real-photos/business/warehouse-lighting-inventory.jpg",
    "alt": "Hanging chandelier in surplus warehouse.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Shows lighting fixtures and warehouse stock."
  },
  {
    "src": "/real-photos/business/warehouse-countertop-slabs.jpg",
    "alt": "Countertop slabs stored vertically in warehouse.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows surplus countertop inventory."
  },
  {
    "src": "/real-photos/business/white-base-cabinets-warehouse.jpg",
    "alt": "White base cabinets in warehouse.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Shows warehouse inventory."
  },
  {
    "src": "/real-photos/business/countertop-blanks-inventory.jpg",
    "alt": "Vertical stacks of laminate countertop blanks",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Surplus inventory view."
  },
  {
    "src": "/real-photos/business/unfinished-wood-doors-stock.jpg",
    "alt": "Stacks of unfinished wood doors in warehouse.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Shows bulk door inventory for surplus."
  },
  {
    "src": "/real-photos/business/warehouse-unfinished-wood-doors.jpg",
    "alt": "Stacks of unfinished wooden doors in warehouse.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Shows bulk door inventory. Lighting is dim."
  },
  {
    "src": "/real-photos/business/warehouse-paint-shelves.jpg",
    "alt": "Wooden shelves stocked with paint cans and stains next to white sinks.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Shows paint inventory on basic shelving."
  },
  {
    "src": "/real-photos/business/warehouse-cabinet-display.jpg",
    "alt": "Display of light wood kitchen cabinets and a small table in a warehouse setting.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Shows surplus inventory setup."
  },
  {
    "src": "/real-photos/business/light-wood-cabinet-display-2.jpg",
    "alt": "Display of light wood kitchen cabinets and a round black table with chairs in a warehouse setting.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Shows surplus or discount cabinetry setup."
  },
  {
    "src": "/real-photos/business/warehouse-assorted-windows.jpg",
    "alt": "Assorted windows leaning against each other in a warehouse setting.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "gallery",
    "notes": "Shows surplus inventory, good for gallery."
  },
  {
    "src": "/real-photos/business/black-framed-windows-warehouse.jpg",
    "alt": "Stack of black-framed windows in warehouse.",
    "subject": "warehouse-interior",
    "brand": "priceless",
    "quality": "acceptable",
    "best_for": "catalog-tile",
    "notes": "Shows surplus window inventory in warehouse."
  }
];

export function photosBySubject(subject: string): BusinessPhoto[] {
  return BUSINESS_PHOTOS.filter((p) => p.subject === subject);
}

export function photosBy(filter: { subject?: string; best_for?: string; brand?: string }): BusinessPhoto[] {
  return BUSINESS_PHOTOS.filter((p) => {
    if (filter.subject && p.subject !== filter.subject) return false;
    if (filter.best_for && p.best_for !== filter.best_for) return false;
    if (filter.brand && p.brand !== filter.brand) return false;
    return true;
  });
}
