import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import type { PluginId } from "@/data/plugin-registry/types";
import useExtensionSettings from "@/services/infra/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "thread:betterMessageCopyButtons";

export default function BetterThreadMessageCopyButtonsPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const pluginSettings = settings?.plugins["thread:betterMessageCopyButtons"];

  if (!settings) return null;

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["thread:betterMessageCopyButtons"].enabled = checked;
          });
        }}
      />

      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/OqGkEuF.png"
          alt="better-thread-message-copy-buttons"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
