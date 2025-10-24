import debounce from "lodash/debounce";

import type { PluginId } from "@/__registries__/plugins/meta.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "home:customSlogan";

export default function CustomHomeSloganPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();

  const debouncedMutate = debounce((newValue: string) => {
    mutation.mutate((draft) => {
      draft.plugins["home:customSlogan"].slogan = newValue;
    });
  }, 300);

  if (!settings) return null;

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["home:customSlogan"].enabled}
        onCheckedChange={({ checked }) =>
          mutation.mutate((draft) => {
            draft.plugins["home:customSlogan"].enabled = checked;
          })
        }
      />
      <div className="x:flex x:flex-col x:gap-2">
        <Label className="x:text-muted-foreground">Slogan</Label>
        <Input
          defaultValue={settings?.plugins["home:customSlogan"].slogan}
          onChange={({ target: { value } }) => debouncedMutate(value)}
        />
      </div>
    </div>
  );
}
