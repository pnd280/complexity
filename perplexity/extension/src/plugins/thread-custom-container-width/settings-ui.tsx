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
import type { PluginId } from "@/data/registries/plugins/meta.types";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "thread:customThreadContainerWidth";

export default function CustomThreadContainerWidthPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();

  const debouncedMutation = useMemo(
    () =>
      debounce((newValue: number) => {
        mutation.mutate((draft) => {
          draft.plugins["thread:customThreadContainerWidth"].value = newValue;
        });
      }, 300),
    [mutation],
  );

  if (!settings) return null;

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["thread:customThreadContainerWidth"].enabled}
        onCheckedChange={({ checked }) =>
          mutation.mutate((draft) => {
            draft.plugins["thread:customThreadContainerWidth"].enabled =
              checked;
          })
        }
      />
      {settings?.plugins["thread:customThreadContainerWidth"].enabled && (
        <div className="x:flex x:flex-col x:gap-2">
          <Slider
            defaultValue={[
              settings.plugins["thread:customThreadContainerWidth"].value,
            ]}
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
