import { createListCollection } from "@ark-ui/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SettingsItem from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/SettingsItem";
import SettingsSection from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/SettingsSection";
import useSettings from "@/entrypoints/hooks/useSettings";
import {
  settingsStorage,
  type ProductionDevMode,
} from "@/entrypoints/services/features/production-dev-mode/settings";

export default function DevToolsSection() {
  const { settings, update } = useSettings(settingsStorage);

  if (!settings.enabled) return null;

  return (
    <SettingsSection
      title="Dev Tools"
      description="For debugging purposes, use at your own risk"
    >
      <SettingsItem
        title={
          "Over" + "ride " + "pplx " + "subscription " + "tier " + "(local)"
        }
      >
        <Select
          collection={createListCollection({
            items: [
              { label: "Pro", value: "pro" },
              { label: "Max", value: "max" },
            ] as const,
            itemToString: (item) => item.label,
            itemToValue: (item) => item.value,
          })}
          defaultValue={[settings.options.overrideSubscriptionTier ?? "pro"]}
          positioning={{
            sameWidth: true,
          }}
          onValueChange={({ value }) => {
            void update({
              updateFn(prev) {
                prev.options.overrideSubscriptionTier =
                  value[0] as ProductionDevMode["options"]["overrideSubscriptionTier"];
              },
            });
          }}
        >
          <SelectTrigger className="x:p-2 x:px-4">
            <SelectValue placeholder="Select a tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem item="pro">Pro</SelectItem>
            <SelectItem item="max">Max</SelectItem>
          </SelectContent>
        </Select>
      </SettingsItem>
    </SettingsSection>
  );
}
