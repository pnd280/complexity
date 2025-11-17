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
  id: "domObservers:thread:messageBlocks",
  name: "Thread Message Blocks DOM Observer",
  description: "",
});

const dependencies = definePluginDependencies({
  plugins: ["domObservers:thread"],
});

const manifest = {
  meta,
  dependencies,
} satisfies PluginManifestExports;

export default manifest;
