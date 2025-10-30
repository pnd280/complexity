import { PluginManifestsRegistry } from "@/__registries__/plugins";
import type { PluginId } from "@/__registries__/plugins/meta.types";

export function isPluginId(value: string): value is PluginId {
  return Object.keys(PluginManifestsRegistry.meta).includes(value);
}
