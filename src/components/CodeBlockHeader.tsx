import '../utils/prismjs-components/prism-vscode.css';

import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
import {
  Copy,
  X,
} from 'lucide-react';
import Prism from 'prismjs';
import { useImmer } from 'use-immer';

import { Nullable } from '@/types/Utils';
import { updateLineCount } from '@/utils/code-block';
import observer from '@/utils/observer';
import prismJs from '@/utils/prism';
import { ui } from '@/utils/ui';
import {
  scrollToElement,
  stripHtml,
  whereAmI,
} from '@/utils/utils';
import { useToggle } from '@uidotdev/usehooks';

import CodeBlockHeader from './CodeBlockToolbar';
import DiffViewDialog from './DiffViewDialog';
import useElementObserver from './hooks/useElementObserver';

export default function CodeBlockEnhancedToolbar() {
  const [containers, setContainers] = useImmer<
    {
      header: Element;
      preElement: Element;
      lang: string;
      lineCount: number;
      lineCountObserving: boolean;
      isNative: boolean;
    }[]
  >([]);

  const [diffViewerOpen, toggleDiffViewerVis] = useToggle(false);
  const [diffTexts, setDiffTexts] = useImmer<number[]>([]);
  const idleCopyButtonText = <Copy className="tw-w-4 tw-h-4" />;
  const [buttonTextStates, setButtonTextStates] = useImmer<ReactNode[]>([]);
  const [blockStates, setBlockStates] = useImmer<
    {
      isCollapsed: boolean;
      isCopied: boolean;
      isWrapped: boolean;
      isShownLineNumbers: boolean;
    }[]
  >([]);

  const rewritePreBlock = useCallback(
    (
      pre: Element
    ): Nullable<{
      $container: JQuery<HTMLElement>;
      lang: string;
      isNative: boolean;
    }> => {
      if (!pre) return null;

      if (!$(pre).parent('#markdown-query-wrapper').length) {
        const $parent = $(pre).parent();
        const lang = $(pre).find('.absolute').text();

        if (!$(pre).find('code:first').hasClass(`language-${lang}`)) {
          $(pre)
            .find('code:first')
            .addClass(`${lang} language-${lang} !tw-whitespace-pre`);
        }

        $parent.addClass(
          'tw-my-4 tw-relative tw-bg-[#1d1f21] tw-rounded-md tw-border tw-border-border'
        );
        $(pre).addClass('!tw-m-0 !tw-rounded-none !tw-rounded-b-md');
        $(pre).find('.absolute').hide();
        $(pre).find('button').hide();
        $(pre)
          .find('div:nth-child(2)')[0]
          ?.style.setProperty('padding-top', '0', 'important');
        $(pre)
          .find('div:nth-child(2)')
          .addClass('tw-rounded-none tw-rounded-b-md !tw-p-0');
        $(pre).find('code:first').addClass('!tw-px-3');

        const $container = $('<div>').addClass(
          'tw-sticky tw-top-[var(--codeBlockTop)] tw-bottom-[4rem] tw-w-full tw-z-[1] tw-rounded-t-md tw-overflow-hidden tw-transition-all tw-border-b tw-border-border'
        );

        $parent.prepend($container);

        return { $container, lang, isNative: true };
      } else {
        $(pre).addClass(
          '!tw-rounded-none !tw-m-0 !tw-px-[.7rem] !tw-py-2 !tw-rounded-b-md'
        );

        $(pre).find('code:first').addClass('!tw-p-0');

        const lang =
          $(pre)
            .find('code:first')
            .attr('class')
            ?.match(/language-(\w+)/)?.[1] ?? '';

        const $wrapper = $('<div>').addClass(
          'tw-rounded-md tw-relative tw-bg-[#1d1f21] tw-rounded-md tw-border tw-border-border'
        );

        $(pre).before($wrapper);

        $wrapper.append(pre);

        const $container = $('<div>').addClass(
          'tw-sticky tw-top-[var(--codeBlockTop)] tw-bottom-[4rem] tw-w-full tw-z-[2] tw-rounded-t-md tw-overflow-hidden tw-transition-all tw-border-b tw-border-border'
        );

        $wrapper.prepend($container);

        return { $container, lang, isNative: false };
      }
    },
    []
  );

  useElementObserver({
    selector: () => {
      const messageBlocks = ui.getMessageBlocks();

      const pres = messageBlocks.map((el) =>
        el.$messageBlock.find('pre').toArray()
      );

      const numberedPres: {
        element: Element;
        args: { container: Element; nativeToolbar: () => JQuery<Element> };
      }[] = [];

      pres.forEach((preBlock, blockIndex) =>
        preBlock.map((pre) =>
          numberedPres.push({
            element: pre,
            args: {
              container: messageBlocks[blockIndex].$messageBlock[0],
              nativeToolbar: () =>
                messageBlocks[blockIndex].$messageBlock.find(
                  '.mt-sm.flex.items-center.justify-between'
                ),
            },
          })
        )
      );

      return numberedPres;
    },
    callback: async ({ element: pre, args }) => {
      if (whereAmI() !== 'thread') return null;

      const { $container, lang, isNative } = rewritePreBlock(pre) ?? {};

      if (!$container) return null;

      if (lang && prismJs.isLangSupported(lang)) {
        try {
          await prismJs.importComponent(lang);

          if (isNative) {
            observer.onElementExist({
              container: args!.container,
              selector: () => [args!.nativeToolbar()[0]],
              callback: () => {
                Prism.highlightAllUnder(pre);
              },
              recurring: false,
            });
          } else {
            Prism.highlightAllUnder(pre);
          }
        } catch (err) {
          console.error(
            `Failed to load Prism language component for ${lang}`,
            err
          );
        }
      }

      setContainers((draft) => [
        ...draft,
        {
          header: $container[0],
          preElement: pre,
          lang,
          lineCount: -1,
        },
      ]);

      setButtonTextStates((draft) => {
        draft.push(idleCopyButtonText);
      });

      setBlockStates((draft) => {
        draft.push({
          isCollapsed: false,
          isCopied: false,
          isWrapped: false,
          isShownLineNumbers: false,
        });
      });
    },
    observedIdentifier: 'alternate-code-block',
  });

  useEffect(() => {
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
  }, [containers, setContainers]);

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

  return (
    <>
      {containers.map((container, index) => (
        <Fragment key={index}>
          {ReactDOM.createPortal(
            <CodeBlockHeader
              container={container}
              index={index}
              blockStates={blockStates}
              setBlockStates={setBlockStates}
              buttonTextStates={buttonTextStates}
              setButtonTextStates={setButtonTextStates}
              handleSelectForCompare={handleSelectForCompare}
              diffTexts={diffTexts}
              idleCopyButtonText={idleCopyButtonText}
            />,
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
