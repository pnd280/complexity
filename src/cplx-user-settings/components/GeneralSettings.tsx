import { ExternalLink } from "lucide-react";

import generalSettings, {
  PopupSetting,
} from "@/cplx-user-settings/GeneralSettings";
import useCplxGeneralSettings from "@/cplx-user-settings/hooks/useCplxGeneralSettings";
import {
  CplxUserSettings,
  GeneralSettingsKeys,
} from "@/cplx-user-settings/types/cplx-user-settings.types";
import Separator from "@/shared/components/Separator";
import Switch from "@/shared/components/Switch";
import Tooltip from "@/shared/components/Tooltip";
import { compareVersions } from "@/utils/utils";
import packageData from "@@/package.json";

const { queryBoxSelectors, qolTweaks, visualTweaks } = generalSettings;

export default function GeneralSettings({
  context,
}: {
  context?: "popup" | "in-page";
}) {
  return (
    <main className="tw-h-full tw-w-full tw-flex-col tw-bg-background tw-font-sans !tw-text-[1em] tw-text-foreground">
      <div>
        <div className="tw-mb-4 tw-flex tw-flex-col tw-gap-4">
          <div className="tw-flex tw-flex-col tw-gap-2">
            <div className="tw-text-lg tw-font-semibold tw-tracking-tight">
              Query box Selectors
            </div>
            <Separator />
            <SettingGroup
              settings={queryBoxSelectors}
              settingStoreKey="queryBoxSelectors"
            />
          </div>
          <div className="tw-flex tw-flex-col tw-gap-2">
            <div className="tw-text-lg tw-font-semibold tw-tracking-tight">
              QoL tweaks
            </div>
            <Separator />
            <SettingGroup settings={qolTweaks} settingStoreKey="qolTweaks" />
          </div>
          <div className="tw-flex tw-flex-col tw-gap-2">
            <div className="tw-text-lg tw-font-semibold tw-tracking-tight">
              Visual tweaks
            </div>
            <Separator />
            <SettingGroup
              settings={visualTweaks}
              settingStoreKey="visualTweaks"
            />
          </div>
        </div>

        {context === "popup" ? (
          <div
            className="tw-ml-auto tw-flex tw-w-max tw-cursor-pointer tw-items-center tw-gap-1 tw-pb-4 hover:tw-underline"
            onClick={() => {
              chrome.runtime.openOptionsPage();
              window.close();
            }}
          >
            <span>All settings</span>
            <ExternalLink className="tw-size-3" />
          </div>
        ) : (
          <div className="tw-text-lg tw-text-muted-foreground">
            ...more to come
          </div>
        )}
      </div>
    </main>
  );
}

function SettingGroup<
  T extends PopupSetting<GeneralSettingsKeys>,
  K extends keyof CplxUserSettings["generalSettings"],
>({ settings, settingStoreKey }: { settings: T[]; settingStoreKey: K }) {
  const { settings: userSettings, updateSettings } = useCplxGeneralSettings();

  if (!userSettings) return null;

  return settings.map(
    ({ id, label, settingKey, experimental, versionRelease, onClick }) => {
      const defaultChecked = Boolean(
        userSettings[settingStoreKey]?.[
          settingKey as keyof CplxUserSettings["generalSettings"][K]
        ],
      );

      return (
        <div key={id}>
          <Tooltip
            content={!settingKey ? "This setting is always enabled" : ""}
            positioning={{
              placement: "top-start",
              gutter: 10,
            }}
          >
            <Switch
              key={id}
              id={id}
              textLabel={
                <div className="tw-flex tw-items-center tw-gap-2">
                  <span className="tw-flex tw-gap-2">
                    {versionRelease &&
                      compareVersions(packageData.version, versionRelease) <=
                        0 && (
                        <div className="tw-w-max tw-rounded-md tw-bg-accent-foreground tw-px-2 tw-text-xs tw-text-primary">
                          new
                        </div>
                      )}
                    {experimental && (
                      <div className="tw-w-max tw-rounded-md tw-bg-destructive tw-px-2 tw-text-xs tw-text-destructive-foreground">
                        experimental
                      </div>
                    )}
                  </span>
                  <span>{label}</span>
                </div>
              }
              defaultChecked={!settingKey ? true : defaultChecked}
              checked={!settingKey ? true : undefined}
              onCheckedChange={({ checked }) => {
                if (!settingKey) return onClick?.();
                updateSettings(settingStoreKey, (draft) => {
                  draft[
                    settingKey as keyof CplxUserSettings["generalSettings"][K]
                  ] =
                    checked as CplxUserSettings["generalSettings"][K][keyof CplxUserSettings["generalSettings"][K]];
                });
              }}
            />
          </Tooltip>
        </div>
      );
    },
  );
}
