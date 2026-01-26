import FilterBase from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugins-filter/FilterBase";
import { usePluginFilterSelection } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/useFilterSelection";
import { usePluginFilters } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/usePluginFilters";
import PluginDashboardMetaConsts from "@/entrypoints/services/plugins/dashboard-meta";

export default function CategoriesFilter() {
  const { filters } = usePluginFilters();
  const { handleCategorySelect } = usePluginFilterSelection();

  return (
    <FilterBase
      title="Categories"
      items={PluginDashboardMetaConsts.categories}
      selectedItems={filters.categories}
      excludedItems={filters.excludeCategories}
      onSelect={handleCategorySelect}
    />
  );
}
