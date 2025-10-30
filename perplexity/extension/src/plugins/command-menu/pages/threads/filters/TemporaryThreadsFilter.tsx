import { createListCollection } from "@ark-ui/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThreadsSearchFilters } from "@/plugins/command-menu/pages/threads/filters/context";

type Item = {
  label: string;
  value: "show" | "hide";
};

const collection = createListCollection<Item>({
  items: [
    {
      label: t("plugin-command-menu.threads.filters.temporaryThreads.show"),
      value: "show" as const,
    },
    {
      label: t("plugin-command-menu.threads.filters.temporaryThreads.hide"),
      value: "hide" as const,
    },
  ],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});

export default function TemporaryThreadsFilter() {
  const { state, actions } = useThreadsSearchFilters();

  return (
    <Select
      collection={collection}
      positioning={{ sameWidth: true }}
      value={
        [state.withTemporaryThreads ? "show" : "hide"] satisfies Item["value"][]
      }
      onValueChange={({ value: values }) => {
        const value = values[0] as Item["value"] | undefined;
        if (value) {
          actions.setWithTemporaryThreads(value === "show" ? true : false);
        }
      }}
    >
      <SelectTrigger
        variant="default"
        className="x:border x:border-border/50 x:bg-background"
      >
        <div className="x:flex x:items-center x:gap-1 x:text-muted-foreground">
          <div className="x:max-w-26 x:truncate">
            {t("plugin-command-menu.threads.filters.temporaryThreads.label")}
          </div>
          <SelectValue
            placeholder={t(
              "plugin-command-menu.threads.filters.temporaryThreads.placeholder",
            )}
          />
        </div>
      </SelectTrigger>
      <SelectContent>
        {collection.items.map((item) => (
          <SelectItem
            key={item.value}
            checkboxOnSingleItem
            item={item.value satisfies Item["value"]}
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
