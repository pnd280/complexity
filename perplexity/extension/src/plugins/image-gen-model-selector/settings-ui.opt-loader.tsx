import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/image-gen-model-selector/settings";

function ImageGenModelSelectorPluginSettingsUi() {
  const { settings, update } = useSettings();

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <P>
        Allow you to change your preferred image generation model. The selector
        can be found on the image generation popover in any thread.
      </P>
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
        src="https://cdn.cplx.app/images/qf6cb9i.png"
        alt="image-gen-model-selector"
        className="x:mx-auto x:w-full x:max-w-[700px]"
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
