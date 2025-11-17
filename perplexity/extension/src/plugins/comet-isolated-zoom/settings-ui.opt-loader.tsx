import {
  Slider,
  SliderControl,
  SliderLabel,
  SliderRange,
  SliderThumb,
  SliderTrack,
  SliderValueText,
} from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/comet-isolated-zoom/settings";

function CometIsolatedZoomPluginSettingsUi() {
  const { settings, update } = useSettings();

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings.enabled}
        onCheckedChange={({ checked }) => {
          void update({
            updateFn: (draft) => {
              draft.enabled = checked;
            },
          });
        }}
      />

      <div className="x:flex x:flex-col x:gap-4">
        <div className="x:text-muted-foreground">
          <div>Use Ctrl/Cmd + Mouse Wheel or Ctrl/Cmd + 0 to reset zoom.</div>
          <div>
            Or use this slider when you can&apos;t zoom on the Assistant window.
          </div>
        </div>
        <div className="x:flex x:flex-col x:gap-2">
          <Slider
            min={0.25}
            max={5}
            step={0.25}
            className="x:flex x:w-full x:flex-col x:gap-4"
            value={[settings.zoomLevel]}
            onValueChange={({ value }) => {
              void update({
                updateFn: (draft) => {
                  draft.zoomLevel = value[0] ?? 1;
                },
              });
            }}
          >
            <div className="x:flex x:items-center x:justify-between">
              <SliderLabel>Zoom Level</SliderLabel>
              <SliderValueText />
            </div>
            <SliderControl>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>
              <SliderThumb index={0} />
            </SliderControl>
          </Slider>
          <div className="x:text-right x:text-sm x:text-muted-foreground">
            After changing the zoom level, you need to reload the Assistant
            window (Ctrl/Cmd + R).
          </div>
        </div>
      </div>
    </div>
  );
}

export default function () {
  registerSettingsUi({
    pluginId: "comet:isolatedZoom",
    ui: <CometIsolatedZoomPluginSettingsUi />,
  });
}
