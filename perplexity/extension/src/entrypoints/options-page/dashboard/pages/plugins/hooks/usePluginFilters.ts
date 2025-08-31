import { useSearchParams } from "react-router-dom";

import type {
  PluginTagValues,
  PluginCategory,
} from "@/data/plugin-registry/plugin-tags";

export type PluginFilters = {
  tags: PluginTagValues[];
  excludeTags: PluginTagValues[];
  categories: PluginCategory[];
  excludeCategories: PluginCategory[];
  searchTerm: string;
};

export function usePluginFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get("searchTerm") || "";
  const tags = (searchParams.get("tags")?.split(",").filter(Boolean) ||
    []) as PluginTagValues[];
  const excludeTags = (searchParams
    .get("excludeTags")
    ?.split(",")
    .filter(Boolean) || []) as PluginTagValues[];
  const categories = (searchParams
    .get("categories")
    ?.split(",")
    .filter(Boolean) || []) as PluginCategory[];
  const excludeCategories = (searchParams
    .get("excludeCategories")
    ?.split(",")
    .filter(Boolean) || []) as PluginCategory[];

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
