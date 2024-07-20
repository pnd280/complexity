import $ from 'jquery';
import { useEffect } from 'react';

import {
  Container,
  ToggleToolbarVisibilityProps,
} from '@/content-script/components/ThreadMessageStickyToolbar/ThreadMessageStickyToolbar';
import DOMObserver from '@/utils/DOMObserver';
import UIUtils from '@/utils/UI';
import { isDOMNode, markdown2Html } from '@/utils/utils';

import useWaitForMessagesContainer from './useWaitForMessagesContainer';

type UseThreadMessageStickyToolbarObserverProps = {
  toggleVisibility: (args: ToggleToolbarVisibilityProps) => void;
  updateContainers: (newContainers: Container[]) => void;
};

export default function useThreadMessageStickyToolbarObserver({
  toggleVisibility,
  updateContainers,
}: UseThreadMessageStickyToolbarObserverProps) {
  const { messagesContainer } = useWaitForMessagesContainer();

  useEffect(
    function toolbarObserver() {
      if (!isDOMNode(messagesContainer) || !$(messagesContainer).length) return;

      requestAnimationFrame(callback);

      const id = 'thread-message-sticky-toolbar';

      DOMObserver.create(id, {
        target: messagesContainer,
        config: { childList: true, subtree: true },
        debounceTime: 200,
        source: 'hook',
        onAny: callback,
      });

      function callback() {
        const newContainers: Container[] = [];

        const $messageBlocks = UIUtils.getMessageBlocks();

        $messageBlocks.forEach(({ $query, $messageBlock, $answer }, index) => {
          queueMicrotask(() => {
            $($query[0]).addClass('tw-relative');

            let $container = $messageBlock.find(
              '.thread-message-toolbar-container'
            );

            if (!$container.length) {
              $container = $('<div>').addClass(
                'thread-message-toolbar-container tw-sticky tw-top-[3.35rem] tw-w-full tw-z-[11] tw-mt-4 !tw-h-[3.125rem]'
              );
              $($query[0]).before($container);
            }

            newContainers.push({
              container: $container[0],
              query: $query[0],
              messageBlock: $messageBlock[0],
              answer: $answer[0],
            });

            toggleVisibility({
              bottomButtonBar: $messageBlock.find(
                '.mt-sm.flex.items-center.justify-between'
              )[0],
              index,
              messageBlock: $messageBlock[0],
            });

            if (index === $messageBlocks.length - 1) {
              updateContainers(newContainers);
            }
          });
        });
      }

      return () => {
        DOMObserver.destroy(id);
      };
    },
    [messagesContainer, toggleVisibility, updateContainers]
  );

  useEffect(
    // TODO: directly access the model badge from react fiber node
    function modelBadgeObserver() {
      if (!isDOMNode(messagesContainer) || !$(messagesContainer).length) return;

      const id = 'display-model-next-to-answer-heading';

      requestIdleCallback(callback);

      DOMObserver.create(id, {
        target: messagesContainer,
        config: {
          childList: true,
          subtree: true,
        },
        debounceTime: 200,
        source: 'hook',
        onAny: callback,
      });

      async function callback() {
        $(
          `.message-block .mt-sm.flex.items-center.justify-between>*:last-child:not([data-${id}-observed])`
        ).each((_, element) => {
          $(element).attr(`data-${id}-observed`, 'true');

          const messageBlock = element.closest('.message-block');

          if (!messageBlock) return;

          const { $answerHeading, $messageBlock } = UIUtils.parseMessageBlock(
            $(messageBlock)
          );

          const $bottomButtonBar = $messageBlock.find(
            '.mt-sm.flex.items-center.justify-between'
          );

          if (!$bottomButtonBar.length) return;

          const bottomRightButtonBar = $bottomButtonBar.children().last();

          const modelName =
            bottomRightButtonBar.children().last().text() || 'CLAUDE 3 HAIKU';

          $answerHeading
            .find('div:contains("Answer"):last')
            .text(modelName.toUpperCase())
            .addClass(
              '!tw-font-mono !tw-text-xs tw-p-1 tw-px-2 tw-rounded-md tw-border tw-border-border tw-animate-in tw-fade-in tw-slide-in-from-right'
            );
        });
      }

      return () => {
        DOMObserver.destroy(id);
      };
    },
    [messagesContainer]
  );

  useEffect(
    function markdownQueryObserver() {
      if (!isDOMNode(messagesContainer) || !$(messagesContainer).length) return;

      const id = 'alter-message-query';

      DOMObserver.create(id, {
        target: messagesContainer,
        config: {
          childList: true,
          subtree: true,
        },
        debounceTime: 200,
        source: 'hook',
        onAny: callback,
      });

      async function callback() {
        const $messageBlocks = $(`.message-block:not([data-${id}])`);

        $messageBlocks.each((_, messageBlock) => {
          queueMicrotask(() => {
            const $messageBlock = $(messageBlock);
            $messageBlock.attr(`data-${id}`, '');

            const $query = $messageBlock.find('.my-md.md\\:my-lg');

            rewriteQuery({ $query });
          });
        });
      }

      async function rewriteQuery({ $query }: { $query: JQuery<Element> }) {
        const mardownedText = markdown2Html($query.text());

        const $newQueryWrapper = $('<div>')
          .html(mardownedText)
          .attr('id', 'markdown-query-wrapper')
          .addClass(
            $query.find('>*:not(#markdown-query-wrapper)').attr('class') || ''
          );

        $query.append($newQueryWrapper);
      }

      return () => {
        DOMObserver.destroy(id);
      };
    },
    [messagesContainer]
  );
}
