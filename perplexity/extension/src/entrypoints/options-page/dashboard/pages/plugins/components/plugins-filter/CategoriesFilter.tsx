import PluginMeta from "@/data/dashboard/plugin-meta";
import FilterBase from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugins-filter/FilterBase";
import { usePluginFilterSelection } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/useFilterSelection";
import { usePluginFilters } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginFilters";

export default function CategoriesFilter() {
  const { filters } = usePluginFilters();
  const { handleCategorySelect } = usePluginFilterSelection();

  return (
    <FilterBase
      title="Categories"
      items={PluginMeta.categories}
      selectedItems={filters.categories}
      excludedItems={filters.excludeCategories}
      onSelect={handleCategorySelect}
    />
  );
}
