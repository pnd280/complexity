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
    <main className="tw-font-sans tw-h-[300px] tw-overflow-auto tw-bg-background tw-text-foreground tw-flex-col tw-py-4 tw-w-max">
      <div className="tw-px-4 tw-mb-10">
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
        <div className="tw-text-muted-foreground tw-text-lg">
          ...more to come
        </div>
      </div>

      <div className="tw-fixed tw-w-full tw-bottom-0 tw-left-0 tw-bg-secondary tw-flex tw-flex-col">
        <Separator />
        <div className="tw-flex">
          <div className="tw-p-2 tw-font-bold tw-flex tw-items-center">
            <span>Complexity</span>
            <Zap className="tw-h-4 tw-w-4 tw-mx-1 tw-text-accent-foreground" />
            <div className="tw-text-secondary-foreground">by pnd280</div>
          </div>
          <div className="tw-px-2 tw-py-1 tw-mr-2 tw-font-bold tw-ml-auto tw-bg-background tw-text-foreground tw-rounded-md tw-font-mono tw-self-center tw-border tw-border-accent-foreground">
            alpha-test-1.2
          </div>
        </div>
      </div>
    </main>
  );
};

export default Popup;
