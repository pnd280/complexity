import { ExternalLink } from 'lucide-react';

import LabeledSwitch from '@/components/LabeledSwitch';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  ChromeStore,
  PopupSettingKeys,
} from '@/types/ChromeStore';

import packageData from '../../package.json';
import usePopupSettings from './hooks/usePopupSettings';
import popupSettings, { PopupSetting } from './settings';

const { queryBoxSelectors, qolTweaks, visualTweaks } = popupSettings;

export const PopupSettings = ({
  context,
}: {
  context?: 'popup' | 'options';
}) => {
  return (
    <main className="tw-relative tw-font-sans tw-bg-background tw-text-foreground tw-flex-col tw-w-full tw-h-full !tw-text-[1em] tw-overflow-auto">
      <div className="tw-px-4 tw-py-2 tw-overflow-auto">
        <div className="tw-text-yellow-300 tw-mb-4 tw-mt-2 tw-w-full tw-text-sm">
          Change(s) requires a full page reload!
        </div>
        <div className="tw-flex tw-flex-col tw-gap-4 tw-mb-4">
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

        {context === 'popup' ? (
          <div
            className="tw-flex tw-gap-1 tw-items-center tw-ml-auto tw-w-max hover:tw-underline tw-cursor-pointer"
            onClick={() => {
              chrome.runtime.openOptionsPage();
              window.close();
            }}
          >
            <span>Advanced settings</span>
            <ExternalLink className="tw-w-3 tw-h-3" />
          </div>
        ) : (
          <div className="tw-text-muted-foreground tw-text-lg">
            ...more to come
          </div>
        )}
      </div>
    </main>
  );
};

function RenderSettings<
  T extends PopupSetting<PopupSettingKeys>,
  K extends keyof ChromeStore['popupSettings'],
>({ settings, settingStoreKey }: { settings: T[]; settingStoreKey: K }) {
  const { store, handleSettingsChange } = usePopupSettings();

  if (!store) return null;

  return settings.map(
    ({ id, label, storeKey, experimental, versionRelease }) => {
      const defaultChecked =
        !!store.popupSettings[settingStoreKey]?.[
          storeKey as keyof ChromeStore['popupSettings'][K]
        ];

      return (
        <div
          className={cn({
            'tw-mb-4 tw-flex tw-flex-col tw-gap-1':
              experimental || versionRelease === packageData.version,
          })}
        >
          <LabeledSwitch
            key={id}
            id={id}
            label={label}
            labelClassName="tw-max-w-full"
            defaultChecked={defaultChecked}
            onCheckedChange={(checked) => {
              handleSettingsChange(
                settingStoreKey,
                storeKey as keyof ChromeStore['popupSettings'][K],
                checked
              );
            }}
          />
          <div className="tw-flex tw-gap-2 tw-ml-12">
            {versionRelease === packageData.version && (
              <div className="tw-text-xs tw-bg-accent-foreground tw-w-max tw-p-1 tw-px-2 tw-rounded-md tw-font-bold">
                New
              </div>
            )}
            {experimental && (
              <div className="tw-text-xs tw-bg-destructive tw-text-destructive-foreground tw-w-max tw-p-1 tw-px-2 tw-rounded-md tw-font-bold">
                Experimental
              </div>
            )}
          </div>
        </div>
      );
    }
  );
}

export default PopupSettings;
