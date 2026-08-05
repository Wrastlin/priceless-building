/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
/** Limited-range 4:2:0 — QuickTime/macOS often shows yuvj420p (full-range) as black. */
Config.setPixelFormat("yuv420p");
Config.overrideWebpackConfig(enableTailwind);
