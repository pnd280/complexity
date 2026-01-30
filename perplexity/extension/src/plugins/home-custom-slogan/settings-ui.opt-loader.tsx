import debounce from "lodash/debounce";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/home-custom-slogan/settings";

function CustomHomeSloganPluginSettingsUi() {
  const { settings, update } = useSettings();

  const debouncedMutate = debounce((newValue: string) => {
    void update({
      updateFn(prev) {
        prev.slogan = newValue;
      },
    });
  }, 300);

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings.enabled}
        onCheckedChange={({ checked }) =>
          void update({
            updateFn(prev) {
              prev.enabled = checked;
            },
          })
        }
      />
      <div className="x:flex x:flex-col x:gap-2">
        <Label className="x:text-muted-foreground">Slogan</Label>
        <Input onChange={(e) => debouncedMutate(e.target.value)} />
      </div>
    </div>
  );
}

export default function Wrapper() {
  "use no memo";

  registerSettingsUi({
    pluginId: "home:customSlogan",
    ui: <CustomHomeSloganPluginSettingsUi />,
  });
}
