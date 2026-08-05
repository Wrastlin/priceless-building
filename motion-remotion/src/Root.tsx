import React from "react";
import { Composition, Folder } from "remotion";
import {
  compositionRegistry,
  skuMicroDefaultProps,
} from "./compositionRegistry";
import {
  ClaudeConsoleBuilders,
  ClaudeConsolePriceless,
} from "./scenes/ClaudeConsole";
import { SkuMicroAd } from "./scenes/SkuMicroAd";
import {
  FormFetishDoor,
  PriceMicro,
  SunriseArchive,
} from "./scenes/SunriseArchive";
import { CategoryReel } from "./scenes/CategoryReel";
import { DoorsFilm } from "./scenes/DoorsFilm";
import { FeedPost } from "./scenes/FeedPost";
import { FeedPostV2 } from "./scenes/FeedPostV2";
import { OneRoofSerif } from "./scenes/OneRoofSerif";
import { BCSerifSpot, BC_SPOT_BEATS, BC_SPOT_DURATION } from "./scenes/BCSerifSpot";
import { BCUnit, UNIT_01, bcUnitDuration } from "./scenes/BCUnit";
import { AmbientPush } from "./scenes/AmbientPush";
import { SkuMicroV2 } from "./scenes/SkuMicroV2";
import { OneRoofBrand } from "./scenes/OneRoofBrand";
import {
  OneRoofSilentV3,
  SILENT_V3_DURATION,
} from "./scenes/OneRoofSilentV3";
import {
  OneRoofOneStopV4,
  ONE_STOP_V4_DURATION,
} from "./scenes/OneRoofOneStopV4";
import {
  OneRoofStoryMg,
  STORY_MG_DURATION,
} from "./scenes/OneRoofStoryMg";
import {
  TextPresetSwatch,
  TEXT_PRESET_DURATION,
} from "./scenes/TextPresetSwatch";

const W = 1080;
const H = 1920;
const FPS = 30;

const durationFor = (id: string) => {
  const entry = compositionRegistry.find((composition) => composition.id === id);
  if (!entry) {
    throw new Error(`Composition ${id} is missing from compositionRegistry`);
  }
  return entry.durationInFrames;
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="One-Roof">
        <Composition
          id="ROOF-one-stop-v4"
          component={OneRoofOneStopV4}
          durationInFrames={ONE_STOP_V4_DURATION}
          fps={FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="ROOF-silent-v3"
          component={OneRoofSilentV3}
          durationInFrames={SILENT_V3_DURATION}
          fps={FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="ROOF-story-mg-v2"
          component={OneRoofStoryMg}
          durationInFrames={STORY_MG_DURATION}
          fps={FPS}
          width={1080}
          height={1920}
        />
        <Composition
          id="ROOF-story-mg-v2-16x9"
          component={OneRoofStoryMg}
          durationInFrames={STORY_MG_DURATION}
          fps={FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="ROOF-brand-30-v1"
          component={OneRoofBrand}
          durationInFrames={900}
          fps={FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="ROOF-brand-30-v1-9x16"
          component={OneRoofBrand}
          durationInFrames={900}
          fps={FPS}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="One-Roof-Serif">
        <Composition
          id="PL-just-in-v1"
          component={OneRoofSerif}
          durationInFrames={400}
          fps={FPS}
          width={W}
          height={H}
          defaultProps={{
            beats: [
              { photo: "placements/tall-white-pantry-cabinet-cb-gen-0009-kitchen.png", intro: "This week at Price-Less", name: "Just In", tag: "REAL FLOOR FINDS · WAUSAU", anchor: "center" as const, frames: 75 },
              { photo: "placements/green-marble-vanity-top-vt-gen-0010-bath.png", name: "Vanity Tops", anchor: "low" as const, frames: 60 },
              { photo: "placements/wood-wall-cabinet-double-cb-gen-0003-room.png", name: "Cabinets", anchor: "low" as const, frames: 60 },
              { photo: "placements/white-square-vessel-sink-sk-gen-0004-room.png", name: "Sinks", anchor: "low" as const, frames: 60 },
              { photo: "placements/butcherblock-category.jpg", name: "Butcher Block", descriptor: "From $16", anchor: "low" as const, frames: 60 },
              { photo: "placements/five-light-chandelier-brushed-nickel-lt-gen-0001-room.png", intro: "62 real arrivals", name: "Price-Less", tag: "WAUSAU · SINCE 1978", anchor: "center" as const, frames: 85 },
            ],
          }}
        />
        <Composition
          id="AMB-push-dooraisle"
          component={AmbientPush}
          durationInFrames={300}
          fps={60}
          width={W}
          height={H}
          defaultProps={{
            photo: "one-roof/v3-a/floor-door-aisle-light-and-dark.jpg",
            zoomTo: 1.16,
          }}
        />
        <Composition
          id="BC-unit-01"
          component={BCUnit}
          durationInFrames={bcUnitDuration(UNIT_01)}
          fps={FPS}
          width={W}
          height={H}
          defaultProps={UNIT_01}
        />
        <Composition
          id="BC-serif-spot-v1"
          component={BCSerifSpot}
          durationInFrames={BC_SPOT_DURATION}
          fps={FPS}
          width={W}
          height={H}
          defaultProps={{ beats: BC_SPOT_BEATS }}
        />
        <Composition
          id="ROOF-serif-oneroof-v1"
          component={OneRoofSerif}
          durationInFrames={durationFor("ROOF-serif-oneroof-v1")}
          fps={FPS}
          width={W}
          height={H}
          defaultProps={{
            beats: [
              {
                photo: "one-roof/v3-install/kitchen-wood-island-black-pendants.jpg",
                intro: "In downtown Wausau",
                name: "One Roof",
                descriptor: "Remodel · Supply · Install",
                anchor: "center" as const,
                frames: 80,
              },
              {
                photo: "one-roof/v3-install/kitchen-white-bright-after.jpg",
                intro: "Craftsmanship by",
                name: "4 Squared",
                descriptor: "Premier remodeling",
                anchor: "low" as const,
                frames: 90,
              },
              {
                photo: "one-roof/v3-install/kitchen-dark-shaker-marble-island.jpg",
                intro: "Premium brands at",
                name: "Builders Corner",
                descriptor: "Quality brands you trust",
                anchor: "low" as const,
                frames: 90,
              },
              {
                photo: "one-roof/v3-a/floor-door-aisle-light-and-dark.jpg",
                intro: "Thousands of finds at",
                name: "Price-Less",
                descriptor: "Discount building supplies",
                anchor: "low" as const,
                frames: 90,
              },
              {
                photo: "one-roof/v3-install/kitchen-white-island-shiplap.jpg",
                intro: "All under",
                name: "One Roof",
                tag: "825 Washington St · Wausau",
                tag2: "pricelessbuilding.com",
                anchor: "center" as const,
                frames: 130,
              },
            ],
          }}
        />
        <Composition
          id="ROOF-serif-doitall-v1"
          component={OneRoofSerif}
          durationInFrames={durationFor("ROOF-serif-doitall-v1")}
          fps={FPS}
          width={W}
          height={H}
          defaultProps={{
            beats: [
              {
                photo: "one-roof/v3-install/kitchen-oak-mosaic-backsplash.jpg",
                intro: "For your home",
                name: "We do\nit all",
                anchor: "center" as const,
                frames: 80,
              },
              {
                photo: "one-roof/v3-a/warehouse-lighting-inventory.jpg",
                intro: "Shop",
                name: "Price-Less",
                descriptor: "Doors · Sinks · Lighting · More",
                anchor: "low" as const,
                frames: 90,
              },
              {
                photo: "one-roof/v3-install/white-kitchen-marble-island.jpg",
                intro: "Trust",
                name: "Builders Corner",
                descriptor: "Premier brands",
                anchor: "low" as const,
                frames: 90,
              },
              {
                photo: "one-roof/v3-install/pergola-string-lights-night.jpg",
                intro: "Built by",
                name: "4 Squared",
                descriptor: "Premier install crew",
                anchor: "low" as const,
                frames: 90,
              },
              {
                photo: "one-roof/v3-install/dark-double-vanity-bathroom-install.jpg",
                intro: "Everything your home needs",
                name: "One Roof",
                tag: "825 Washington St · Wausau",
                tag2: "pricelessbuilding.com",
                anchor: "center" as const,
                frames: 130,
              },
            ],
          }}
        />
      </Folder>

      <Folder name="Category-Films">
        <Composition
          id="PL-doors-film-v1"
          component={DoorsFilm}
          durationInFrames={durationFor("PL-doors-film-v1")}
          fps={FPS}
          width={W}
          height={H}
        />
        <Composition
          id="PL-sinks-reel-v1"
          component={CategoryReel}
          durationInFrames={durationFor("PL-sinks-reel-v1")}
          fps={FPS}
          width={W}
          height={H}
          defaultProps={{
            hookBold: "SINKS",
            hookSkinny: "Statement pieces · Wausau",
            items: [
              {
                src: "products/trim/blue-patterned-bath-sink-gemini-cutout-trim.png",
                label: "Hand-patterned",
              },
              {
                src: "products/trim/floor-white-vessel-sink-black-table-gemini-cutout-trim.png",
                label: "Modern vessel",
              },
              {
                src: "products/trim/copper-sink-wood-counter-display-gemini-cutout-trim.png",
                label: "Hammered copper",
              },
              {
                src: "products/trim/kohler-floral-sink-basin-gemini-cutout-trim.png",
                label: "Chrome widespread",
              },
              {
                src: "products/trim/patterned-sink-dark-wood-gemini-cutout-trim.png",
                label: "Crystal texture",
              },
              {
                src: "products/trim/pedestal-sink-gold-faucet-gemini-cutout-trim.png",
                label: "Brushed gold",
              },
            ],
          }}
        />
        <Composition
          id="PL-lighting-reel-v1"
          component={CategoryReel}
          durationInFrames={durationFor("PL-lighting-reel-v1")}
          fps={FPS}
          width={W}
          height={H}
          defaultProps={{
            hookBold: "LIGHT\nIT UP",
            hookSkinny: "Chandeliers · Pendants · Wausau",
            items: [
              {
                src: "products/trim/floor-globe-crystal-chandelier-gemini-cutout-trim.png",
                label: "Banded crystal",
              },
              {
                src: "products/trim/intake-crystal-candelabra-chandelier-gemini-cutout-trim.png",
                label: "Polished chrome",
              },
              {
                src: "products/trim/crystal-ceiling-fan-warehouse-cutout-trim.png",
                label: "French Empire",
              },
              {
                src: "products/trim/red-sputnik-chandelier-gemini-cutout-trim.png",
                label: "Mid-century",
              },
              {
                src: "products/trim/pendant-light-fixture-warehouse-gemini-cutout-trim.png",
                label: "Ring openwork",
              },
            ],
          }}
        />
      </Folder>

      <Folder name="SKU-Micro">
        <Composition
          id="PL-feed-post-v1"
          component={FeedPost}
          durationInFrames={durationFor("PL-feed-post-v1")}
          fps={FPS}
          width={1080}
          height={1350}
          defaultProps={{
            title: "Blue Paisley Artist Basin",
            label: "Hand-patterned · Wausau",
            src: "products/trim/blue-patterned-bath-sink-gemini-cutout-trim.png",
            styleIndex: 0,
          }}
        />
        <Composition
          id="PL-sku-micro-v2"
          component={SkuMicroV2}
          durationInFrames={durationFor("PL-sku-micro-v2")}
          fps={FPS}
          width={W}
          height={H}
          defaultProps={{
            name: "Paisley",
            descriptor: "Artist basin",
            cutout: "products/trim/blue-patterned-bath-sink-gemini-cutout-trim.png",
          }}
        />
        <Composition
          id="PL-feed-post-v2"
          component={FeedPostV2}
          durationInFrames={durationFor("PL-feed-post-v2")}
          fps={FPS}
          width={1080}
          height={1350}
          defaultProps={{
            intro: "Introducing",
            name: "Paisley",
            descriptor: "Artist basin",
            tag: "Price-Less · Wausau",
            src: "placements/paisley-bath-placement.png",
            anchor: "center",
          }}
        />
        <Composition
          id="PL-sku-micro-v1"
          component={SkuMicroAd}
          durationInFrames={durationFor("PL-sku-micro-v1")}
          fps={FPS}
          width={W}
          height={H}
          defaultProps={skuMicroDefaultProps}
        />
        <Composition
          id="PL-price-micro-v1"
          component={PriceMicro}
          durationInFrames={durationFor("PL-price-micro-v1")}
          fps={FPS}
          width={W}
          height={H}
        />
      </Folder>

      <Folder name="Builders-Twin">
        <Composition
          id="BC-claude-console-v1"
          component={ClaudeConsoleBuilders}
          durationInFrames={durationFor("BC-claude-console-v1")}
          fps={FPS}
          width={W}
          height={H}
        />
        <Composition
          id="PL-claude-console-twin-v1"
          component={ClaudeConsolePriceless}
          durationInFrames={durationFor("PL-claude-console-twin-v1")}
          fps={FPS}
          width={W}
          height={H}
        />
      </Folder>

      <Folder name="Finish-Sunrise">
        <Composition
          id="PL-sunrise-archive-v1"
          component={SunriseArchive}
          durationInFrames={durationFor("PL-sunrise-archive-v1")}
          fps={FPS}
          width={W}
          height={H}
          defaultProps={{
            finishName: "Sunrise",
            fieldColor: "#d4a84b",
            inkOnField: "#3a2a0a",
          }}
        />
      </Folder>

      <Folder name="Door-Form">
        <Composition
          id="PL-form-fetish-door-v1"
          component={FormFetishDoor}
          durationInFrames={durationFor("PL-form-fetish-door-v1")}
          fps={FPS}
          width={W}
          height={H}
        />
      </Folder>

      <Folder name="Text-Presets">
        <Composition
          id="PL-text-preset"
          component={TextPresetSwatch}
          durationInFrames={TEXT_PRESET_DURATION}
          fps={FPS}
          width={W}
          height={H}
          defaultProps={{
            preset: "A" as const,
            src: "placements/globe-placement.png",
          }}
        />
      </Folder>
    </>
  );
};
