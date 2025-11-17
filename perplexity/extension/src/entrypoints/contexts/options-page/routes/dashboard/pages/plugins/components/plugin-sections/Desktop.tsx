import { H2 } from "@/components/ui/typography";
import NoPluginsFound from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/NoPluginsFound";
import { PluginsGrid } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/PluginsGrid";
import { useFilteredPluginCategories } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/useFilteredPluginCategories";
import { useFilteredPlugins } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/useFilteredPlugins";
import { usePluginFilters } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/usePluginFilters";
import PluginDashboardMetaConsts from "@/entrypoints/services/plugins/dashboard-meta";
import { type PluginCategoryKey } from "@/entrypoints/services/plugins/dashboard-meta/types";

export default function DesktopPluginSections() {
  const { filters } = usePluginFilters();

  const filteredPluginIds = useFilteredPlugins({
    searchTerm: filters.searchTerm,
    selectedTags: filters.tags,
    excludeTags: filters.excludeTags,
    categories: filters.categories,
  });

  const filteredPluginsByCat = useFilteredPluginCategories({
    filteredPluginIds,
  });

  if (filteredPluginIds.length === 0) {
    return <NoPluginsFound />;
  }

  return (
    <div className="x:flex x:flex-col x:gap-8">
      {Object.entries(filteredPluginsByCat).map(([category, pluginIds]) => {
        const categoryMeta =
          PluginDashboardMetaConsts.categories[category as PluginCategoryKey];

        if (categoryMeta == null) {
          return null;
        }

        return (
          <section key={category}>
            <H2 className="x:text-lg! x:font-semibold">
              {categoryMeta.label || category}
            </H2>
            {!!categoryMeta.description && (
              <div className="x:mb-4 x:text-sm x:text-muted-foreground">
                {categoryMeta.description}
              </div>
            )}
            <PluginsGrid pluginIds={pluginIds} />
          </section>
        );
      })}
    </div>
  );
}
