import { indexedDbSchemas } from "@/entrypoints/core-plugins/persistent-query-client/indexed-db";
import { definePluginMeta } from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "persistentQueryClient",
  name: "Persistent Query Client",
  description: "",
});

const manifest = {
  meta,
  indexedDbSchemas,
} satisfies PluginManifestExports;

export default manifest;
