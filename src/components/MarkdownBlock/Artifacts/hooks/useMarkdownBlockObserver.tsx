import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
} from 'react';

import $ from 'jquery';
import Prism from 'prismjs';
import { Updater } from 'use-immer';

import useElementObserver from '@/components/hooks/useElementObserver';
import { useGlobalStore } from '@/content-script/session-store/global';
import { Nullable } from '@/types/Utils';
import observer from '@/utils/observer';
import prismJs from '@/utils/prism';
import { ui } from '@/utils/ui';
import { whereAmI } from '@/utils/utils';

import {
  MarkdownBlockContainer,
  MarkdownBlockStates,
} from '../../MarkdownBlockHeader';

type useMarkdownBlockObserverProps = {
  idleCopyButtonText: ReactNode;
  setContainers: Updater<MarkdownBlockContainer[]>;
  setButtonTextStates: Updater<ReactNode[]>;
  setBlockStates: Updater<MarkdownBlockStates[]>;
  setMermaidWrappers: Dispatch<SetStateAction<Element[]>>;
};

export default function useMarkdownBlockObserver({
  idleCopyButtonText,
  setBlockStates,
  setButtonTextStates,
  setContainers,
  setMermaidWrappers,
}: useMarkdownBlockObserverProps) {
  const mermaidEnabled = useGlobalStore((state) => state.artifacts.mermaid);

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
          'tw-my-4 tw-relative tw-bg-[#1d1f21] tw-rounded-md tw-border tw-border-border markdown-block-wapper'
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

        if (!lang) {
          $(pre)
            .find('code:first')
            .addClass('!tw-whitespace-pre-wrap !tw-break-words');
        }

        if (lang === 'mermaid' && mermaidEnabled) {
          const $wrapper = $('<div>').addClass('mermaid-wrapper');

          $(pre).closest('.markdown-block-wapper').after($wrapper);
        }

        const $container = $('<div>').addClass(
          'tw-sticky tw-top-[var(--markdownBlockTop)] tw-bottom-[4rem] tw-w-full tw-z-[1] tw-rounded-t-md tw-overflow-hidden tw-transition-all tw-border-b tw-border-border'
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

        if (!lang) {
          $(pre)
            .find('code:first')
            .addClass('!tw-whitespace-pre-wrap !tw-break-words');
        }

        const $wrapper = $('<div>').addClass(
          'tw-rounded-md tw-relative tw-bg-[#1d1f21] tw-rounded-md tw-border tw-border-border'
        );

        $(pre).before($wrapper);

        $wrapper.append(pre);

        const $container = $('<div>').addClass(
          'tw-sticky tw-top-[var(--markdownBlockTop)] tw-bottom-[4rem] tw-w-full tw-z-[2] tw-rounded-t-md tw-overflow-hidden tw-transition-all tw-border-b tw-border-border'
        );

        $wrapper.prepend($container);

        return { $container, lang, isNative: false };
      }
    },
    [mermaidEnabled]
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
              callback: async () => {
                Prism.highlightAllUnder(pre);

                if (lang === 'mermaid' && mermaidEnabled) {
                  setMermaidWrappers((prev) => {
                    const draft = prev.filter((el) =>
                      document.body.contains(el)
                    );

                    if (prev.includes(pre)) return draft;

                    draft.push(pre);

                    return draft;
                  });
                }
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
          isWrapped: lang ? false : true,
          isShownLineNumbers: false,
        });
      });
    },
    observedIdentifier: 'alternate-markdown-block',
  });
}
