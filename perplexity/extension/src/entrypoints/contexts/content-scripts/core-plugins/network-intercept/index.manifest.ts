import { definePluginMeta } from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "networkIntercept",
  name: "Network Intercept",
  description: "Intercept network requests and responses",
});

const manifest = { meta } satisfies PluginManifestExports;

export default manifest;
