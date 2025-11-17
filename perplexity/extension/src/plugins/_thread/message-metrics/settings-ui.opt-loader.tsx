import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/_thread/message-metrics/settings";

function ThreadShowMessageLengthPluginSettingsUi() {
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

      {settings.enabled && (
        <Switch
          textLabel="Show (estimated) tokens"
          checked={settings.showTokens}
          onCheckedChange={({ checked }) => {
            void update({
              updateFn(prev) {
                prev.showTokens = checked;
              },
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

export default function () {
  registerSettingsUi({
    pluginId: "thread:messageMetrics",
    ui: <ThreadShowMessageLengthPluginSettingsUi />,
  });
}
