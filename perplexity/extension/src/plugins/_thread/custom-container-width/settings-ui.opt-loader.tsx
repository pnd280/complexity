import debounce from "lodash/debounce";

import {
  Slider,
  SliderContext,
  SliderControl,
  SliderLabel,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/_thread/custom-container-width/settings";

function CustomThreadContainerWidthPluginSettingsUi() {
  const { settings, update } = useSettings();

  const debouncedMutation = debounce((newValue: number) => {
    void update({
      updateFn(prev) {
        prev.value = newValue;
      },
    });
  }, 300);

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings.enabled}
        onCheckedChange={({ checked }) =>
          void update({
            updateFn(prev) {
              prev.enabled = checked;
            },
          })
        }
      />
      {settings.enabled && (
        <div className="x:flex x:flex-col x:gap-2">
          <Slider
            defaultValue={[settings.value]}
            className="x:md:min-w-[500px]"
            min={740}
            max={9999}
            onValueChange={({ value }) => debouncedMutation(value[0] ?? 0)}
          >
            <SliderContext>
              {({ value }) => (
                <SliderLabel className="x:mb-4 x:block x:text-muted-foreground">
                  Desired Max-Width:{" "}
                  <span className="x:text-primary">{value}px</span>
                </SliderLabel>
              )}
            </SliderContext>
            <SliderControl>
              <SliderTrack>
                <SliderRange />
                <SliderThumb index={0} />
              </SliderTrack>
            </SliderControl>
          </Slider>
        </div>
      )}
    </div>
  );
}

export default function Wrapper() {
  "use no memo";

  registerSettingsUi({
    pluginId: "thread:customThreadContainerWidth",
    ui: <CustomThreadContainerWidthPluginSettingsUi />,
  });
}
