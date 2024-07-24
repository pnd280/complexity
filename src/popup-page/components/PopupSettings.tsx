import { ExternalLink } from "lucide-react";

import LabeledSwitch from "@/shared/components/LabeledSwitch";
import { Separator } from "@/shared/components/shadcn/ui/separator";
import { CPLXUserSettings, PopupSettingKeys } from "@/types/CPLXUserSettings";
import { cn } from "@/utils/cn";

import packageData from "../../../package.json";
import usePopupSettings from "../hooks/usePopupSettings";
import popupSettings, { PopupSetting } from "../settings";

const { queryBoxSelectors, qolTweaks, visualTweaks } = popupSettings;

export const PopupSettings = ({
  context,
}: {
  context?: "popup" | "options";
}) => {
  return (
    <main className="tw-relative tw-h-full tw-w-full tw-flex-col tw-overflow-auto tw-bg-background tw-font-sans !tw-text-[1em] tw-text-foreground">
      <div className="tw-overflow-auto tw-px-4 tw-py-2">
        <div className="tw-mb-4 tw-mt-2 tw-w-full tw-text-sm tw-text-yellow-300">
          Change(s) requires a full page reload!
        </div>
        <div className="tw-mb-4 tw-flex tw-flex-col tw-gap-4">
          <div className="tw-flex tw-flex-col tw-gap-2">
            <div className="tw-text-lg tw-font-semibold tw-tracking-tight">
              Query box Selectors
            </div>
            <Separator />
            <RenderSettings
              settings={queryBoxSelectors}
              settingStoreKey="queryBoxSelectors"
            />
          </div>
          <div className="tw-flex tw-flex-col tw-gap-2">
            <div className="tw-text-lg tw-font-semibold tw-tracking-tight">
              QoL tweaks
            </div>
            <Separator />
            <RenderSettings settings={qolTweaks} settingStoreKey="qolTweaks" />
          </div>
          <div className="tw-flex tw-flex-col tw-gap-2">
            <div className="tw-text-lg tw-font-semibold tw-tracking-tight">
              Visual tweaks
            </div>
            <Separator />
            <RenderSettings
              settings={visualTweaks}
              settingStoreKey="visualTweaks"
            />
          </div>
        </div>

        {context === "popup" ? (
          <div
            className="tw-ml-auto tw-flex tw-w-max tw-cursor-pointer tw-items-center tw-gap-1 hover:tw-underline"
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
};

function RenderSettings<
  T extends PopupSetting<PopupSettingKeys>,
  K extends keyof CPLXUserSettings["popupSettings"],
>({ settings, settingStoreKey }: { settings: T[]; settingStoreKey: K }) {
  const { settings: userSettings, updateSettings } = usePopupSettings();

  if (!userSettings) return null;

  return settings.map(
    ({ id, label, storeKey, experimental, versionRelease, onClick }) => {
      const defaultChecked =
        !!userSettings[settingStoreKey]?.[
          storeKey as keyof CPLXUserSettings["popupSettings"][K]
        ];

      return (
        <div
          key={id}
          className={cn({
            "tw-mb-4 tw-flex tw-flex-col tw-gap-1":
              experimental || versionRelease === packageData.version,
          })}
        >
          <LabeledSwitch
            key={id}
            id={id}
            label={label}
            labelClassName={cn("tw-max-w-full", {
              "tw-cursor-pointer": !!onClick,
            })}
            defaultChecked={!storeKey ? true : defaultChecked}
            checked={!storeKey ? true : undefined}
            onCheckedChange={(checked) => {
              if (!storeKey) return onClick?.();

              updateSettings(settingStoreKey, (draft) => {
                draft[storeKey as keyof CPLXUserSettings["popupSettings"][K]] =
                  checked as CPLXUserSettings["popupSettings"][K][keyof CPLXUserSettings["popupSettings"][K]];
              });
            }}
          />
          <div className="tw-ml-12 tw-flex tw-gap-2">
            {versionRelease === packageData.version && (
              <div className="tw-w-max tw-rounded-md tw-bg-accent-foreground tw-p-1 tw-px-2 tw-text-xs tw-font-bold">
                New
              </div>
            )}
            {experimental && (
              <div className="tw-w-max tw-rounded-md tw-bg-destructive tw-p-1 tw-px-2 tw-text-xs tw-font-bold tw-text-destructive-foreground">
                Experimental
              </div>
            )}
          </div>
        </div>
      );
    },
  );
}

export default PopupSettings;
