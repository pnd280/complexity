import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import $ from 'jquery';

import useRouter from '@/components/hooks/useRouter';
import DOMObserver from '@/utils/dom-observer';
import { rewritePreBlock } from '@/utils/markdown-block';
import { isDOMNode } from '@/utils/utils';

import { MarkdownBlockContainer } from '../MarkdownBlock/MarkdownBlockHeader';
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
  const { url } = useRouter();
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

  const { messagesContainer, isWaiting } = useWaitForMessagesContainer();

  useEffect(() => {
    if (!isDOMNode(messagesContainer) || !$(messagesContainer).length) return;

    requestAnimationFrame(callback);

    const id = 'markdown-block-observer';

    DOMObserver.create(id, {
      target: messagesContainer,
      config: { childList: true, subtree: true },
      priority: 1,
      throttleTime: 200,
      useRAF: true,
      onAny: callback,
    });

    function callback() {
      const $preElements = $(`.message-block pre`);
      const newContainers: MarkdownBlockContainer[] = [];

      $preElements.each((index, pre) => {
        queueMicrotask(() => {
          const result = rewritePreBlock(pre);
          const { $container, lang } = result || {};

          if ($container?.length) {
            newContainers.push({
              header: $container[0],
              preElement: pre,
              lang: lang || '',
              isNative: true,
              id: pre.id,
            });
          }

          if (index === $preElements.length - 1) {
            updateContainers(newContainers);
          }
        });
      });
    }
  }, [url, updateContainers, isWaiting, messagesContainer]);
}
