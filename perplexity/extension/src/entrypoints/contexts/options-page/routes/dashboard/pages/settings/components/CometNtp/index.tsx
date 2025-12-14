import { Switch } from "@/components/ui/switch";
import { settingsStorage } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/components/CometNtp/settings";
import SettingsItem from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/SettingsItem";
import useSettings from "@/entrypoints/hooks/useSettings";

export default function CometNtp() {
  const { settings: enabled, update } = useSettings(settingsStorage);

  return (
    <SettingsItem
      title="New Tab Page"
      description="Enable Complexity to run on new tab"
    >
      <Switch
        checked={enabled}
        onCheckedChange={(details) => {
          void update({
            updateFn: () => details.checked,
          });
        }}
      />
    </SettingsItem>
  );
}
