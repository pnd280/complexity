import { createListCollection } from "@ark-ui/react";

import type { PluginId } from "@/__registries__/plugins/meta.types";
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
import type { SlashCommandMenuTabShortcut } from "@/plugins/__core__/slash-command/shortcuts.types.public";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "promptHistory";

export default function PromptHistoryPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();

  const handleEnableChange = (checked: boolean) => {
    mutation.mutate((draft) => {
      draft.plugins["promptHistory"].enabled = checked;
    });
  };

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <p>
        Frustrated when losing your prompt? This plugin will locally save your
        prompt to history and allow you to easily access it.
      </p>
      <Switch
        textLabel="Enable"
        checked={settings.plugins["promptHistory"].enabled}
        onCheckedChange={({ checked }) => handleEnableChange(checked)}
      />

      {settings.plugins["promptHistory"].enabled && (
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
            checked={settings.plugins["promptHistory"].trigger.onSubmit}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["promptHistory"].trigger.onSubmit = checked;
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
            checked={settings.plugins["promptHistory"].trigger.onNavigation}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["promptHistory"].trigger.onNavigation = checked;
              });
            }}
          />
        </div>
      )}
      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/3miAzlF.png"
          alt="prompt-history"
          className="x:w-full"
        />
      </div>
    </div>
  );
}

function SlashCommandMenuActivationShortcutsSettings() {
  const { settings, mutation } = useExtensionSettings();

  const shortcutType = settings.plugins["promptHistory"].shortcut.type;
  const shortcutValue = settings.plugins["promptHistory"].shortcut.value;
  const shortcutTypeItems = [
    { id: "keybinding", title: "Keyboard Shortcut" },
    { id: "command", title: "Text Command" },
  ];
  const defaultKeys = Array.isArray(shortcutValue) ? shortcutValue : [];
  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys,
    onSave: (keys) => {
      mutation.mutate((draft) => {
        draft.plugins["promptHistory"].shortcut.value = keys;
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
            mutation.mutate((draft) => {
              draft.plugins["promptHistory"].shortcut.type =
                value[0] as SlashCommandMenuTabShortcut["type"];
              draft.plugins["promptHistory"].shortcut.value =
                value[0] === "keybinding" ? [] : "";
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
            <span className="x:ml-2">//</span>
            <Input
              className="x:w-full x:max-w-[300px] x:border-none x:p-0 x:text-base x:focus-visible:ring-0 x:focus-visible:ring-transparent"
              placeholder="..."
              defaultValue={shortcutValue}
              onChange={(e) => {
                mutation.mutate((draft) => {
                  draft.plugins["promptHistory"].shortcut.value =
                    e.target.value;
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
