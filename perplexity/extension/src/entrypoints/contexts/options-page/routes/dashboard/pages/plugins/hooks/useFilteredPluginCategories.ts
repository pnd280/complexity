import PluginDashboardMetaConsts from "@/entrypoints/services/plugins/dashboard-meta";
import type {
  PluginId,
  PluginManifestExports,
} from "@/entrypoints/services/plugins/types";
import { getPluginManifest } from "@/entrypoints/services/plugins/utils";

export function useFilteredPluginCategories({
  filteredPluginIds,
}: {
  filteredPluginIds: PluginId[];
}) {
  "use memo";

  const pluginsByCat = Object.keys(PluginDashboardMetaConsts.categories).reduce<
    Record<string, PluginId[]>
  >((acc, category) => {
    acc[category] = [];
    return acc;
  }, {});

  for (const pluginId of filteredPluginIds) {
    const plugin = getPluginManifest(pluginId) as PluginManifestExports;
    for (const category of plugin.dashboardMeta?.categories ?? []) {
      pluginsByCat[category] = pluginsByCat[category] || [];
      pluginsByCat[category].push(pluginId);
    }
  }

  const filteredPluginsByCat = Object.fromEntries(
    Object.entries(pluginsByCat).filter(([, ids]) => ids.length > 0),
  );

  return filteredPluginsByCat;
}
