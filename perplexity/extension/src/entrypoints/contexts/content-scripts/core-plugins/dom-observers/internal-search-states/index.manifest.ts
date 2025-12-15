import { definePluginMeta } from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "domObservers:internalSearchStates",
  name: "Internal Search States DOM Observer",
  description: "",
});

const manifest = {
  meta,
} satisfies PluginManifestExports;

export default manifest;
