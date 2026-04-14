import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/_thread/toc/settings";

function ThreadToCPluginSettingsUi() {
  const { settings, update } = useSettings();

  return (
    <div className="x:flex x:w-full x:flex-col x:gap-4">
      <div className="x:w-full x:text-foreground">
        Note: Right-click on a ToC item to scroll to the bottom of the message.
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
          src="https://cdn.cplx.app/images/LpC4yZ8.png"
          alt="thread-toc"
          className="x:mx-auto x:w-full x:max-w-lg"
        />
      </div>
    </div>
  );
}

export default function Wrapper() {
  "use no memo";

  registerSettingsUi({
    pluginId: "thread:toc",
    ui: <ThreadToCPluginSettingsUi />,
  });
}
