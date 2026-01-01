import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";

import { settingsSchemas, settingsStorage } from "./settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "thread:ttsDownload",
  name: "TTS Download",
  description:
    "Download individual messages or entire conversations as audio files using text-to-speech.",
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui"],
  categories: ["thread"],
  uiRouteSegment: "tts-download",
});

const dependencies = definePluginDependencies({
  plugins: ["domObservers:thread:messageBlocks"],
});

const manifest = {
  meta,
  dependencies,
  dashboardMeta,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
