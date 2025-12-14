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
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/_thread/message-tts/settings";

function ThreadMessageTtsPluginSettingsUi() {
  const { settings, update } = useSettings();

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <div>Right-click on the play button to open voice menu.</div>
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

      <div className="x:flex x:flex-col x:gap-2">
        <Slider
          min={0.75}
          max={2}
          step={0.05}
          className="x:flex x:w-full x:flex-col x:gap-4"
          value={[settings.playbackRate]}
          onValueChange={({ value }) => {
            void update({
              updateFn(prev) {
                prev.playbackRate = value[0] ?? 1;
              },
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
          src="https://cdn.cplx.app/images/1aNm9q0.png"
          alt="thread-message-tts"
          className="x:w-full"
        />
      </div>
    </div>
  );
}

export default function () {
  registerSettingsUi({
    pluginId: "thread:messageTts",
    ui: <ThreadMessageTtsPluginSettingsUi />,
  });
}
