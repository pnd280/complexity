import { useSearchParams } from "react-router-dom";

import type {
  PluginTagKeys,
  PluginCategoryKey,
} from "@/data/dashboard/plugin-meta/types";

export type PluginFilters = {
  tags: PluginTagKeys[];
  excludeTags: PluginTagKeys[];
  categories: PluginCategoryKey[];
  excludeCategories: PluginCategoryKey[];
  searchTerm: string;
};

export function usePluginFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get("searchTerm") || "";
  const tags = (searchParams.get("tags")?.split(",").filter(Boolean) ||
    []) as PluginTagKeys[];
  const excludeTags = (searchParams
    .get("excludeTags")
    ?.split(",")
    .filter(Boolean) || []) as PluginTagKeys[];
  const categories = (searchParams
    .get("categories")
    ?.split(",")
    .filter(Boolean) || []) as PluginCategoryKey[];
  const excludeCategories = (searchParams
    .get("excludeCategories")
    ?.split(",")
    .filter(Boolean) || []) as PluginCategoryKey[];

  const filters: PluginFilters = {
    searchTerm,
    tags,
    excludeTags,
    categories,
    excludeCategories,
  };

  const setFilters = (newFilters: PluginFilters) => {
    if (newFilters.searchTerm) {
      searchParams.set("searchTerm", newFilters.searchTerm);
    } else {
      searchParams.delete("searchTerm");
    }

    if (newFilters.tags.length > 0) {
      searchParams.set("tags", newFilters.tags.join(","));
    } else {
      searchParams.delete("tags");
    }

    if (newFilters.excludeTags.length > 0) {
      searchParams.set("excludeTags", newFilters.excludeTags.join(","));
    } else {
      searchParams.delete("excludeTags");
    }

    if (newFilters.categories.length > 0) {
      searchParams.set("categories", newFilters.categories.join(","));
    } else {
      searchParams.delete("categories");
    }

    if (newFilters.excludeCategories.length > 0) {
      searchParams.set(
        "excludeCategories",
        newFilters.excludeCategories.join(","),
      );
    } else {
      searchParams.delete("excludeCategories");
    }

    setSearchParams(searchParams, {
      replace: true,
    });
  };

  return { filters, setFilters };
}
