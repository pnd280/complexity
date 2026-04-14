import { useHotkey } from "@tanstack/react-hotkeys";
import { useTransition } from "react";

import { Input } from "@/components/ui/input";
import { usePluginFilters } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/usePluginFilters";
import { getPlatform } from "@/hooks/usePlatformDetection";
import { useViewport } from "@/hooks/useViewport";
import { keysToString } from "@/utils/misc/utils";
import { parseHotkeyCombo } from "@/utils/wrappers/hotkeys-js";

const SEARCH_HOTKEY = parseHotkeyCombo(
  keysToString([getPlatform() === "mac" ? Key.Meta : Key.Control, "e"]),
);

export default function SearchInput() {
  const { isMobile } = useViewport();
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

  useHotkey(
    SEARCH_HOTKEY,
    (e) => {
      e.preventDefault();
      $("#search-plugins").trigger("focus");
    },
    {
      preventDefault: false,
      stopPropagation: false,
      ignoreInputs: false,
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
