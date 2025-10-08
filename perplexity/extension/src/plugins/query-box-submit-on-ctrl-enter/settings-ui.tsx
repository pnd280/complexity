import type { PluginId } from "@/__registries__/plugins/meta.types";
import { Switch } from "@/components/ui/switch";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "queryBox:submitOnCtrlEnter";

export default function SubmitOnCtrlEnterPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const pluginSettings = settings?.plugins["queryBox:submitOnCtrlEnter"];

  if (!settings) return null;

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["queryBox:submitOnCtrlEnter"].enabled = checked;
          });
        }}
      />

      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          controls
          src="https://cdn.cplx.app/assets/submit-on-ctrl-enter.mp4"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
