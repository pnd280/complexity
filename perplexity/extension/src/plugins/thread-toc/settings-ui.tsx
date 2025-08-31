import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import type { PluginId } from "@/data/plugin-registry/types";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "thread:toc";

export default function ThreadToCPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const pluginSettings = settings?.plugins["thread:toc"];

  if (!settings) return null;

  return (
    <div className="x:flex x:w-full x:flex-col x:gap-4">
      <div className="x:w-full x:text-foreground">
        Note: Right-click on a ToC item to scroll to the bottom of the message.
      </div>
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["thread:toc"].enabled = checked;
          });
        }}
      />

      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/LpC4yZ8.png"
          alt="thread-toc"
          className="x:mx-auto x:w-full x:max-w-lg"
        />
      </div>
    </div>
  );
}
