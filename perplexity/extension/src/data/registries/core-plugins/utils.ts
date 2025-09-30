import type {
  CorePluginId,
  CorePluginManifest,
} from "@/data/registries/core-plugins/types";

export const defineCorePlugin = <
  const T extends CorePluginManifest<CorePluginId>,
>(
  params: T,
) => {
  return params;
};
