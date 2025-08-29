import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import type { PluginId } from "@/data/plugin-registry/types";
import useExtensionSettings from "@/services/infra/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "queryBox:spacesThreadsForceWritingMode";

export default function SpacesThreadsForceWritingModePluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const pluginSettings =
    settings?.plugins["queryBox:spacesThreadsForceWritingMode"];

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["queryBox:spacesThreadsForceWritingMode"].enabled =
              checked;
          });
        }}
      />

      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/Fgbejst.png"
          alt="raw-headings"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
