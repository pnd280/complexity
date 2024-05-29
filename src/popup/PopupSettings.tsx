import LabeledSwitch from '@/components/LabeledSwitch';
import { Separator } from '@/components/ui/separator';

import usePopupSettings from './hooks/usePopupSettings';
import popupSettings from './settings';

const { queryBoxSelectors, qolTweaks, visualTweaks } = popupSettings;

export const PopupSettings = () => {
  const {
    store,
    handleQueryBoxSettingsChange,
    handleQolTweaksChange,
    handleVisualTweaksChange,
  } = usePopupSettings();

  if (!store) return null;

  return (
    <main className="tw-relative tw-font-sans tw-bg-background tw-text-foreground tw-flex-col tw-w-full tw-h-full !tw-text-[1em] tw-overflow-auto">
      <div className="tw-px-4 tw-pt-4 tw-overflow-auto">
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
                labelClassName="tw-max-w-full"
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
                labelClassName="tw-max-w-full"
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
          <div className="tw-flex tw-flex-col tw-gap-2">
            <div className="tw-text-lg tw-font-semibold tw-tracking-tight">
              Visual tweaks
            </div>
            <Separator />
            {visualTweaks.map(({ id, label, storeKey }) => (
              <LabeledSwitch
                key={id}
                id={id}
                label={label}
                labelClassName="tw-max-w-full"
                defaultChecked={
                  store.popupSettings?.visualTweaks?.[storeKey] ?? false
                }
                onCheckedChange={(checked) => {
                  console.log('storeKey', storeKey, 'checked', checked);
                  handleVisualTweaksChange(storeKey, checked);
                }}
              />
            ))}
          </div>
        </div>
        <div className="tw-text-muted-foreground tw-text-lg">
          ...more to come
        </div>
      </div>
    </main>
  );
};

export default PopupSettings;
