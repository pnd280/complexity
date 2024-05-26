import { Zap } from 'lucide-react';

import LabeledSwitch from '@/components/LabeledSwitch';
import { Separator } from '@/components/ui/separator';

import usePopupSettings from './hooks/usePopupSettings';

const queryBoxSelectors = [
  {
    id: 'focus-selector',
    label: 'Web search focus',
    storeKey: 'focus',
  },
  {
    id: 'language-model-selector',
    label: 'Language Model',
    storeKey: 'languageModel',
  },
  {
    id: 'image-gen-model-selector',
    label: 'Image Generation Model',
    storeKey: 'imageGenModel',
  },
] as const;

const usefulTweaks = [
  {
    id: 'thread-toc',
    label: 'Thread TOC',
    storeKey: 'threadTOC',
  },
  {
    id: 'double-click-to-edit-query',
    label: 'Double click to edit query',
    storeKey: 'doubleClickToEditQuery',
  },
  {
    id: 'collection-quick-context-menu',
    label: 'Quick context menu on collection links (in thread)',
    storeKey: 'collectionQuickContextMenu',
  },
];

const visualTweaks = [
  {
    id: 'thread-query-markdown',
    label: 'Thread query markdown',
    storeKey: 'threadQueryMarkdown',
  },
  {
    id: 'chat-ui', // image & avatar on top of every messages
    label: 'Chat UI',
    storeKey: 'chatUI',
  },
  {
    id: 'collapse-empty-visual-columns',
    label: 'Collapse empty visual columns',
    storeKey: 'collapseEmptyVisualColumns',
  },
  {
    id: 'wider-thread-width',
    label: 'Wider thread width',
    storeKey: 'widerThreadWidth',
  },
] as const;

export const Popup = () => {
  const { store, handleQueryBoxSettingsChange } = usePopupSettings();

  if (!store) return null;

  return (
    <main className="tw-font-sans tw-h-max tw-bg-background tw-text-foreground tw-flex-col tw-p-4 tw-w-max">
      <div className="tw-scroll-m-20 tw-text-2xl tw-font-semibold tw-tracking-tight tw-flex tw-items-center tw-mb-4">
        <Zap className="tw-w-5 tw-h-5 tw-mr-2" />
        Complexity
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
            Useful tweaks
          </div>
          <Separator />
          {usefulTweaks.map(({ id, label, storeKey }) => (
            <LabeledSwitch
              key={id}
              id={id}
              label={label}
              defaultChecked={false}
              labelClassName="tw-max-w-[200px]"
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
              defaultChecked={false}
            />
          ))}
        </div>
      </div>
      <div className='tw-text-yellow-300'>Change(s) requires a full page reload!</div>
    </main>
  );
};

export default Popup;
