import { H2 } from "@/components/ui/typography";
import {
  PLUGIN_CATEGORIES,
  type PluginCategory,
} from "@/data/plugin-registry/plugin-tags";
import NoPluginsFound from "@/entrypoints/options-page/dashboard/pages/plugins/components/NoPluginsFound";
import { PluginsGrid } from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginsGrid";
import { useFilteredPlugins } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/useFilteredPlugins";
import { usePluginCategories } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginCategories";
import { usePluginFilters } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginFilters";

export default function DesktopPluginSections() {
  const { filters } = usePluginFilters();

  const filteredPluginIds = useFilteredPlugins({
    searchTerm: filters.searchTerm,
    selectedTags: filters.tags,
    excludeTags: filters.excludeTags,
    categories: filters.categories,
  });

  const { filteredPluginsByCat } = usePluginCategories({
    filteredPluginIds,
  });

  if (filteredPluginIds.length === 0) {
    return <NoPluginsFound />;
  }

  return (
    <div className="x:flex x:flex-col x:gap-8">
      {Object.entries(filteredPluginsByCat).map(([category, pluginIds]) => (
        <section key={category}>
          <H2 className="x:!text-lg x:font-semibold">
            {PLUGIN_CATEGORIES[category as PluginCategory]?.label || category}
          </H2>
          {!!PLUGIN_CATEGORIES[category as PluginCategory]?.description && (
            <div className="x:mb-4 x:text-sm x:text-muted-foreground">
              {PLUGIN_CATEGORIES[category as PluginCategory].description}
            </div>
          )}
          <PluginsGrid pluginIds={pluginIds} />
        </section>
      ))}
    </div>
  );
}
