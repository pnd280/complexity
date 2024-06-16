import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
import { debounce } from 'lodash';
import {
  Updater,
  useImmer,
} from 'use-immer';

import observer from '@/utils/observer';
import { ui } from '@/utils/ui';
import { whereAmI } from '@/utils/utils';
import { useDebounce } from '@uidotdev/usehooks';

import useElementObserver from '../hooks/useElementObserver';
import ThreadMessageToolbar from './ThreadMessageToolbar';

export type Container = {
  messageBlock: Element;
  query: Element;
  container: Element;
  answer: Element;
  states: {
    isMarkdown: boolean;
    isEditing: boolean;
    isCollapsed: boolean;
    isQueryOutOfViewport: boolean;
    isHidden: boolean;
  };
  isObserving?: boolean;
};

export default function ThreadMessageStickyToolbar() {
  const [containers, setContainers] = useImmer<Container[]>([]);

  const debouncedContainers = useDebounce(containers, 100);

  const showHideHeader = useCallback(
    ({
      element,
      index,
      messageBlock,
    }: {
      element: Element;
      index: number;
      messageBlock: Element;
    }) => {
      if (document.body.contains(element)) {
        $(messageBlock).css(
          '--codeBlockTop',
          (ui.getStickyHeader()?.outerHeight() || 3.35 * 16) + 3.1 * 16 + 'px'
        );

        return setContainers((draft) => {
          if (draft[index] && draft[index].states.isHidden) {
            draft[index].states.isHidden = false;
          }
        });
      }
    },
    [setContainers]
  );

  useEffect(() => {
    containers.forEach((container, index) => {
      if (!container.isObserving) {
        observer.onElementExist({
          container: container.messageBlock,
          selector: () => [
            {
              element: $(container.messageBlock).find(
                '.mt-sm.flex.items-center.justify-between'
              )[0],
              args: {
                messageBlock: container.messageBlock,
              },
            },
          ],
          callback: ({ element, args }) => {
            showHideHeader({
              element,
              index,
              messageBlock: args!.messageBlock,
            });
          },
          observedIdentifier: 'show-thread-message-toolbar',
        });

        observer.onElementRemoved({
          selector: container.messageBlock,
          callback: () => {
            setContainers((draft) => {
              draft.splice(index, 1);
            });
          },
        });

        setContainers((draft) => {
          draft[index].isObserving = true;
        });
      }
    });
  }, [containers, setContainers, showHideHeader]);

  const findContainerDOMIndex = useCallback((element: Element) => {
    return ui.getMessagesContainer().find(element).index();
  }, []);

  useElementObserver({
    selector: () =>
      ui.getMessageBlocks().map(({ $query, $messageBlock, $answer }) => {
        return {
          element: $query[0],
          args: {
            messageBlock: $messageBlock[0],
            answer: $answer[0],
          },
        };
      }),
    callback: ({ element, args }) => {
      if (whereAmI() !== 'thread') return setContainers([]);

      $(element).addClass('tw-relative');

      const $container = $('<div>')
        .addClass(
          'tw-sticky tw-w-full tw-z-[11] tw-mt-4 thread-query-format-switch-container'
        )
        .css({
          top:
            (ui.getStickyHeader().find('>*')?.outerHeight() || 3.35 * 16) +
            'px',
        });

      $(element).before($container);

      const index = findContainerDOMIndex(args!.messageBlock);

      setContainers((draft) => {
        const newContainer: Container = {
          container: $container[0],
          query: element,
          messageBlock: args!.messageBlock,
          answer: args!.answer,
          states: {
            isMarkdown: true,
            isEditing: false,
            isCollapsed: false,
            isHidden: true,
            isQueryOutOfViewport: false,
          },
          isObserving: false,
        };

        // @ts-expect-error
        draft.splice(index, 0, newContainer);

        draft.forEach((container, index) => {
          if (
            !document.contains(container.messageBlock as unknown as Element)
          ) {
            draft.splice(index, 1);
          }
        });
      });
    },
    observedIdentifier: 'thread-query-format-switch-container',
  });

  useElementObserver({
    selector: () => $('.whitespace-pre-line.break-words').toArray(),
    callback: ({ element }) => {
      if (whereAmI() !== 'thread') return;

      const isMarkdown =
        $(element).parent().find('#markdown-query-wrapper:not(.\\!tw-hidden)')
          .length > 0 ||
        !$(element).parent().find('#markdown-query-wrapper').length;

      $(element).toggleClass('!tw-hidden', isMarkdown);
    },
    observedIdentifier: 'thread-query-format-switch',
  });

  useScrollDirection(containers, setContainers);

  const renderToolbar = useCallback(
    (container: Container, index: number) => (
      <Fragment key={index}>
        {containers[index] &&
          !containers[index].states.isHidden &&
          ReactDOM.createPortal(
            <ThreadMessageToolbar
              containers={containers}
              containerIndex={index}
              setContainers={setContainers}
            />,
            container.container
          )}
      </Fragment>
    ),
    [containers, setContainers]
  );

  return debouncedContainers.map(renderToolbar);
}

const useScrollDirection = (
  containers: Container[],
  setContainers: Updater<Container[]>
) => {
  const stickyNavHeight = useMemo(
    () => ui.getStickyHeader()?.outerHeight() || 3 * 16,
    []
  );

  const handleScrollDirectionChange = useCallback(() => {
    setContainers((draft) => {
      draft.forEach((_, index) => {
        draft[index].states.isQueryOutOfViewport =
          containers[index]?.query.getBoundingClientRect().top +
            containers[index]?.query.getBoundingClientRect().height <
          -20;
      });
    });
  }, [containers, setContainers]);

  useEffect(() => {
    const debouncedHandleScrollDirectionChange = debounce(
      handleScrollDirectionChange,
      100
    );

    const stopObserving = observer.onScrollDirectionChange({
      up: () => debouncedHandleScrollDirectionChange(),
      down: () => debouncedHandleScrollDirectionChange(),
      identifier: 'ThreadMessageStickyToolbar',
    });

    requestIdleCallback(() => debouncedHandleScrollDirectionChange());

    return () => {
      stopObserving();
    };
  }, [containers, stickyNavHeight, setContainers, handleScrollDirectionChange]);
};
