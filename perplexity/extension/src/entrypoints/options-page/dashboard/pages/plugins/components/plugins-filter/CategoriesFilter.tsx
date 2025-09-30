import { PLUGIN_CATEGORIES } from "@/data/dashboard/plugin-tags";
import FilterBase from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugins-filter/FilterBase";
import { usePluginFilterSelection } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/useFilterSelection";
import { usePluginFilters } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginFilters";

export default function CategoriesFilter() {
  const { filters } = usePluginFilters();
  const { handleCategorySelect } = usePluginFilterSelection();

  return (
    <FilterBase
      title="Categories"
      items={PLUGIN_CATEGORIES}
      selectedItems={filters.categories}
      excludedItems={filters.excludeCategories}
      onSelect={handleCategorySelect}
    />
  );
}
