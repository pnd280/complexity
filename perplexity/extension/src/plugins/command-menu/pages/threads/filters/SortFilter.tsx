import { createListCollection } from "@ark-ui/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThreadsSearchFilters } from "@/plugins/command-menu/pages/threads/filters/context";

type SortItem = {
  label: string;
  itemLabel: string;
  value: "newest" | "oldest";
};

const collection = createListCollection<SortItem>({
  items: [
    {
      label: t("plugin-command-menu.threads.filters.sort.newest"),
      itemLabel: t("plugin-command-menu.threads.filters.sort.newestFirst"),
      value: "newest",
    },
    {
      label: t("plugin-command-menu.threads.filters.sort.oldest"),
      itemLabel: t("plugin-command-menu.threads.filters.sort.oldestFirst"),
      value: "oldest",
    },
  ],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});

export default function SortFilter() {
  const { state, actions } = useThreadsSearchFilters();

  return (
    <Select<SortItem>
      collection={collection}
      value={
        [state.ascending ? "oldest" : "newest"] satisfies SortItem["value"][]
      }
      onValueChange={({ value: values }) => {
        const value = values[0] as SortItem["value"] | undefined;
        if (value) {
          actions.setSort(value === "oldest");
        }
      }}
    >
      <SelectTrigger
        variant="default"
        className="x:border x:border-border/50 x:bg-background"
      >
        <div className="x:flex x:items-center x:gap-1 x:text-muted-foreground">
          <div>{t("plugin-command-menu.threads.filters.sort.label")}</div>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {collection.items.map((item) => (
          <SelectItem
            key={item.value}
            checkboxOnSingleItem
            item={item.value satisfies SortItem["value"]}
          >
            {t(`plugin-command-menu.threads.filters.sort.${item.value}First`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
