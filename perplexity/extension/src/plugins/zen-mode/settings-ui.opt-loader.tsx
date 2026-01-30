import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import { Switch } from "@/components/ui/switch";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/zen-mode/settings";

function ZenModePluginSettingsUi() {
  const { settings, update } = useSettings();

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys: settings.hotkey,
    onSave: (keys) => {
      void update({
        updateFn(prev) {
          prev.hotkey = keys;
        },
      });
    },
  });

  return (
    <div className="x:flex x:flex-col x:gap-4">
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
        <>
          <div className="x:hidden x:flex-col x:gap-2 x:md:flex">
            <div>Activation hotkey:</div>
            <HotkeyRecorderUi />
          </div>
          <Switch
            textLabel="Persistent across reloads (remember the last state)"
            checked={settings.persistent}
            onCheckedChange={({ checked }) => {
              void update({
                updateFn(prev) {
                  prev.persistent = checked;
                },
              });
            }}
          />
          <Switch
            textLabel='Always hide "Related" questions section'
            checked={settings.alwaysHideRelatedQuestions}
            onCheckedChange={({ checked }) => {
              void update({
                updateFn(prev) {
                  prev.alwaysHideRelatedQuestions = checked;
                },
              });
            }}
          />
        </>
      )}
    </div>
  );
}

export default function Wrapper() {
  "use no memo";

  registerSettingsUi({
    pluginId: "zenMode",
    ui: <ZenModePluginSettingsUi />,
  });
}
