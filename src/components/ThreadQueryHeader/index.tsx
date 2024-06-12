import {
  Fragment,
  useEffect,
  useMemo,
  useState,
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

import useElementObserver from '../hooks/useElementObserver';
import ThreadQueryToolbar from './ThreadQueryToolbar';

export type Container = {
  messageBlock: Element;
  query: Element;
  container: Element;
  answer: Element;
};

export type ButtonsStates = {
  isMarkdown: boolean;
  isEditing: boolean;
  isCollapsed: boolean;
  isQueryOutOfViewport: boolean;
  isHidden: boolean;
};

export default function ThreadQueryHeader() {
  const [containers, setContainers] = useState<Container[]>([]);

  const [buttonsStates, setButtonsStates] = useImmer<ButtonsStates[]>([]);

  useEffect(() => {
    containers.forEach((container, index) => {
      observer.onDOMChanges({
        targetNode: container.messageBlock,
        callback: () => {
          if (
            !$(container.messageBlock).find(
              '.mt-sm.flex.items-center.justify-between'
            ).length
          ) {
            if (buttonsStates[index]?.isHidden) return;

            $('main').css('--codeBlockTop', '3.35rem');

            return setButtonsStates((draft) => {
              draft[index].isHidden = true;
            });
          }

          if (!buttonsStates[index]?.isHidden) return;

          $('main').css('--codeBlockTop', '6.5rem');

          setButtonsStates((draft) => {
            draft[index].isHidden = false;
          });
        },
      });
    });
  }, [containers, setButtonsStates, buttonsStates]);

  useEffect(() => {
    containers.forEach((container, index) => {
      if (buttonsStates.length <= index) {
        setButtonsStates((draft) => {
          draft[index] = {
            isMarkdown: false,
            isEditing: false,
            isCollapsed: false,
            isHidden: true,
            isQueryOutOfViewport:
              container.query.getBoundingClientRect().top +
                container.query.getBoundingClientRect().height <
              -20,
          };
        });
      }

      if (
        $(container.query).find('#markdown-query-wrapper.\\!tw-hidden').length
      ) {
        setButtonsStates((draft) => {
          draft[index].isMarkdown = false;
        });
      } else {
        setButtonsStates((draft) => {
          draft[index].isMarkdown = true;
        });
      }
    });
  }, [containers, buttonsStates, setButtonsStates]);

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

      setContainers((prev) =>
        [
          ...prev,
          {
            container: $container[0],
            query: element,
            messageBlock: args!.messageBlock,
            answer: args!.answer,
          },
        ].filter((container) => document.contains(container.messageBlock))
      );
    },
    observedIdentifier: 'thread-query-format-switch-container',
  });

  useElementObserver({
    selector: () =>
      ui
        .getMessageBlocks()
        .map(
          ({ $messageBlock }) =>
            $messageBlock.find('.whitespace-pre-line.break-words')[0]
        ),
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

  useScrollDirection(containers, setButtonsStates);

  return containers.map((container, index) => (
    <Fragment key={index}>
      {!buttonsStates[index]?.isHidden &&
        ReactDOM.createPortal(
          <ThreadQueryToolbar
            container={container}
            containerIndex={index}
            buttonsStates={buttonsStates}
            setButtonsStates={setButtonsStates}
            setContainers={setContainers}
          />,
          container.container
        )}
    </Fragment>
  ));
}

const useScrollDirection = (
  containers: Container[],
  setButtonsStates: Updater<ButtonsStates[]>
) => {
  const stickyNavHeight = useMemo(
    () => ui.getStickyHeader()?.outerHeight() || 3 * 16,
    []
  );

  useEffect(() => {
    const handleScrollDirectionChange = () => {
      setButtonsStates((draft) => {
        draft.forEach((_, index) => {
          draft[index].isQueryOutOfViewport =
            containers[index].query.getBoundingClientRect().top +
              containers[index].query.getBoundingClientRect().height <
            -20;
        });
      });
    };

    const stopObserving = observer.onScrollDirectionChange({
      up: () => handleScrollDirectionChange(),
      down: () => handleScrollDirectionChange(),
      identifier: 'ThreadQueryHeader',
    });

    return () => {
      stopObserving();
    };
  }, [containers, stickyNavHeight, setButtonsStates]);
};
