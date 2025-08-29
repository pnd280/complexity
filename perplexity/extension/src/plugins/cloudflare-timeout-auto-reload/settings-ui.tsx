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
import type { PluginId } from "@/data/plugin-registry/types";
import type { ExtensionSettings } from "@/services/infra/extension-settings/types";
import useExtensionSettings from "@/services/infra/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "cloudflareTimeoutAutoReload";

const key = "cloudflareTimeoutAutoReload" as const;

type BehaviorType = ExtensionSettings["plugins"][typeof key]["behavior"];

const BEHAVIOR_LABELS: Record<BehaviorType, string> = {
  reload: "Reload",
  "warn-only": "Warn only",
};

const BEHAVIOR_OPTIONS: BehaviorType[] = ["reload", "warn-only"];

const itemCollection = createListCollection<BehaviorType>({
  items: BEHAVIOR_OPTIONS,
  itemToString: (item) => BEHAVIOR_LABELS[item],
});

export default function OnCloudflareTimeoutAutoReloadPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const pluginSettings = settings?.plugins[key];

  const handleEnableChange = (checked: boolean) => {
    mutation.mutate((draft) => {
      draft.plugins[key].enabled = checked;
    });
  };

  const handleBehaviorChange = (value: string[]) => {
    mutation.mutate((draft) => {
      draft.plugins[key].behavior = value[0] as BehaviorType;
    });
  };

  if (!settings) return null;

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
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => handleEnableChange(checked)}
      />

      {settings.plugins["cloudflareTimeoutAutoReload"].enabled && (
        <div>
          <Label className="x:text-muted-foreground">Behavior</Label>
          <Select
            portal={false}
            collection={itemCollection}
            value={[pluginSettings?.behavior ?? "reload"]}
            positioning={{ sameWidth: true }}
            onValueChange={({ value }) => handleBehaviorChange(value)}
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
