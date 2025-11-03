import type {
  CorePluginId,
  CorePluginManifest,
} from "@/__registries__/core-plugins/types";

export const defineCorePlugin = <
  const T extends CorePluginManifest<CorePluginId>,
>(
  params: T & CorePluginManifest<CorePluginId>,
): T & CorePluginManifest<CorePluginId> => {
  return params;
};
