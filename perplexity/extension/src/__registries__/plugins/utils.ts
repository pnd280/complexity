import type { PluginId } from "@/__registries__/plugins/meta.types";
import type { PluginManifest } from "@/__registries__/plugins/types";

export const definePlugin = <const T extends PluginManifest<PluginId>>(
  params: T,
) => {
  return params;
};
