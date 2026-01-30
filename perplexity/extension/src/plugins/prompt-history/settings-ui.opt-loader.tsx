import { createListCollection } from "@ark-ui/react";

import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import { Image } from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { SlashCommandMenuTabShortcut } from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/shortcuts.types.public";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "@/plugins/prompt-history/settings";

function PromptHistoryPluginSettingsUi() {
  const { settings, update } = useSettings();

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <p>
        Frustrated when losing your prompt? This plugin will locally save your
        prompt to history and allow you to easily access it.
      </p>
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

      {settings.enabled && (
        <div className="x:ml-8 x:flex x:flex-col x:gap-2">
          <SlashCommandMenuActivationShortcutsSettings />

          <Switch
            className="x:items-start"
            textLabel={
              <div>
                <div>Save on submit</div>
                <div className="x:text-sm x:text-muted-foreground">
                  When you submit a new prompt
                </div>
              </div>
            }
            checked={settings.trigger.onSubmit}
            onCheckedChange={({ checked }) => {
              void update({
                updateFn(prev) {
                  prev.trigger.onSubmit = checked;
                },
              });
            }}
          />
          <Switch
            className="x:items-start"
            textLabel={
              <div>
                <div>Save on navigation</div>
                <div className="x:text-sm x:text-muted-foreground">
                  When you (accidentally) navigate away from the page (or when
                  Perplexity forces the page to reload)
                </div>
              </div>
            }
            checked={settings.trigger.onNavigation}
            onCheckedChange={({ checked }) => {
              void update({
                updateFn(prev) {
                  prev.trigger.onNavigation = checked;
                },
              });
            }}
          />
        </div>
      )}

      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://cdn.cplx.app/images/3miAzlF.png"
          alt="prompt-history"
          className="x:w-full"
        />
      </div>
    </div>
  );
}

export default function Wrapper() {
  "use no memo";

  registerSettingsUi({
    pluginId: "promptHistory",
    ui: <PromptHistoryPluginSettingsUi />,
  });
}

function SlashCommandMenuActivationShortcutsSettings() {
  const { settings, update } = useSettings();

  const shortcutType = settings.shortcut.type;
  const shortcutValue = settings.shortcut.value;
  const shortcutTypeItems = [
    { id: "keybinding", title: "Keyboard Shortcut" },
    { id: "command", title: "Text Command" },
  ];
  const defaultKeys = Array.isArray(shortcutValue) ? shortcutValue : [];
  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys,
    onSave: (keys) => {
      void update({
        updateFn(prev) {
          prev.shortcut.value = keys;
        },
      });
    },
  });

  return (
    <div className="x:mb-4">
      <Label className="x:text-muted-foreground">Shortcut</Label>
      <div className="x:flex x:items-center x:gap-4">
        <Select
          collection={createListCollection({
            items: shortcutTypeItems,
            itemToString: (item) => item.title,
            itemToValue: (item) => item.id,
          })}
          value={[shortcutType]}
          positioning={{ sameWidth: true }}
          onValueChange={({ value }) => {
            void update({
              updateFn(prev) {
                prev.shortcut.type =
                  value[0] as SlashCommandMenuTabShortcut["type"];
                prev.shortcut.value = value[0] === "keybinding" ? [] : "";
              },
            });
          }}
        >
          <SelectTrigger className="x:w-48 x:p-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {shortcutTypeItems.map((item) => (
              <SelectItem key={item.id} item={item.id}>
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {shortcutType === "keybinding" ? (
          <HotkeyRecorderUi />
        ) : (
          <div className="x:flex x:w-fit x:items-center x:rounded-lg x:border x:p-0.5 x:*:font-mono x:*:tracking-widest">
            <span className="x:ml-2">{`//`}</span>
            <Input
              className="x:w-full x:max-w-[300px] x:border-none x:p-0 x:text-base x:focus-visible:ring-0 x:focus-visible:ring-transparent"
              placeholder="..."
              defaultValue={shortcutValue}
              onChange={(e) => {
                void update({
                  updateFn(prev) {
                    prev.shortcut.value = e.target.value;
                  },
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
