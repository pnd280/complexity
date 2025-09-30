import { PLUGIN_CATEGORIES } from "@/data/dashboard/plugin-tags";
import { PluginManifestsRegistry } from "@/data/registries/plugins";
import type { PluginId } from "@/data/registries/plugins/meta.types";

export function usePluginCategories({
  filteredPluginIds,
}: {
  filteredPluginIds: PluginId[];
}) {
  return useMemo(() => {
    const pluginsByCat = Object.keys(PLUGIN_CATEGORIES).reduce<
      Record<string, PluginId[]>
    >((acc, category) => {
      acc[category] = [];
      return acc;
    }, {});

    for (const pluginId of filteredPluginIds) {
      const plugin = PluginManifestsRegistry.meta[pluginId];
      for (const category of plugin.dashboardMeta.categories) {
        pluginsByCat[category] = pluginsByCat[category] || [];
        pluginsByCat[category].push(pluginId);
      }
    }

    for (const category in pluginsByCat) {
      if (!pluginsByCat[category]) continue;

      pluginsByCat[category].sort((a, b) => {
        const titleA = PluginManifestsRegistry.meta[a].title;
        const titleB = PluginManifestsRegistry.meta[b].title;
        const isCoreA = titleA.endsWith(": Core");
        const isCoreB = titleB.endsWith(": Core");

        if (isCoreA && !isCoreB) return -1;
        if (!isCoreA && isCoreB) return 1;
        return 0;
      });
    }

    const filteredPluginsByCat = Object.fromEntries(
      Object.entries(pluginsByCat).filter(([, ids]) => ids.length > 0),
    );

    return {
      pluginsByCat,
      filteredPluginsByCat,
    };
  }, [filteredPluginIds]);
}
