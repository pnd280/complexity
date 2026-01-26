import { useQueryClient } from "@tanstack/react-query";
import isEqual from "lodash/isEqual";
import type { ComponentType, SVGProps } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup } from "@/components/ui/radio";
import {
  ALL_PLUGINS,
  ESSENTIALS_ONLY,
  POWER_USER,
} from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/predefined-configs";
import { extensionSettingsQueries } from "@/entrypoints/hooks/useSettingsBase";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import type {
  InferSettingsValue,
  PluginsSettings,
} from "@/entrypoints/services/plugins/settings/types";
import type { PluginsRegistry } from "@/entrypoints/services/plugins/types";
import { getPluginSettingsStorage } from "@/entrypoints/services/plugins/utils";

import LuZap from "~icons/lucide/zap";
import TablerCheck from "~icons/tabler/check";
import TablerRocket from "~icons/tabler/rocket";

const presets = [
  {
    value: "essentials",
    label: (
      <PresetLabel
        label="Essentials Only"
        LabelIcon={TablerCheck}
        description="You're new to Perplexity and using the extension for the first time."
      />
    ),
    config: ESSENTIALS_ONLY,
  },
  {
    value: "power",
    label: (
      <PresetLabel
        label="Power User"
        LabelIcon={LuZap}
        description="You're an experienced Perplexity user looking to maximize your productivity."
      />
    ),
    config: POWER_USER,
  },
  {
    value: "all",
    label: (
      <PresetLabel
        label="Editor's Picks"
        LabelIcon={TablerRocket}
        description="Enabling multiple plugins without understanding their functionality is not recommended. It's suggested to explore them individually."
      />
    ),
    config: ALL_PLUGINS,
  },
];

function PresetLabel({
  label,
  LabelIcon,
  description,
}: {
  label: string;
  LabelIcon: ComponentType<SVGProps<SVGSVGElement>>;
  description: string;
}) {
  return (
    <div className="x:flex x:flex-col x:gap-1">
      <div className="x:flex x:items-center x:gap-2">
        <div className="x:text-lg">{label}</div>
        <LabelIcon className="x:text-primary" />
      </div>
      <div className="x:text-sm x:text-muted-foreground">{description}</div>
    </div>
  );
}

export default function PluginsEnableSet() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDefaultSettings = isEqual(
    PluginsSettingSnapshotsService.getPluginsFallbackValues(),
    PluginsSettingSnapshotsService.snapshots,
  );
  const [open, setOpen] = useState(
    searchParams.get("from") === "onboarding" && isDefaultSettings,
  );
  const [selectedPreset, setSelectedPreset] = useState<string>("essentials");

  return (
    <Dialog
      unmountOnExit
      lazyMount
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant="link" className="x:p-0">
          Not sure where to start? Try presets!
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plugin Presets</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Predefined plugin sets to help you get started quickly.
        </DialogDescription>

        {!isDefaultSettings && (
          <div className="x:flex x:flex-col x:gap-2">
            <div className="x:text-sm x:text-yellow-300">
              Presets will override your current settings. Be sure to save your
              current configuration before applying a preset.
            </div>
          </div>
        )}

        <RadioGroup
          value={selectedPreset}
          options={presets}
          orientation="vertical"
          size="lg"
          className="x:space-y-4"
          onValueChange={(details) => {
            if (details.value) {
              setSelectedPreset(details.value);
            }
          }}
        />

        <div className="x:text-sm x:text-muted-foreground">
          Many plugins depend on personal preferences. Feel free to test and
          enable them as you prefer.
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => navigate("/")}>
              I&apos;ll look around by myself
            </Button>
          </DialogClose>
          <Button
            onClick={async () => {
              const preset = presets.find((p) => p.value === selectedPreset);

              if (!preset) return;

              for (const [pluginId, value] of Object.entries(preset.config) as [
                keyof PluginsSettings,
                InferSettingsValue<PluginsRegistry[keyof PluginsRegistry]>,
              ][]) {
                await getPluginSettingsStorage(pluginId).setValue(value);
              }

              await queryClient.invalidateQueries({
                queryKey: extensionSettingsQueries.all(),
              });

              setOpen(false);
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
