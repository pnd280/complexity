import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/_thread/raw-headings/settings";

function RawHeadingsPluginSettingsUi() {
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
          src="https://cdn.cplx.app/images/IQJbP39.png"
          alt="raw-headings"
          className="x:w-full"
        />
      </div>
    </div>
  );
}

export default function Wrapper() {
  "use no memo";

  registerSettingsUi({
    pluginId: "thread:rawHeadings",
    ui: <RawHeadingsPluginSettingsUi />,
  });
}
