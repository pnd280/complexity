import type { PluginId } from "@/__registries__/plugins/meta.types";
import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "thread:exportThread";

export default function ExportThreadPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings.plugins["thread:exportThread"].enabled}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["thread:exportThread"].enabled = checked;
          });
        }}
      />

      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/Enn83Eg.png"
          alt="export-thread"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
