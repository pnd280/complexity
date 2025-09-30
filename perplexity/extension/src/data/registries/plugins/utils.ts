import type { PluginId } from "@/data/registries/plugins/meta.types";
import type { PluginManifest } from "@/data/registries/plugins/types";

export const definePlugin = <const T extends PluginManifest<PluginId>>(
  params: T,
) => {
  return params;
};
