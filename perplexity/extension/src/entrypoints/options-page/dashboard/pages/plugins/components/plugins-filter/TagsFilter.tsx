import PluginMeta from "@/data/dashboard/plugin-meta";
import FilterBase from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugins-filter/FilterBase";
import { usePluginFilterSelection } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/useFilterSelection";
import { usePluginFilters } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginFilters";

export default function TagsFilter() {
  const { filters } = usePluginFilters();
  const { handleTagSelect } = usePluginFilterSelection();

  return (
    <FilterBase
      title="Tags"
      items={PluginMeta.tags}
      selectedItems={filters.tags}
      excludedItems={filters.excludeTags}
      onSelect={handleTagSelect}
    />
  );
}
