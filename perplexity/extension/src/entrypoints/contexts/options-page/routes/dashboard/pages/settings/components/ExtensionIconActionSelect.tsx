import { createListCollection } from "@ark-ui/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import useSettings from "@/entrypoints/hooks/useSettings";
import {
  EXTENSION_ICON_ACTIONS as OPTIONS,
  EXTENSION_ICON_ACTIONS_LABEL as OPTIONS_LABEL,
  settingsStorage,
} from "@/entrypoints/services/features/extension-icon-action/settings";

export default function ExtensionIconActionSelect() {
  const { settings: action, update } = useSettings(settingsStorage);

  return (
    <Select
      collection={createListCollection({
        items: OPTIONS,
        itemToString(item) {
          return OPTIONS_LABEL[item as keyof typeof OPTIONS_LABEL];
        },
      })}
      value={[action]}
      onValueChange={({ value }) => {
        void update({
          updateFn() {
            return value[0] as typeof action;
          },
        });
      }}
    >
      <SelectTrigger className="x:px-4 x:py-3">
        {OPTIONS_LABEL[action]}
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((option) => (
          <SelectItem key={option} item={option}>
            {OPTIONS_LABEL[option as keyof typeof OPTIONS_LABEL]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
