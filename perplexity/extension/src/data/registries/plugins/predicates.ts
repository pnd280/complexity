import { PluginManifestsRegistry } from "@/data/registries/plugins";
import type { PluginId } from "@/data/registries/plugins/meta.types";

export function isPluginId(value: string): value is PluginId {
  return Object.keys(PluginManifestsRegistry.meta).includes(value);
}

export function isPrivatePluginId(value: string): value is PluginId {
  return (
    isPluginId(value) &&
    PluginManifestsRegistry.meta[value].dashboardMeta == null
  );
}
