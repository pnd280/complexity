import { PluginManifestsRegistry } from "@/__registries__/plugins";
import type {
  PluginTagValues,
  PluginCategory,
} from "@/data/dashboard/plugin-tags";

type UseFilteredPluginsParams = {
  searchTerm: string;
  selectedTags: PluginTagValues[];
  excludeTags: PluginTagValues[];
  categories: PluginCategory[];
};

export function useFilteredPlugins({
  searchTerm,
  selectedTags,
  excludeTags,
  categories,
}: UseFilteredPluginsParams) {
  const filteredPlugins = useMemo(() => {
    return Object.values(PluginManifestsRegistry.meta)
      .filter((plugin) => {
        const matchesSearch = (plugin.title + plugin.description)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const hasTags =
          plugin.dashboardMeta.tags !== undefined &&
          plugin.dashboardMeta.tags.length > 0;

        const matchesTags =
          selectedTags.length === 0 ||
          (hasTags &&
            selectedTags.every((tag) =>
              plugin.dashboardMeta.tags!.includes(tag),
            ));

        const hasExcludedTags =
          hasTags &&
          excludeTags.some((tag) => plugin.dashboardMeta.tags!.includes(tag));

        const matchesCategories =
          categories.length === 0 ||
          (plugin.dashboardMeta.categories !== undefined &&
            plugin.dashboardMeta.categories.some((category) =>
              categories.includes(category),
            ));

        return (
          matchesSearch && matchesTags && !hasExcludedTags && matchesCategories
        );
      })
      .map((plugin) => plugin.id);
  }, [excludeTags, searchTerm, selectedTags, categories]);

  return filteredPlugins;
}
