import { Zap } from 'lucide-react';

import LabeledSwitch from '@/components/LabeledSwitch';
import { Separator } from '@/components/ui/separator';

import usePopupSettings from './hooks/usePopupSettings';
import popupSettings from './settings';

const { queryBoxSelectors, qolTweaks } = popupSettings;

const displayVersion = 'alpha-test-1.5';

export const Popup = () => {
  const { store, handleQueryBoxSettingsChange, handleQolTweaksChange } =
    usePopupSettings();

  if (!store) return null;

  return (
    <main className="tw-relative tw-font-sans tw-bg-background tw-text-foreground tw-flex-col tw-w-max !tw-text-[1em] tw-max-w-max tw-overflow-auto">
      <div className="tw-px-4 tw-pt-4 tw-h-[300px] tw-overflow-auto tw-mb-10">
        <div className="tw-text-yellow-300 tw-mb-4 tw-w-full">
          Change(s) requires a full page reload!
        </div>
        <div className="tw-flex tw-flex-col tw-gap-4 tw-mb-4">
          <div className="tw-flex tw-flex-col tw-gap-2">
            <div className="tw-text-lg tw-font-semibold tw-tracking-tight">
              Query box Selectors
            </div>
            <Separator />
            {queryBoxSelectors.map(({ id, label, storeKey }) => (
              <LabeledSwitch
                key={id}
                id={id}
                label={label}
                labelClassName="tw-max-w-[200px]"
                defaultChecked={
                  store.popupSettings?.queryBoxSelectors?.[storeKey] ?? false
                }
                onCheckedChange={(checked) =>
                  handleQueryBoxSettingsChange(storeKey, checked)
                }
              />
            ))}
          </div>
          <div className="tw-flex tw-flex-col tw-gap-2">
            <div className="tw-text-lg tw-font-semibold tw-tracking-tight">
              QoL tweaks
            </div>
            <Separator />
            {qolTweaks.map(({ id, label, storeKey }) => (
              <LabeledSwitch
                key={id}
                id={id}
                label={label}
                labelClassName="tw-max-w-[200px]"
                defaultChecked={
                  store.popupSettings?.qolTweaks?.[storeKey] ?? false
                }
                onCheckedChange={(checked) => {
                  console.log('storeKey', storeKey, 'checked', checked);
                  handleQolTweaksChange(storeKey, checked);
                }}
              />
            ))}
          </div>
        </div>
        <div className="tw-text-muted-foreground tw-text-lg">
          ...more to come
        </div>
      </div>

      <div className="tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-bg-secondary tw-flex tw-flex-col">
        <Separator />
        <div className="tw-flex">
          <div className="tw-p-2 tw-font-bold tw-flex tw-items-center">
            <span>Complexity</span>
            <Zap className="tw-h-3 tw-w-3 tw-mx-1 tw-text-accent-foreground" />
            <div className="tw-text-secondary-foreground !tw-min-w-max tw-truncate">
              by pnd280
            </div>
          </div>
          <div
            id="complexity-version"
            title={displayVersion}
            className="tw-px-2 tw-py-1 tw-mr-2 tw-text-[.6rem] tw-font-bold tw-ml-auto tw-bg-background tw-text-foreground tw-rounded-md tw-font-mono tw-self-center tw-border tw-truncate"
          >
            {displayVersion}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Popup;
