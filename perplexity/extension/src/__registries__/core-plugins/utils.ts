import type {
  CorePluginId,
  CorePluginManifest,
} from "@/__registries__/core-plugins/types";

export const defineCorePlugin = <
  const T extends CorePluginManifest<CorePluginId>,
>(
  params: T,
) => {
  return params;
};
