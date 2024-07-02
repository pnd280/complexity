import '@/utils/prismjs-components/prism-vscode.css';

import {
  Fragment,
  useCallback,
  useEffect,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
import { X } from 'lucide-react';
import { useImmer } from 'use-immer';

import {
  scrollToElement,
  stripHtml,
} from '@/utils/utils';
import {
  useDebounce,
  useToggle,
} from '@uidotdev/usehooks';

import DiffViewDialog from '../DiffViewDialog';
import useMarkdownBlockObserver from '../hooks/useMarkdownBlockObserver';
import MarkdownBlockToolbar from './MarkdownBlockToolbar';

export type MarkdownBlockContainer = {
  header: Element;
  preElement: Element;
  lang: string;
  isNative: boolean;
  id: string;
};

export type MarkdownBlockStates = {
  isCopied: boolean;
};

export default function MarkdownBlockHeader() {
  const [containers, setContainers] = useState<MarkdownBlockContainer[]>([]);
  const debouncedContainers = useDebounce(containers, 200);

  const [diffViewerOpen, toggleDiffViewerVis] = useToggle(false);
  const [diffTexts, setDiffTexts] = useImmer<number[]>([]);

  useMarkdownBlockObserver({
    setContainers,
  });

  const handleSelectForCompare = useCallback(
    (blockIndex: number) => {
      if (diffTexts.length === 2) {
        setDiffTexts([]);
        return;
      }

      setDiffTexts((draft) => {
        if (draft.includes(blockIndex)) {
          draft.splice(draft.indexOf(blockIndex), 1);
        } else {
          draft.push(blockIndex);
        }
      });
    },
    [diffTexts.length, setDiffTexts]
  );

  const extractTextFromBlock = (blockIndex: number) => {
    const code = stripHtml(
      $(containers[blockIndex]?.preElement)?.find('code:first').html()
    );

    return code;
  };

  useEffect(() => {
    if (diffTexts.length === 2) {
      toggleDiffViewerVis(true);
    }
  }, [diffTexts, toggleDiffViewerVis]);

  return (
    <>
      {debouncedContainers.map((container, index) => (
        <Fragment key={index}>
          {ReactDOM.createPortal(
            <>
              <MarkdownBlockToolbar
                lang={container.lang}
                preElementId={container.id}
                index={index}
                handleSelectForCompare={handleSelectForCompare}
                isSelectedForComparison={diffTexts.includes(index)}
              />
            </>,
            container.header
          )}
        </Fragment>
      ))}

      <DiffViewDialog
        oldText={extractTextFromBlock(diffTexts[0])}
        newText={extractTextFromBlock(diffTexts[1])}
        open={diffViewerOpen}
        toggleOpen={(open) => {
          setDiffTexts([]);
          return toggleDiffViewerVis(open);
        }}
        lang={containers[diffTexts[0]]?.lang ?? containers[diffTexts[1]]?.lang}
      />

      {!diffViewerOpen &&
        diffTexts.length === 1 &&
        ReactDOM.createPortal(
          <div className="tw-fixed tw-bottom-[10rem] tw-left-1/2 -tw-translate-x-1/2 tw-z-10">
            <div
              className="tw-bg-secondary tw-border tw-rounded-md tw-p-1 tw-px-2 tw-animate-in tw-slide-in-from-bottom tw-fade-in tw-select-none tw-flex tw-items-center tw-gap-1 active:tw-scale-95 tw-transition-all tw-duration-300 tw-shadow-lg tw-font-sans"
              onClick={() => {
                const preElement = containers[diffTexts[0]].preElement;

                scrollToElement($(preElement), -70);
              }}
            >
              <X
                className="tw-w-4 tw-h-4 tw-cursor-pointer tw-text-muted-foreground dark:tw-text-muted hover:!tw-text-foreground tw-transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  return setDiffTexts([]);
                }}
              />
              <span>Select another block to compare</span>
            </div>
          </div>,
          $('#complexity-root')[0]
        )}
    </>
  );
}
