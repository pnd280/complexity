import { Switch } from "@/components/ui/switch";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/image-gen-model-selector/settings";

function ImageGenModelSelectorPluginSettingsUi() {
  const { settings, update } = useSettings();

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
      <img
        src="https://cdn.cplx.app/images/img-gen-model-selector.png"
        alt="image-gen-model-selector"
        className="x:mx-auto x:w-full x:max-w-175"
      />
    </div>
  );
}

export default function () {
  registerSettingsUi({
    pluginId: "imageGenModelSelector",
    ui: <ImageGenModelSelectorPluginSettingsUi />,
  });
}
