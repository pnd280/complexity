import type {
  PluginTagKeys,
  PluginCategoryKey,
} from "@/entrypoints/services/plugins/dashboard-meta/types";
import type {
  PluginId,
  PluginManifestExports,
} from "@/entrypoints/services/plugins/types";
import { getPublicPluginManifests } from "@/entrypoints/services/plugins/utils";

type UseFilteredPluginsParams = {
  searchTerm: string;
  selectedTags: PluginTagKeys[];
  excludeTags: PluginTagKeys[];
  categories: PluginCategoryKey[];
};

export function useFilteredPlugins({
  searchTerm,
  selectedTags,
  excludeTags,
  categories,
}: UseFilteredPluginsParams): PluginId[] {
  "use memo";

  return (
    Object.entries(getPublicPluginManifests()) as [
      PluginId,
      PluginManifestExports,
    ][]
  )
    .filter(([pluginId, manifest]) => {
      const matchesSearch = (manifest.meta.name + manifest.meta.description)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const dashboardMeta = manifest.dashboardMeta;

      invariant(
        dashboardMeta,
        `[useFilteredPlugins] Dashboard meta not found for plugin ${pluginId}`,
      );

      const hasTags = dashboardMeta.tags.length > 0;

      const matchesTags =
        selectedTags.length === 0 ||
        (hasTags &&
          selectedTags.every((tag) => dashboardMeta.tags.includes(tag)));

      const hasExcludedTags =
        hasTags && excludeTags.some((tag) => dashboardMeta.tags.includes(tag));

      const matchesCategories =
        categories.length === 0 ||
        dashboardMeta.categories.some((category) =>
          categories.includes(category),
        );

      return (
        matchesSearch && matchesTags && !hasExcludedTags && matchesCategories
      );
    })
    .map(([pluginId]) => pluginId);
}
