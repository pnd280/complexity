import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CategoriesFilter from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugins-filter/CategoriesFilter";
import TagsFilter from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugins-filter/TagsFilter";
import { usePluginFilterSelection } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/useFilterSelection";
import { usePluginFilters } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/usePluginFilters";
import { useIsMobileStore } from "@/hooks/is-mobile-store";

import LuSettings2 from "~icons/lucide/settings-2";
import TablerFilter2X from "~icons/tabler/filter-2-x";
import TablerInfoCircle from "~icons/tabler/info-circle";

export default function PluginsFilter() {
  const { isMobile } = useIsMobileStore();

  const [open, setOpen] = useState(false);
  const { filters } = usePluginFilters();

  const activeFiltersCount = (() => {
    const { tags, excludeTags, categories, excludeCategories } = filters;
    return (
      tags.length +
      excludeTags.length +
      categories.length +
      excludeCategories.length
    );
  })();

  const WrapperComp = isMobile ? Sheet : Popover;
  const TriggerComp = isMobile ? SheetTrigger : PopoverTrigger;
  const ContentComp = isMobile ? SheetContent : PopoverContent;

  const { clear } = usePluginFilterSelection();

  const isPristine =
    filters.tags.length === 0 &&
    filters.excludeTags.length === 0 &&
    filters.categories.length === 0 &&
    filters.excludeCategories.length === 0;

  return (
    <div className="x:flex x:flex-col x:gap-2">
      <WrapperComp open={open} onOpenChange={({ open }) => setOpen(open)}>
        <TriggerComp asChild>
          <Button variant="ghost" className="x:py-2" size="icon">
            <div className="x:relative x:flex x:items-center x:gap-2">
              <LuSettings2 />
              {activeFiltersCount > 0 && (
                <div className="x:absolute x:-top-3 x:-right-3 x:m-0 x:flex x:size-4 x:items-center x:justify-center x:rounded-full x:bg-primary/10 x:p-0 x:text-[10px] x:font-medium x:text-primary">
                  {activeFiltersCount}
                </div>
              )}
            </div>
          </Button>
        </TriggerComp>
        <ContentComp
          side="bottom"
          className="x:flex x:w-[50vw] x:max-w-[550px] x:flex-col x:gap-2"
        >
          <div className="x:flex x:items-center x:justify-between x:gap-10">
            <div className="x:p-1 x:text-muted-foreground">
              <TablerInfoCircle className="x:mr-1 x:inline-block" />
              <span className="x:italic">
                Click once to include, twice to exclude, third time to clear
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              disabled={isPristine}
              className={cn({
                "x:invisible": isPristine,
              })}
              onClick={clear}
            >
              <TablerFilter2X className="x:mr-1 x:inline-block" />
            </Button>
          </div>
          <div className="x:flex x:flex-col x:gap-4">
            <TagsFilter />
            {!isMobile && <CategoriesFilter />}
          </div>
        </ContentComp>
      </WrapperComp>
    </div>
  );
}
