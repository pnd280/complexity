import { useSearchParams } from "react-router-dom";

import { Tabs, TabContent, TabsList, TabTrigger } from "@/components/ui/tabs";
import NoPluginsFound from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/NoPluginsFound";
import { PluginsGrid } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/PluginsGrid";
import { useFilteredPluginCategories } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/useFilteredPluginCategories";
import { useFilteredPlugins } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/useFilteredPlugins";
import { usePluginFilters } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/usePluginFilters";
import PluginDashboardMetaConsts from "@/entrypoints/services/plugins/dashboard-meta";
import { type PluginCategoryKey } from "@/entrypoints/services/plugins/dashboard-meta/types";

export default function MobilePluginSections() {
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

  const categories = Object.keys(filteredPluginsByCat);

  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("plugin-tab") || categories[0];

  if (filteredPluginIds.length === 0) {
    return <NoPluginsFound />;
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(details) => {
        setSearchParams(
          (prev) => {
            prev.set("plugin-tab", details.value);
            return prev;
          },
          { replace: true },
        );
      }}
    >
      <TabsList className="x:mx-auto x:flex x:w-full x:max-w-fit x:flex-nowrap x:overflow-x-auto x:rounded-lg x:border x:bg-secondary">
        {categories.map((category) => {
          const categoryMeta =
            PluginDashboardMetaConsts.categories[category as PluginCategoryKey];

          if (categoryMeta == null) {
            return null;
          }

          return (
            <TabTrigger key={category} asChild value={category}>
              <h2 className="x:whitespace-nowrap">
                {categoryMeta.label || category}
              </h2>
            </TabTrigger>
          );
        })}
      </TabsList>
      {Object.entries(filteredPluginsByCat).map(([category, pluginIds]) => (
        <TabContent key={category} value={category} className="x:mt-4">
          <PluginsGrid pluginIds={pluginIds} />
        </TabContent>
      ))}
    </Tabs>
  );
}
