import type { PluginId } from "@/__registries__/plugins/meta.types";
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
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "comet:isolatedZoom";

export default function ThreadMessageTtsPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings.plugins["comet:isolatedZoom"].enabled}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["comet:isolatedZoom"].enabled = checked;
          });
        }}
      />

      <div className="x:flex x:flex-col x:gap-4">
        <div className="x:text-muted-foreground">
          <div>Use Ctrl/Cmd + Mouse Wheel or Ctrl/Cmd + 0 to reset zoom.</div>
          <div>
            Or use this slider when you can't zoom on the Assistant window.
          </div>
        </div>
        <div className="x:flex x:flex-col x:gap-2">
          <Slider
            min={0.25}
            max={5}
            step={0.25}
            className="x:flex x:w-full x:flex-col x:gap-4"
            value={[settings.plugins["comet:isolatedZoom"].zoomLevel]}
            onValueChange={({ value }) => {
              mutation.mutate((draft) => {
                draft.plugins["comet:isolatedZoom"].zoomLevel = value[0] ?? 1;
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
