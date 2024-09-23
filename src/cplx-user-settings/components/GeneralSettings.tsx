import { LuExternalLink as ExternalLink } from "react-icons/lu";

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
import useCplxUserSettings from "@/shared/hooks/useCplxUserSettings";
import { cn } from "@/utils/cn";
import { compareVersions } from "@/utils/utils";
import packageData from "~/package.json";

const { queryBoxSelectors, qolTweaks, visualTweaks } = generalSettings;

export default function GeneralSettings({
  context,
}: {
  context?: "popup" | "in-page";
}) {
  const { data, mutation } = useCplxUserSettings();

  const isAllSettingsEnabled = useMemo(() => {
    const settings = data.data?.generalSettings;

    if (!settings) return false;

    const settingsKey = Object.keys(
      settings,
    ) as (keyof CplxUserSettings["generalSettings"])[];

    return settingsKey.every((key) => {
      return Object.keys(settings[key]).every((subKey) => {
        const subSettingsKey =
          subKey as keyof CplxUserSettings["generalSettings"][keyof CplxUserSettings["generalSettings"]];

        if (typeof settings[key][subSettingsKey] !== "boolean") {
          return true;
        }

        return settings[key][subSettingsKey];
      });
    });
  }, [data.data?.generalSettings]);

  return (
    <main className="tw-h-full tw-w-full tw-flex-col tw-bg-background tw-font-sans !tw-text-[1em] tw-text-foreground">
      <div>
        <div className="tw-mb-4 tw-flex tw-flex-col tw-gap-4">
          <div className="tw-flex tw-flex-col tw-gap-2">
            <div className="tw-mr-4 tw-mt-4 tw-flex tw-items-center tw-justify-end">
              <Switch
                checked={isAllSettingsEnabled}
                textLabel="Toggle All Settings"
                onCheckedChange={async ({ checked }) => {
                  mutation.mutate((draft) => {
                    Object.keys(draft.generalSettings).forEach((key) => {
                      const settingsKey =
                        key as keyof CplxUserSettings["generalSettings"];

                      Object.keys(draft.generalSettings[settingsKey]).forEach(
                        (subKey) => {
                          const subSettingsKey =
                            subKey as keyof CplxUserSettings["generalSettings"][keyof CplxUserSettings["generalSettings"]];

                          if (
                            typeof draft.generalSettings[settingsKey][
                              subSettingsKey
                            ] !== "boolean"
                          ) {
                            return;
                          }

                          (draft.generalSettings[settingsKey][
                            subSettingsKey
                          ] as boolean) = checked;
                        },
                      );
                    });
                  });
                }}
              />
            </div>

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
    ({
      id,
      label,
      description,
      settingKey,
      experimental,
      versionRelease,
      onClick,
    }) => {
      const enabled = Boolean(
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
              className={cn({
                "tw-items-start": !!description,
              })}
              textLabel={
                <div className="tw-flex tw-flex-col tw-gap-1">
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <span className="tw-flex tw-gap-2">
                      {versionRelease &&
                        compareVersions(packageData.version, versionRelease) <=
                          0 && (
                          <div className="tw-w-max tw-rounded-md tw-bg-accent-foreground tw-px-2 tw-text-xs tw-text-background">
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
                  {description && (
                    <div className="tw-ml-2 tw-text-xs tw-text-muted-foreground">
                      {description}
                    </div>
                  )}
                </div>
              }
              defaultChecked={!settingKey ? true : enabled}
              checked={!settingKey ? true : enabled}
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
