import { useTransition } from "react";

import { Input } from "@/components/ui/input";
import { usePluginFilters } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginFilters";
import { useIsMobileStore } from "@/hooks/is-mobile-store";
import { getPlatform } from "@/hooks/usePlatformDetection";
import { keysToString } from "@/utils/misc/utils";
import hotkeys from "@/utils/wrappers/hotkeys-js";

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

  const handleFocusSearch = useEffectEvent((e: KeyboardEvent) => {
    e.preventDefault();
    $("#search-plugins").trigger("focus");
  });

  useEffect(() => {
    const keyCombo = keysToString([
      getPlatform() === "mac" ? Key.Meta : Key.Control,
      "e",
    ]);

    hotkeys(keyCombo, handleFocusSearch);

    return () => {
      hotkeys.unbind(keyCombo, handleFocusSearch);
    };
  }, []);

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
