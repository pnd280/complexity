import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import useSettings from "@/entrypoints/hooks/useSettings";
import { settingsStorage } from "@/entrypoints/services/features/production-dev-mode/settings";
import { useSettings as usePluginSettings } from "@/plugins/language-model-selector/settings";

import TablerCheck from "~icons/tabler/check";

function LanguageModelSelectorPluginSettingsUi() {
  const { settings, update } = usePluginSettings();
  const { settings: prodDevMode } = useSettings(settingsStorage);

  return (
    <div className="x:flex x:flex-col x:gap-4 x:overflow-y-auto">
      <div>
        <div className="x:flex x:items-center x:gap-2">
          <TablerCheck className="x:text-primary" /> Take complete control of
          all available language models.
        </div>
        <div className="x:flex x:items-center x:gap-2">
          <TablerCheck className="x:text-primary" /> No ambiguity, no confusion,
          change your preferred one anywhere.
        </div>
        <div className="x:flex x:items-center x:gap-2">
          <TablerCheck className="x:text-primary" /> Supports keyboard
          navigation.
        </div>
      </div>
      <Switch
        textLabel="Enable"
        checked={settings.enabled}
        onCheckedChange={({ checked }) => {
          void update({
            updateFn(prev) {
              prev.enabled = checked;
            },
          });
        }}
      />
      {settings.enabled && (
        <div className="x:flex x:flex-col x:gap-4">
          {prodDevMode.enabled && (
            <Switch
              textLabel="Spoof timezone"
              checked={settings.spoofTimezone}
              onCheckedChange={({ checked }) => {
                void update({
                  updateFn(prev) {
                    prev.spoofTimezone = checked;
                  },
                });
              }}
            />
          )}
        </div>
      )}
      <div className="x:mx-auto x:w-full x:max-w-175">
        <Image
          src="https://images2.imgbox.com/07/e4/p9QJLuax_o.png"
          alt="language-model-selector"
          className="x:w-full"
        />
      </div>
    </div>
  );
}

export default function Wrapper() {
  "use no memo";

  registerSettingsUi({
    pluginId: "queryBox:languageModelSelector",
    ui: <LanguageModelSelectorPluginSettingsUi />,
  });
}
