import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import type { PluginId } from "@/data/registries/plugins/meta.types";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "thread:showMessageLength";

export default function ThreadShowMessageLengthPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const pluginSettings = settings?.plugins["thread:showMessageLength"];

  if (!settings) return null;

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["thread:showMessageLength"].enabled = checked;
          });
        }}
      />

      {settings.plugins["thread:showMessageLength"].enabled && (
        <Switch
          textLabel="Show (estimated) tokens"
          checked={pluginSettings?.showTokens ?? false}
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins["thread:showMessageLength"].showTokens = checked;
            });
          }}
        />
      )}

      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/8a6WMCS.png"
          alt="thread-show-message-length"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
