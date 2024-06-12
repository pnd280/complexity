import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
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
    ({ container, index }: { container: Container; index: number }) => {
      if (!document.contains(container.messageBlock)) {
        return;
      }

      if (
        !$(container.messageBlock).find(
          '.mt-sm.flex.items-center.justify-between'
        ).length
      ) {
        $('main').css('--codeBlockTop', '3.35rem');

        return setContainers((draft) => {
          if (!draft[index].states.isHidden) {
            draft[index].states.isHidden = true;
          }
        });
      }

      $('main').css('--codeBlockTop', '6.5rem');

      setContainers((draft) => {
        if (draft[index].states.isHidden) {
          draft[index].states.isHidden = false;
        }
      });
    },
    [setContainers]
  );

  useEffect(() => {
    observer.onDOMChanges({
      targetNode: ui.getMessagesContainer()[0],
      callback: () => {
        setContainers((draft) => {
          draft.forEach((container, index) => {
            if (
              !document.contains(container.messageBlock as unknown as Element)
            ) {
              draft.splice(index, 1);
            }
          });
        });
      },
    });

    containers.forEach((container, index) => {
      if (!container.isObserving) {
        observer.onDOMChanges({
          targetNode: container.messageBlock,
          callback: () => showHideHeader({ container, index }),
        });
        setContainers((draft) => {
          draft[index].isObserving = true;
        });
      }
    });
  }, [containers, setContainers, showHideHeader]);

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

      const $container = $('<div>').addClass(
        'tw-sticky tw-top-[3.35rem] tw-w-full tw-z-[11] tw-mt-4 thread-query-format-switch-container'
      );

      $(element).before($container);

      setContainers((draft) => {
        return [
          ...draft,
          {
            container: $container[0],
            query: element,
            messageBlock: args!.messageBlock,
            answer: args!.answer,
            states: {
              isMarkdown: true,
              isEditing: false,
              isCollapsed: false,
              isHidden: false,
              isQueryOutOfViewport: false,
            },
            isObserving: false,
          },
        ].filter((container) =>
          document.contains(container.messageBlock as unknown as Element)
        );
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

  return debouncedContainers.map((container, index) => (
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
  ));
}

const useScrollDirection = (
  containers: Container[],
  setContainers: Updater<Container[]>
) => {
  const stickyNavHeight = useMemo(
    () => ui.getStickyHeader()?.outerHeight() || 3 * 16,
    []
  );

  useEffect(() => {
    const handleScrollDirectionChange = () => {
      setContainers((draft) => {
        draft.forEach((_, index) => {
          draft[index].states.isQueryOutOfViewport =
            containers[index]?.query.getBoundingClientRect().top +
              containers[index]?.query.getBoundingClientRect().height <
            -20;
        });
      });
    };

    const stopObserving = observer.onScrollDirectionChange({
      up: () => handleScrollDirectionChange(),
      down: () => handleScrollDirectionChange(),
      identifier: 'ThreadMessageStickyToolbar',
    });

    return () => {
      stopObserving();
    };
  }, [containers, stickyNavHeight, setContainers]);
};
