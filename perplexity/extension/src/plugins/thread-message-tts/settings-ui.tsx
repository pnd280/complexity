import { Image } from "@/components/ui/image";
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
import type { PluginId } from "@/data/plugin-registry/types";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "thread:messageTts";

export default function ThreadMessageTtsPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const pluginSettings = settings?.plugins["thread:messageTts"];

  if (!settings) return null;

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <div>Right-click to open voice menu. Only supports English content.</div>
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["thread:messageTts"].enabled = checked;
          });
        }}
      />

      <div className="x:flex x:flex-col x:gap-2">
        <Slider
          min={0.75}
          max={2}
          step={0.05}
          className="x:flex x:w-full x:flex-col x:gap-4"
          value={[pluginSettings?.playbackRate ?? 1]}
          onValueChange={({ value }) => {
            mutation.mutate((draft) => {
              draft.plugins["thread:messageTts"].playbackRate = value[0] ?? 1;
            });
          }}
        >
          <div className="x:flex x:items-center x:justify-between">
            <SliderLabel>Playback Speed</SliderLabel>
            <SliderValueText />
          </div>
          <SliderControl>
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            <SliderThumb index={0} />
          </SliderControl>
        </Slider>
      </div>

      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/1aNm9q0.png"
          alt="thread-message-tts"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
