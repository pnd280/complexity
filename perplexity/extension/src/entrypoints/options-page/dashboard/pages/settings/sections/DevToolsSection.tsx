import { createListCollection } from "@ark-ui/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SettingsItem from "@/entrypoints/options-page/dashboard/pages/settings/SettingsItem";
import SettingsSection from "@/entrypoints/options-page/dashboard/pages/settings/SettingsSection";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export default function DevToolsSection() {
  const { mutation, settings } = useExtensionSettings();

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
          defaultValue={[settings?.devTools?.overrideSubscriptionTier ?? "pro"]}
          positioning={{
            sameWidth: true,
          }}
          onValueChange={({ value }) =>
            mutation.mutate((store) => {
              if (store.devTools == null) {
                store.devTools = {};
              }

              store.devTools.overrideSubscriptionTier = value[0] as any;
            })
          }
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
