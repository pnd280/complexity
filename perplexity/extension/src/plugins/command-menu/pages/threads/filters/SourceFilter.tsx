import { createListCollection } from "@ark-ui/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useThreadsSearchFilters,
  type SourceValue,
} from "@/plugins/command-menu/pages/threads/filters/context";

type SourceItem = {
  label: string;
  value: NonNullable<SourceValue> | "all";
};

const collection = createListCollection<SourceItem>({
  items: [
    {
      label: t("plugin-command-menu.threads.filters.source.all"),
      value: "all",
    },
    { label: "Comet", value: "comet" },
  ],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});

export default function SourceFilter() {
  const { state, actions } = useThreadsSearchFilters();

  return (
    <Select<SourceItem>
      collection={collection}
      positioning={{ sameWidth: true }}
      value={[state.querySourceFilter || "all"] satisfies SourceItem["value"][]}
      onValueChange={({ value: values }) => {
        const value = values[0] as SourceItem["value"] | undefined;
        if (value) {
          actions.setSource(value === "all" ? undefined : value);
        }
      }}
    >
      <SelectTrigger
        variant="default"
        className="x:border x:border-border/50 x:bg-background"
      >
        <div className="x:flex x:items-center x:gap-2 x:text-muted-foreground">
          <div>{t("plugin-command-menu.threads.filters.source.label")}</div>
          <SelectValue
            placeholder={t("plugin-command-menu.threads.filters.source.label")}
          />
        </div>
      </SelectTrigger>
      <SelectContent>
        {collection.items.map((item) => (
          <SelectItem
            key={item.value}
            checkboxOnSingleItem
            item={item.value satisfies SourceItem["value"]}
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
