import {
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "slashCommand",
  name: "Slash Command",
  description: "A plugin for slash commands",
});

const dependencies = definePluginDependencies({
  plugins: ["spaRouter", "networkIntercept"],
});

const manifest = { meta, dependencies } satisfies PluginManifestExports;

export default manifest;
