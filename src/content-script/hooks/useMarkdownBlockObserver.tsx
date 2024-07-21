import $ from 'jquery';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { MarkdownBlockContainer } from '@/content-script/components/AlternateMarkdownBlock/AlternateMarkdownBlock';
import { shikiContentScript } from '@/content-script/main-world/shiki';
import DOMObserver from '@/utils/DOMObserver';
import MarkdownBlockUtils from '@/utils/MarkdownBlock';
import UIUtils from '@/utils/UI';
import { isDOMNode } from '@/utils/utils';

import useWaitForMessagesContainer from './useWaitForMessagesContainer';

type useMarkdownBlockObserverProps = {
  setContainers: Dispatch<SetStateAction<MarkdownBlockContainer[]>>;
};

const compare = (
  prev: MarkdownBlockContainer[],
  next: MarkdownBlockContainer[]
): boolean => {
  if (prev.length !== next.length) return false;
  for (let i = prev.length - 1; i >= 0; i--) {
    if (
      prev[i].id !== next[i].id ||
      prev[i].lang !== next[i].lang ||
      prev[i].isNative !== next[i].isNative
    ) {
      return false;
    }
  }
  return true;
};

export default function useMarkdownBlockObserver({
  setContainers,
}: useMarkdownBlockObserverProps) {
  const containersRef = useRef<MarkdownBlockContainer[]>([]);

  const updateContainers = useCallback(
    (newContainers: MarkdownBlockContainer[]) => {
      if (!compare(containersRef.current, newContainers)) {
        containersRef.current = newContainers;
        setContainers(newContainers);
      }
    },
    [setContainers]
  );

  const { messagesContainer } = useWaitForMessagesContainer();

  useEffect(
    function toolbarObserver() {
      if (!isDOMNode(messagesContainer) || !$(messagesContainer).length) return;

      requestAnimationFrame(callback);

      const id = 'markdown-block-toolbar';

      DOMObserver.create(id, {
        target: messagesContainer,
        config: { childList: true, subtree: true },
        throttleTime: 200,
        source: 'hook',
        onAny: callback,
      });

      function callback() {
        const $messageBlocks = $(`.message-block`);

        const promises: Promise<MarkdownBlockContainer | null>[] = [];

        $messageBlocks.each((_, messageBlock) => {
          $(messageBlock)
            .find('pre')
            .each((_, pre) => {
              promises.push(
                new Promise<MarkdownBlockContainer | null>((resolve) => {
                  queueMicrotask(() => {
                    const { $wrapper, $container, lang } =
                      MarkdownBlockUtils.transformPreBlock(pre) || {};

                    if (!$container?.length || !$wrapper?.length || !lang)
                      return resolve(null);

                    resolve({
                      wrapper: $wrapper[0],
                      header: $container[0],
                      preElement: pre,
                      lang: lang || '',
                      isNative: true,
                      id: pre.id,
                    });
                  });
                })
              );
            });
        });

        Promise.all(promises).then((results) => {
          const newContainers = results.filter(
            (result): result is MarkdownBlockContainer => result !== null
          );

          updateContainers(newContainers);
        });
      }

      return () => {
        DOMObserver.destroy(id);
      };
    },
    [updateContainers, messagesContainer]
  );

  useEffect(
    function alternateMarkdownBlockObservers() {
      if (!isDOMNode(messagesContainer) || !$(messagesContainer).length) return;

      const id = 'alternate-markdown-block';

      (async () => {
        await shikiContentScript.waitForInitialization();

        requestIdleCallback(callback);

        DOMObserver.create(id, {
          target: messagesContainer,
          config: {
            childList: true,
            subtree: true,
          },
          throttleTime: 200,
          source: 'hook',
          onAny: callback,
        });
      })();

      function callback() {
        const messageBlocks = UIUtils.getMessageBlocks();

        messageBlocks.forEach(({ $messageBlock }) => {
          queueMicrotask(() => {
            const $codeBlocks = $messageBlock.find('pre');

            $codeBlocks.each((_, pre) => {
              queueMicrotask(async () => {
                MarkdownBlockUtils.handleVisibility(pre);

                if (!$(pre).attr('id')) return;

                const isInFlight =
                  await MarkdownBlockUtils.handleInFlightState(pre);

                if (!isInFlight)
                  MarkdownBlockUtils.highlightNativelyUnsupportedLang(pre);
              });
            });
          });
        });
      }

      return () => {
        DOMObserver.destroy(id);
      };
    },
    [messagesContainer]
  );
}
