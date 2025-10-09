import { PLUGIN_TAGS } from "@/data/dashboard/plugin-tags";
import FilterBase from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugins-filter/FilterBase";
import { usePluginFilterSelection } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/useFilterSelection";
import { usePluginFilters } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginFilters";
import { isCometBrowserSync } from "@/entrypoints/options-page/utils/is-comet";

export default function TagsFilter() {
  const { filters } = usePluginFilters();
  const { handleTagSelect } = usePluginFilterSelection();

  const filteredTags = useMemo(() => {
    if (isCometBrowserSync()) return PLUGIN_TAGS;

    const { cometAssistant: _, cometAssistantOnly: __, ...rest } = PLUGIN_TAGS;
    return rest;
  }, []);

  return (
    <FilterBase
      title="Tags"
      items={filteredTags}
      selectedItems={filters.tags}
      excludedItems={filters.excludeTags}
      onSelect={handleTagSelect}
    />
  );
}
