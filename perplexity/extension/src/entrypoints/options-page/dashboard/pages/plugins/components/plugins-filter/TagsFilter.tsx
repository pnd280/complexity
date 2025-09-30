import { PLUGIN_TAGS } from "@/data/dashboard/plugin-tags";
import FilterBase from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugins-filter/FilterBase";
import { usePluginFilterSelection } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/useFilterSelection";
import { usePluginFilters } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginFilters";

export default function TagsFilter() {
  const { filters } = usePluginFilters();
  const { handleTagSelect } = usePluginFilterSelection();

  return (
    <FilterBase
      title="Tags"
      items={PLUGIN_TAGS}
      selectedItems={filters.tags}
      excludedItems={filters.excludeTags}
      onSelect={handleTagSelect}
    />
  );
}
