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

import RightClickIcon from "~icons/hugeicons/mouse-right-click-06";

function ThreadMessageTtsPluginSettingsUi() {
  const { settings, update } = useSettings();
  const [isEditingSpeed, setIsEditingSpeed] = useState(false);
  const [tempSpeed, setTempSpeed] = useState(settings.playbackRate.toString());

  return (
    <div className="x:flex x:flex-col x:gap-4">
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
          min={0.05}
          max={2}
          step={0.05}
          className="x:my-4 x:flex x:max-w-lg x:flex-col x:gap-4"
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
            {isEditingSpeed ? (
              <input
                autoFocus
                type="number"
                min={0.05}
                max={2}
                step={0.05}
                value={tempSpeed}
                className="x:w-16 x:rounded x:border x:border-border x:bg-background x:px-2 x:py-1 x:text-sm x:text-foreground"
                onChange={(e) => {
                  setTempSpeed(e.target.value);
                }}
                onBlur={() => {
                  const numValue = parseFloat(tempSpeed);
                  if (!isNaN(numValue) && numValue >= 0.05 && numValue <= 2) {
                    void update({
                      updateFn(prev) {
                        prev.playbackRate = numValue;
                      },
                    });
                  } else {
                    setTempSpeed(settings.playbackRate.toString());
                  }
                  setIsEditingSpeed(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  } else if (e.key === "Escape") {
                    setTempSpeed(settings.playbackRate.toString());
                    setIsEditingSpeed(false);
                  }
                }}
              />
            ) : (
              <SliderValueText
                className="x:cursor-pointer x:transition-colors x:hover:text-foreground"
                onClick={() => {
                  setIsEditingSpeed(true);
                  setTempSpeed(settings.playbackRate.toString());
                }}
              />
            )}
          </div>
          <SliderControl>
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            <SliderThumb index={0} />
          </SliderControl>
        </Slider>
      </div>

      <div className="x:mx-auto x:w-full x:max-w-175">
        <Image
          src="https://cdn.cplx.app/images/1aNm9q0.png"
          alt="thread-message-tts"
          className="x:w-full"
        />
      </div>
      <div className="x:text-sm x:text-foreground">
        <span className="x:font-bold x:text-foreground">NOTE:</span>{" "}
        <RightClickIcon className="x:inline-block x:size-4" /> Right-click on
        the play button to open voice menu.
      </div>
    </div>
  );
}

export default function Wrapper() {
  "use no memo";

  registerSettingsUi({
    pluginId: "thread:messageTts",
    ui: <ThreadMessageTtsPluginSettingsUi />,
  });
}
