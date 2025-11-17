import FilterBase from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugins-filter/FilterBase";
import { usePluginFilterSelection } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/useFilterSelection";
import { usePluginFilters } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/usePluginFilters";
import PluginDashboardMetaConsts from "@/entrypoints/services/plugins/dashboard-meta";

export default function TagsFilter() {
  const { filters } = usePluginFilters();
  const { handleTagSelect } = usePluginFilterSelection();

  return (
    <FilterBase
      title="Tags"
      items={PluginDashboardMetaConsts.tags}
      selectedItems={filters.tags}
      excludedItems={filters.excludeTags}
      onSelect={handleTagSelect}
    />
  );
}
