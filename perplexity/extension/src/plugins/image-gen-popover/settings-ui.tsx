import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import type { PluginId } from "@/data/plugin-registry/types";
import useExtensionSettings from "@/services/infra/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "imageGenModelSelector";

export default function ImageGenModelSelectorPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();

  if (!settings) return null;

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <P>
        Allow you to change your preferred image generation model. The selector
        can be found on the image generation popover in any thread.
      </P>
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["imageGenModelSelector"].enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["imageGenModelSelector"].enabled = checked;
          });
        }}
      />
      <img
        src="https://i.imgur.com/qf6cb9i.png"
        alt="image-gen-model-selector"
        className="x:mx-auto x:w-full x:max-w-[700px]"
      />
    </div>
  );
}
