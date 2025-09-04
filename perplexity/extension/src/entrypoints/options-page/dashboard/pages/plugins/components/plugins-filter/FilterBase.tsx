import Tooltip from "@/components/Tooltip";
import { Command, CommandList, CommandItem } from "@/components/ui/command";
import { cn } from "@/utils/cn";

type FilterState = "include" | "exclude" | "none";

type FilterBaseProps<T extends string> = {
  title: string;
  items: Record<string, { label: string; description: string }>;
  selectedItems: T[];
  excludedItems: T[];
  onSelect: (item: T) => void;
  getItemState?: (item: T) => FilterState;
};

export default function FilterBase<T extends string>({
  title,
  items,
  selectedItems,
  excludedItems,
  onSelect,
  getItemState,
}: FilterBaseProps<T>) {
  const getState =
    getItemState ||
    ((item: T): FilterState => {
      if (selectedItems.includes(item)) return "include";
      if (excludedItems.includes(item)) return "exclude";
      return "none";
    });

  return (
    <div className="x:flex x:flex-col x:gap-2">
      <div className="x:flex x:items-center x:gap-2 x:px-2">
        <div className="x:text-lg x:font-medium">{title}</div>
        <div className="x:h-px x:w-full x:bg-border"></div>
      </div>
      <Command>
        <CommandList className="x:rounded-xl x:p-0 x:shadow-lg x:[&_[cmdk-list-sizer]]:flex x:[&_[cmdk-list-sizer]]:flex-row x:[&_[cmdk-list-sizer]]:flex-wrap">
          {Object.entries(items).map(([key, { label, description }]) => {
            const itemState = getState(key as T);
            return (
              <Tooltip key={key} content={description}>
                <CommandItem
                  className={cn({
                    "x:m-1 x:w-max x:cursor-pointer x:rounded-md x:border x:border-transparent x:px-2 x:py-0.5 x:text-sm x:transition-colors x:hover:bg-primary/10 x:aria-selected:bg-secondary x:aria-selected:text-foreground": true,
                    "x:border x:border-success/50 x:bg-success/20! x:text-success!":
                      itemState === "include",
                    "x:border x:border-dashed x:border-destructive x:bg-destructive/20! x:text-muted-foreground!":
                      itemState === "exclude",
                    "x:bg-secondary": itemState === "none",
                  })}
                  onSelect={() => onSelect(key as T)}
                >
                  <span className="x:flex x:items-center x:gap-1">{label}</span>
                </CommandItem>
              </Tooltip>
            );
          })}
        </CommandList>
      </Command>
    </div>
  );
}
