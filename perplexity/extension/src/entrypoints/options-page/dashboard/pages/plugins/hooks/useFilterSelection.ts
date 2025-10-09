import type {
  PluginCategoryKey,
  PluginTagKeys,
} from "@/data/dashboard/plugin-meta/types";
import { usePluginFilters } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginFilters";

type FilterSelectionOptions<T extends string> = {
  selected: T[];
  excluded: T[];
  updateSelected: (newSelected: T[]) => void;
  updateExcluded: (newExcluded: T[]) => void;
};

export function useFilterSelection<T extends string>(
  options: FilterSelectionOptions<T>,
) {
  const { selected, excluded, updateSelected, updateExcluded } = options;

  const handleSelect = (item: T) => {
    if (!selected.includes(item) && !excluded.includes(item)) {
      // First click: Include
      updateSelected([...selected, item]);
    } else if (selected.includes(item)) {
      // Second click: Exclude
      updateSelected(selected.filter((i) => i !== item));
      updateExcluded([...excluded, item]);
    } else {
      // Third click: Reset
      updateExcluded(excluded.filter((i) => i !== item));
    }
  };

  return { handleSelect };
}

export function usePluginFilterSelection() {
  const { filters, setFilters } = usePluginFilters();

  const handleTagSelect = (tag: PluginTagKeys) => {
    const { tags, excludeTags } = filters;

    if (!tags.includes(tag) && !excludeTags.includes(tag)) {
      setFilters({
        ...filters,
        tags: [...tags, tag],
      });
    } else if (tags.includes(tag)) {
      setFilters({
        ...filters,
        tags: tags.filter((t) => t !== tag),
        excludeTags: [...excludeTags, tag],
      });
    } else {
      setFilters({
        ...filters,
        excludeTags: excludeTags.filter((t) => t !== tag),
      });
    }
  };

  const handleCategorySelect = (category: PluginCategoryKey) => {
    const { categories, excludeCategories } = filters;

    if (
      !categories.includes(category) &&
      !excludeCategories.includes(category)
    ) {
      setFilters({
        ...filters,
        categories: [...categories, category],
      });
    } else if (categories.includes(category)) {
      setFilters({
        ...filters,
        categories: categories.filter((c) => c !== category),
        excludeCategories: [...excludeCategories, category],
      });
    } else {
      setFilters({
        ...filters,
        excludeCategories: excludeCategories.filter((c) => c !== category),
      });
    }
  };

  return {
    handleTagSelect,
    handleCategorySelect,
  };
}
