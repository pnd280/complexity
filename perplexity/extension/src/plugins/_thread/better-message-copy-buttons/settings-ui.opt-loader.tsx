import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/_thread/better-message-copy-buttons/settings";

function BetterThreadMessageCopyButtonsPluginSettingsUi() {
  const { settings, update } = useSettings();

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings.enabled}
        onCheckedChange={({ checked }) => {
          void update({
            updateFn(prev) {
              prev.enabled = checked;
            },
          });
        }}
      />

      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://cdn.cplx.app/images/OqGkEuF.png"
          alt="better-thread-message-copy-buttons"
          className="x:w-full"
        />
      </div>
    </div>
  );
}

export default function () {
  registerSettingsUi({
    pluginId: "thread:betterMessageCopyButtons",
    ui: <BetterThreadMessageCopyButtonsPluginSettingsUi />,
  });
}
