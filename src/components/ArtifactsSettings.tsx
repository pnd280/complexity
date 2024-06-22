import { Info } from 'lucide-react';

import { useGlobalStore } from '@/content-script/session-store/global';
import {
  usePopupSettingsStore,
} from '@/content-script/session-store/popup-settings';
import { chromeStorage } from '@/utils/chrome-store';

import LabeledSwitch from './LabeledSwitch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

export default function ArtifactsSettings() {
  const mermaid = useGlobalStore(({ artifacts }) => artifacts.mermaid);

  const codeBlockEnhancedToolbar = usePopupSettingsStore(
    ({ qolTweaks: { codeBlockEnhancedToolbar } }) => codeBlockEnhancedToolbar
  );

  return (
    <div className="tw-flex tw-flex-col tw-gap-2 ">
      {!codeBlockEnhancedToolbar && (
        <div className="tw-mx-auto">
          You need to enable the{' '}
          <span className="tw-font-bold tw-text-accent-foreground">
            Code Block Enhanced Toolbar
          </span>{' '}
          in the{' '}
          <span className="tw-font-bold tw-text-accent-foreground">
            QoL tweaks
          </span>{' '}
          settings to use this feature.
        </div>
      )}

      {codeBlockEnhancedToolbar && (
        <>
          <h1 className="tw-text-xl tw-text-yellow-300 tw-mx-auto">
            ⚠️ This is a{' '}
            <span className="tw-underline">highly experimental</span> feature!
          </h1>
          <div className="tw-text-center">
            <p>
              This feature is still in development and may not work as expected.
            </p>
            <p>
              Enabling this feature may cause performance issues and unexpected
              behavior.
            </p>
          </div>

          <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-4">
            <div className="tw-text-lg tw-font-semibold tw-tracking-tight">
              Supported artifacts
            </div>
            <Accordion type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div onClick={(e) => e.stopPropagation()}>
                    <LabeledSwitch
                      id="artifacts-mermaid"
                      label="Diagrams"
                      checked={mermaid}
                      onCheckedChange={(value) => {
                        chromeStorage.setStorageValue({
                          key: 'artifacts',
                          value: {
                            ...useGlobalStore.getState().artifacts,
                            mermaid: value,
                          },
                        });

                        useGlobalStore.setState({
                          artifacts: { mermaid: value },
                        });
                      }}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="tw-flex tw-flex-col tw-gap-2">
                  <p>
                    Powered by{' '}
                    <a
                      className="tw-text-accent-foreground tw-font-bold tw-underline"
                      href="https://mermaid.js.org"
                      target="_blank"
                    >
                      mermaid
                    </a>
                    . Syntaxes and the full list of supported diagrams can be
                    find{' '}
                    <a
                      className="tw-font-bold tw-underline"
                      href="https://mermaid.js.org/syntax/flowchart.html"
                      target="_blank"
                    >
                      here
                    </a>
                    .
                  </p>
                  <div className="tw-flex tw-gap-1 tw-items-center">
                    <Info className="tw-w-3 tw-h-3" /> How to use?
                  </div>
                  <p>
                    Use AI Profile, Collection Prompt, or explicitly tell the AI
                    to
                    <span className="tw-p-1 tw-px-2 tw-border tw-border-border tw-bg-secondary tw-text-secondary-foreground tw-rounded-md tw-mx-1">
                      draw a diagram by using "mermaid".
                    </span>
                    <br />
                    Work best with{' '}
                    <span className="tw-font-bold">Claude Sonnet 3.5</span>.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </>
      )}
    </div>
  );
}
