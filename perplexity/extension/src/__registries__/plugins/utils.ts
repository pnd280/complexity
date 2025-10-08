import type { PluginId } from "@/__registries__/plugins/meta.types";
import type { PluginManifest } from "@/__registries__/plugins/types";

export const definePlugin = <
  TId extends PluginId,
  const TParams extends PluginManifest<TId>,
>(
  params: TParams & PluginManifest<TId>,
): TParams => {
  return params;
};
