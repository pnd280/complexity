import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import type { PluginId } from "@/data/registries/plugins/meta.types";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "thread:betterRewriteDropdowns";

export default function BetterThreadRewriteDropdownsPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const pluginSettings = settings?.plugins["thread:betterRewriteDropdowns"];

  if (!settings) return null;

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <div className="x:text-foreground">
        Makes rewriting messages less painful - with complete control over all
        models and modes.
      </div>
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["thread:betterRewriteDropdowns"].enabled = checked;
          });
        }}
      />

      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/raCxpyE.png"
          alt="better-thread-rewrite-dropdowns"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
