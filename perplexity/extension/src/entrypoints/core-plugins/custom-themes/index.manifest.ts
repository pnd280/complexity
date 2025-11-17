import { indexedDbSchemas } from "@/entrypoints/core-plugins/custom-themes/indexed-db";
import {
  settingsSchemas,
  settingsStorage,
} from "@/entrypoints/core-plugins/custom-themes/settings";
import { definePluginMeta } from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "customTheme",
  name: "Custom Theme",
  description: "",
});

const manifest = {
  meta,
  indexedDbSchemas,
  settingsSchemas,
  settingsStorage,
} satisfies PluginManifestExports;

export default manifest;
