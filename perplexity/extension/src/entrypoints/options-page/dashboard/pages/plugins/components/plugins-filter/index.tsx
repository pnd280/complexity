import { LuInfo, LuSettings2 } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CategoriesFilter from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugins-filter/CategoriesFilter";
import TagsFilter from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugins-filter/TagsFilter";
import { usePluginFilters } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginFilters";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";

export default function PluginsFilter() {
  const { isMobile } = useIsMobileStore();

  const [open, setOpen] = useState(false);
  const { filters } = usePluginFilters();

  const activeFiltersCount = useMemo(() => {
    const { tags, excludeTags, categories, excludeCategories } = filters;
    return (
      tags.length +
      excludeTags.length +
      categories.length +
      excludeCategories.length
    );
  }, [filters]);

  const WrapperComp = isMobile ? Sheet : Popover;
  const TriggerComp = isMobile ? SheetTrigger : PopoverTrigger;
  const ContentComp = isMobile ? SheetContent : PopoverContent;

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
          <div className="x:p-1 x:text-muted-foreground">
            <LuInfo className="x:mr-1 x:inline-block x:size-3.5" />
            <span className="x:italic">
              Click once to include, twice to exclude, third time to clear
            </span>
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
