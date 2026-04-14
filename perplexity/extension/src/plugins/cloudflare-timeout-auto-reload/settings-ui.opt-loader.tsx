import { createListCollection } from "@ark-ui/react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import {
  useSettings,
  type Settings,
} from "@/plugins/cloudflare-timeout-auto-reload/settings";

type BehaviorType = Settings["behavior"];

const BEHAVIOR_LABELS: Record<BehaviorType, string> = {
  reload: "Reload",
  "warn-only": "Warn only",
};

const BEHAVIOR_OPTIONS: BehaviorType[] = ["reload", "warn-only"];

const itemCollection = createListCollection<BehaviorType>({
  items: BEHAVIOR_OPTIONS,
  itemToString: (item) => BEHAVIOR_LABELS[item],
});

function CloudflareTimeoutAutoReloadPluginSettingsUi() {
  const { settings, update } = useSettings();

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <P>
        Helpful when you are using VPNs, or when Perplexity/Cloudflare has
        issues with your ISP. Turn this on if you want to automatically reload
        the page when this occurs.
      </P>
      <P>
        This may or may not work depending on the current technical limitations.{" "}
        <span className="x:underline">
          Disable this plugin if it causes false positives.
        </span>
      </P>
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

      {settings.enabled && (
        <div>
          <Label className="x:text-muted-foreground">Behavior</Label>
          <Select
            portal={false}
            collection={itemCollection}
            value={[settings.behavior]}
            positioning={{ sameWidth: true }}
            onValueChange={({ value }) => {
              void update({
                updateFn: (draft) => {
                  draft.behavior = value[0] as BehaviorType;
                },
              });
            }}
          >
            <SelectTrigger variant="default" className="x:w-fit x:p-4 x:py-2">
              <SelectValue placeholder="Behavior" />
            </SelectTrigger>
            <SelectContent>
              {BEHAVIOR_OPTIONS.map((option) => (
                <SelectItem key={option} item={option}>
                  {BEHAVIOR_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

export default function Wrapper() {
  "use no memo";

  registerSettingsUi({
    pluginId: "cloudflareTimeoutAutoReload",
    ui: <CloudflareTimeoutAutoReloadPluginSettingsUi />,
  });
}
