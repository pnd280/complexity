import type { PluginId } from "@/__registries__/plugins/meta.types";
import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

import TablerCheck from "~icons/tabler/check";

export const pluginId: PluginId = "queryBox:languageModelSelector";

export default function LanguageModelSelectorPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();

  if (!settings) return null;

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
        checked={
          settings.plugins["queryBox:languageModelSelector"].enabled ?? false
        }
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["queryBox:languageModelSelector"].enabled = checked;
          });
        }}
      />
      {settings.plugins["queryBox:languageModelSelector"].enabled && (
        <div className="x:flex x:flex-col x:gap-2">
          {settings.devMode && (
            <Switch
              textLabel="Change timezone"
              checked={
                settings.plugins["queryBox:languageModelSelector"]
                  .changeTimezone ?? false
              }
              onCheckedChange={({ checked }) => {
                mutation.mutate((draft) => {
                  draft.plugins[
                    "queryBox:languageModelSelector"
                  ].changeTimezone = checked;
                });
              }}
            />
          )}
        </div>
      )}
      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://images2.imgbox.com/07/e4/p9QJLuax_o.png"
          alt="language-model-selector"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
