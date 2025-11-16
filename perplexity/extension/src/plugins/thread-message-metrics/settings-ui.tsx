import type { PluginId } from "@/__registries__/plugins/meta.types";
import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "thread:messageMetrics";

export default function ThreadShowMessageLengthPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings.plugins["thread:messageMetrics"].enabled}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["thread:messageMetrics"].enabled = checked;
          });
        }}
      />

      {settings.plugins["thread:messageMetrics"].enabled && (
        <Switch
          textLabel="Show (estimated) tokens"
          checked={settings.plugins["thread:messageMetrics"].showTokens}
          onCheckedChange={({ checked }) => {
            mutation.mutate((draft) => {
              draft.plugins["thread:messageMetrics"].showTokens = checked;
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
