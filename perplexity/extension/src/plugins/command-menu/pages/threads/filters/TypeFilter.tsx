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
  type TypeValue,
} from "@/plugins/command-menu/pages/threads/filters/context";

type TypeItems = {
  label: string;
  value: NonNullable<TypeValue> | "all";
};

const collection = createListCollection<TypeItems>({
  items: [
    { label: t("plugin-command-menu.threads.filters.type.all"), value: "all" },
    { label: "Research", value: "research" },
    { label: "Labs", value: "labs" },
  ],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});

export default function TypeFilter() {
  const { state, actions } = useThreadsSearchFilters();

  return (
    <Select
      collection={collection}
      positioning={{ sameWidth: true }}
      value={[state.threadTypeFilter || "all"] satisfies TypeItems["value"][]}
      onValueChange={({ value: values }) => {
        const value = values[0] as TypeItems["value"] | undefined;
        if (value) {
          actions.setType(value === "all" ? undefined : value);
        }
      }}
    >
      <SelectTrigger
        variant="default"
        className="x:min-w-30 x:border x:border-border/50 x:bg-background"
      >
        <div className="x:flex x:items-center x:gap-1 x:text-muted-foreground">
          <div>{t("plugin-command-menu.threads.filters.type.label")}</div>
          <SelectValue
            placeholder={t(
              "plugin-command-menu.threads.filters.type.placeholder",
            )}
          />
        </div>
      </SelectTrigger>
      <SelectContent>
        {collection.items.map((item) => (
          <SelectItem
            key={item.value}
            checkboxOnSingleItem
            item={item.value satisfies TypeItems["value"]}
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
