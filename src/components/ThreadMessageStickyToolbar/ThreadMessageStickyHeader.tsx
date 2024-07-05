import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
import { debounce } from 'lodash-es';
import {
  Updater,
  useImmer,
} from 'use-immer';

import DOMObserver from '@/utils/dom-observer';
import observer from '@/utils/observer';
import { ui } from '@/utils/ui';
import { useDebounce } from '@uidotdev/usehooks';

import useRouter from '../hooks/useRouter';
import useWaitForMessagesContainer from '../hooks/useWaitForMessagesContainer';
import ThreadMessageToolbar from './ThreadMessageToolbar';

export type Container = {
  messageBlock: Element;
  query: Element;
  container: Element;
  answer: Element;
};

export type ContainerStates = {
  isMarkdown: boolean;
  isQueryOutOfViewport: boolean;
  isHidden: boolean;
};

const compare = (prev: Container[], next: Container[]): boolean => {
  if (prev.length !== next.length) return false;
  for (let i = prev.length - 1; i >= 0; i--) {
    if (
      prev[i].messageBlock !== next[i].messageBlock ||
      prev[i].query !== next[i].query ||
      prev[i].container !== next[i].container ||
      prev[i].answer !== next[i].answer
    ) {
      return false;
    }
  }
  return true;
};

export default function ThreadMessageStickyHeader() {
  const url = useRouter();

  const [containers, setContainers] = useState<Container[]>([]);
  const containersRef = useRef<Container[]>([]);

  const [containersStates, setContainersStates] = useImmer<ContainerStates[]>(
    []
  );

  const debouncedContainers = useDebounce(containers, 200);

  const updateContainers = useCallback(
    (newContainers: Container[]) => {
      if (!compare(containersRef.current, newContainers)) {
        containersRef.current = newContainers;
        setContainers(newContainers);

        setContainersStates((draft) => {
          draft.splice(newContainers.length);

          newContainers.forEach((_, index) => {
            if (!draft[index]) {
              draft[index] = {
                isMarkdown: true,
                isQueryOutOfViewport: false,
                isHidden: true,
              };
            }
          });
        });
      }
    },
    [setContainers, setContainersStates]
  );

  const toggleVisibility = useCallback(
    ({
      bottomButtonBar,
      index,
      messageBlock,
    }: {
      bottomButtonBar: Element;
      index: number;
      messageBlock: Element;
    }) => {
      const hide = !messageBlock.contains(bottomButtonBar);

      if (containersStates[index]?.isHidden === hide) return;

      if (!hide) {
        $(messageBlock).css(
          '--markdownBlockToolbarTop',
          (ui.getStickyHeader()?.outerHeight() || 3.35 * 16) + 3.1 * 16 + 'px'
        );
      }

      setContainersStates((draft) => {
        if (draft[index]) draft[index].isHidden = hide;
      });
    },
    [containersStates, setContainersStates]
  );

  const { messagesContainer, isWaiting } = useWaitForMessagesContainer();

  useEffect(() => {
    if (isWaiting || !messagesContainer) return;

    callback();

    DOMObserver.create('toggle-thread-message-sticky-toolbar-visibility', {
      target: messagesContainer,
      config: { childList: true, subtree: true },
      debounceTime: 200,
      useRAF: true,
      onAny: callback,
    });

    function callback() {
      const $messageBlocks = ui.getMessageBlocks();

      const newContainers: Container[] = [];

      function processNextMessageBlock(index: number = 0) {
        if (index >= $messageBlocks.length) {
          updateContainers(newContainers);
          return;
        }

        $($messageBlocks[index].$query[0]).addClass('tw-relative');

        let $container = $messageBlocks[index].$messageBlock.find(
          '.thread-message-toolbar-container'
        );

        if (!$container.length) {
          $container = $('<div>')
            .addClass(
              'thread-message-toolbar-container tw-sticky tw-w-full tw-z-[11] tw-mt-4 !tw-h-[3.125rem]'
            )
            .css({
              top:
                (ui.getStickyHeader().find('>*')?.outerHeight() || 3.35 * 16) +
                'px',
            });

          $($messageBlocks[index].$query[0]).before($container);
        }

        newContainers.push({
          container: $container[0],
          query: $messageBlocks[index].$query[0],
          messageBlock: $messageBlocks[index].$messageBlock[0],
          answer: $messageBlocks[index].$answer[0],
        });

        toggleVisibility({
          bottomButtonBar: $messageBlocks[index].$messageBlock.find(
            '.mt-sm.flex.items-center.justify-between'
          )[0],
          index,
          messageBlock: $messageBlocks[index].$messageBlock[0],
        });

        queueMicrotask(() => processNextMessageBlock(index + 1));
      }

      processNextMessageBlock();
    }

    return () => {
      DOMObserver.destroy('toggle-thread-message-sticky-toolbar-visibility');
    };
  }, [url, toggleVisibility, updateContainers, messagesContainer, isWaiting]);

  useScrollDirection(debouncedContainers, setContainersStates);

  const renderToolbar = useCallback(
    (container: Container, index: number) => (
      <Fragment key={index}>
        {containers[index] &&
          ReactDOM.createPortal(
            <ThreadMessageToolbar
              containers={containers}
              containersStates={containersStates}
              containerIndex={index}
              setContainersStates={setContainersStates}
            />,
            container.container
          )}
      </Fragment>
    ),
    [containers, containersStates, setContainersStates]
  );

  return debouncedContainers.map(renderToolbar);
}

const useScrollDirection = (
  containers: Container[],
  setContainersStates: Updater<ContainerStates[]>
) => {
  const url = useRouter();

  const stickyNavHeight = useMemo(
    () => ui.getStickyHeader()?.outerHeight() || 3 * 16,
    []
  );

  const handleScrollDirectionChange = useCallback(() => {
    setContainersStates((draft) => {
      draft.forEach((_, index) => {
        if (containers[index]?.query) {
          draft[index].isQueryOutOfViewport =
            containers[index]?.query.getBoundingClientRect().top +
              containers[index]?.query.getBoundingClientRect().height <
            -20;
        }
      });
    });
  }, [containers, setContainersStates]);

  useEffect(() => {
    const debouncedHandleScrollDirectionChange = debounce(
      handleScrollDirectionChange,
      100
    );

    const stopObserving = observer.onScrollDirectionChange({
      up: () => debouncedHandleScrollDirectionChange(),
      down: () => debouncedHandleScrollDirectionChange(),
      identifier: 'threadMessageStickyHeader',
    });

    requestIdleCallback(() => debouncedHandleScrollDirectionChange());

    return () => {
      stopObserving();
    };
  }, [
    url,
    containers,
    stickyNavHeight,
    setContainersStates,
    handleScrollDirectionChange,
  ]);
};
