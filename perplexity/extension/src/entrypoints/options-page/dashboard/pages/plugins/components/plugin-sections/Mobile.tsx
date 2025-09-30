import { Tabs, TabContent, TabsList, TabTrigger } from "@/components/ui/tabs";
import {
  PLUGIN_CATEGORIES,
  type PluginCategory,
} from "@/data/dashboard/plugin-tags";
import NoPluginsFound from "@/entrypoints/options-page/dashboard/pages/plugins/components/NoPluginsFound";
import { PluginsGrid } from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginsGrid";
import { useFilteredPlugins } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/useFilteredPlugins";
import { usePluginCategories } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginCategories";
import { usePluginFilters } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginFilters";

export default function MobilePluginSections() {
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

  const categories = Object.keys(filteredPluginsByCat);

  if (filteredPluginIds.length === 0) {
    return <NoPluginsFound />;
  }

  return (
    <Tabs defaultValue={categories[0]} activationMode="automatic">
      <TabsList className="x:mx-auto x:flex x:w-full x:max-w-fit x:flex-nowrap x:overflow-x-auto x:rounded-lg x:border x:bg-secondary">
        {categories.map((category) => (
          <TabTrigger key={category} asChild value={category}>
            <h2 className="x:whitespace-nowrap">
              {PLUGIN_CATEGORIES[category as PluginCategory]?.label || category}
            </h2>
          </TabTrigger>
        ))}
      </TabsList>
      {Object.entries(filteredPluginsByCat).map(([category, pluginIds]) => (
        <TabContent key={category} value={category} className="x:mt-4">
          <PluginsGrid pluginIds={pluginIds} />
        </TabContent>
      ))}
    </Tabs>
  );
}
