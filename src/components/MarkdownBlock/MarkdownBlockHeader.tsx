import '@/utils/prismjs-components/prism-vscode.css';

import {
  Fragment,
  lazy,
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
import {
  Copy,
  X,
} from 'lucide-react';
import { useImmer } from 'use-immer';

import { updateLineCount } from '@/utils/markdown-block';
import observer from '@/utils/observer';
import {
  scrollToElement,
  stripHtml,
} from '@/utils/utils';
import { useToggle } from '@uidotdev/usehooks';

import DiffViewDialog from '../DiffViewDialog';
import useArtifactsSettings from './Artifacts/hooks/useArtifactsSettings';
import useMarkdownBlockObserver
  from './Artifacts/hooks/useMarkdownBlockObserver';
import MarkdownBlockToolbar from './MarkdownBlockToolbar';

const MermaidDiagram = lazy(() => import('./Artifacts/MermaidDiagram'));

export type MarkdownBlockContainer = {
  header: Element;
  preElement: Element;
  lang: string;
  lineCount: number;
  lineCountObserving: boolean;
  isNative: boolean;
};

export type MarkdownBlockStates = {
  isCollapsed: boolean;
  isCopied: boolean;
  isWrapped: boolean;
  isShownLineNumbers: boolean;
  isArtifact: boolean;
};

export default function MarkdownBlockHeader() {
  const [containers, setContainers] = useImmer<MarkdownBlockContainer[]>([]);
  const [diffViewerOpen, toggleDiffViewerVis] = useToggle(false);
  const [diffTexts, setDiffTexts] = useImmer<number[]>([]);
  const [buttonTextStates, setButtonTextStates] = useImmer<ReactNode[]>([]);
  const [blocksStates, setBlocksStates] = useImmer<MarkdownBlockStates[]>([]);
  const [mermaidWrappers, setMermaidWrappers] = useState<Element[]>([]);
  const idleCopyButtonText = <Copy className="tw-w-4 tw-h-4" />;

  useMarkdownBlockObserver({
    idleCopyButtonText,
    setBlocksStates,
    setButtonTextStates,
    setContainers,
    setMermaidWrappers,
  });

  useEffect(
    function updateLineCountEffect() {
      containers.forEach((container, index) => {
        if (container.lineCountObserving) return;

        updateLineCount(container.preElement, index, setContainers);

        observer.onDOMChanges({
          targetNode: $(container.preElement).find('code:first')[0],
          callback: () => {
            updateLineCount(container.preElement, index, setContainers);
          },
        });

        setContainers((draft) => {
          draft[index].lineCountObserving = true;
        });
      });
    },
    [containers, setContainers]
  );

  const handleSelectForCompare = (blockIndex: number) => {
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
  };

  const extractTextFromBlock = (blockIndex: number) => {
    const code = stripHtml(
      $(containers[blockIndex]?.preElement)?.find('code').html()
    );

    return code;
  };

  useEffect(() => {
    if (diffTexts.length === 2) {
      toggleDiffViewerVis(true);
    }
  }, [diffTexts, toggleDiffViewerVis]);

  const artifactsSettings = useArtifactsSettings();

  const renderMermaid = useCallback(
    (pre: Element, index: number) => {
      if (!artifactsSettings || !artifactsSettings.mermaid) return;

      const $container = $(pre)
        .closest('.markdown-block-wrapper')
        .nextUntil('.artifact-wrapper')
        .next();

      $container.addClass(`mermaid-wrapper-${index}`);

      if (!$container.length) return;

      return ReactDOM.createPortal(
        <Suspense fallback={null}>
          <MermaidDiagram
            key={index}
            code={stripHtml($(pre).find('code:first').html())}
            pre={pre}
            containerIndex={index}
            blockStates={blocksStates[index]}
            setBlocksStates={setBlocksStates}
          />
        </Suspense>,
        $container[0]
      );
    },
    [artifactsSettings, blocksStates, setBlocksStates]
  );

  return (
    <>
      {artifactsSettings &&
        artifactsSettings.mermaid &&
        mermaidWrappers.map(renderMermaid)}
      {containers.map((container, index) => (
        <Fragment key={index}>
          {ReactDOM.createPortal(
            <>
              <MarkdownBlockToolbar
                container={container}
                index={index}
                blocksStates={blocksStates}
                setBlocksStates={setBlocksStates}
                buttonTextStates={buttonTextStates}
                setButtonTextStates={setButtonTextStates}
                handleSelectForCompare={handleSelectForCompare}
                diffTexts={diffTexts}
                idleCopyButtonText={idleCopyButtonText}
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
        lang={containers[diffTexts[0]]?.lang}
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
