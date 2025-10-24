import { useTransition } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Input } from "@/components/ui/input";
import { usePluginFilters } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginFilters";
import { useIsMobileStore } from "@/hooks/is-mobile-store";
import { getPlatform } from "@/hooks/usePlatformDetection";
import { keysToString } from "@/utils/misc/utils";

export default function SearchInput() {
  const { isMobile } = useIsMobileStore();
  const { filters, setFilters } = usePluginFilters();
  const [, startTransition] = useTransition();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setFilters({
        ...filters,
        searchTerm: e.target.value,
      });
    });
  };

  useHotkeys(
    keysToString([getPlatform() === "mac" ? Key.Meta : Key.Control, "e"]),
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      $("#search-plugins").trigger("focus");
    },
    {
      preventDefault: true,
    },
  );

  return (
    <Input
      id="search-plugins"
      type="search"
      placeholder={`Search plugins... ${
        !isMobile
          ? `(${keysToString([
              getPlatform() === "mac" ? Key.Meta : Key.Control,
              "e",
            ])})`
          : ""
      }`}
      value={filters.searchTerm}
      onChange={handleSearchChange}
    />
  );
}
