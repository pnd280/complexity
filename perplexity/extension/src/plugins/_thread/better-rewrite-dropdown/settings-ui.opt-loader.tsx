import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/_thread/better-rewrite-dropdown/settings";

function BetterThreadRewriteDropdownsPluginSettingsUi() {
  const { settings, update } = useSettings();

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <div className="x:text-foreground">
        Makes rewriting messages less painful - with complete control over all
        models and modes.
      </div>
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
          src="https://images2.imgbox.com/c2/60/HHmlJffQ_o.png"
          alt="better-thread-rewrite-dropdowns"
          className="x:w-full"
        />
      </div>
    </div>
  );
}

export default function () {
  registerSettingsUi({
    pluginId: "thread:betterRewriteDropdowns",
    ui: <BetterThreadRewriteDropdownsPluginSettingsUi />,
  });
}
