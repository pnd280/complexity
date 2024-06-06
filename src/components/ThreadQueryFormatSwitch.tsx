import {
  Fragment,
  useEffect,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
import { Text } from 'lucide-react';
import { FaMarkdown } from 'react-icons/fa';
import { useImmer } from 'use-immer';

import { ui } from '@/utils/ui';
import { whereAmI } from '@/utils/utils';

import useElementObserver from './hooks/useElementObserver';
import TooltipWrapper from './TooltipWrapper';

export default function ThreadQueryFormatSwitch() {
  const [containers, setContainers] = useState<
    {
      messageBlock: Element;
      query: Element;
    }[]
  >([]);

  const [isMarkdown, setIsMarkdown] = useImmer<boolean[]>([]);

  useEffect(() => {
    containers.forEach((container, index) => {
      if ($(container.query).find('#markdown-query-wrapper.\\!tw-hidden').length) {
        setIsMarkdown((draft) => {
          draft[index] = false;
        });
      } else {
        setIsMarkdown((draft) => {
          draft[index] = true;
        });
      }
    });
  }, [containers, setIsMarkdown]);

  useElementObserver({
    selector: () =>
      ui.getMessageBlocks().map(({ $query, $messageBlock }) => ({
        element: $query[0],
        args: { $messageBlock },
      })),
    callback: ({ element, args }) => {
      if (whereAmI() !== 'thread') return setContainers([]);

      $(element).addClass('tw-relative');

      setContainers((prev) => [
        ...prev,
        {
          query: element,
          messageBlock: args.$messageBlock[0],
        },
      ]);
    },
    observedIdentifier: 'thread-query-format-switch',
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
          .length > 0 || !$(element).parent().find('#markdown-query-wrapper').length;

      $(element).toggleClass('!tw-hidden', isMarkdown);
    },
    observedIdentifier: 'append-tw-block-to-plain-text-block',
  });

  return containers.map((container, index) => (
    <Fragment key={index}>
      {ReactDOM.createPortal(
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsMarkdown((draft) => {
              $(container.query)
                .find('.whitespace-pre-line.break-words')
                .toggleClass('!tw-hidden', !draft[index]);
              $(container.query)
                .find('#markdown-query-wrapper')
                .toggleClass('!tw-hidden', draft[index]);
              draft[index] = !draft[index];
            });
          }}
          className="tw-absolute tw-right-0 tw-top-0 tw-w-max tw-h-max tw-bg-secondary tw-text-secondary-foreground tw-p-2 tw-rounded-md tw-cursor-pointer tw-border tw-border-border tw-shadow-lg tw-opacity-10 hover:tw-opacity-100 tw-transition-all tw-animate-in tw-fade-in active:tw-scale-95"
        >
          <TooltipWrapper
            content={
              isMarkdown[index] ? 'Switch to Plain Text' : 'Switch to Markdown'
            }
            contentOptions={{
              sideOffset: 15,
            }}
            delayDuration={0}
          >
            {isMarkdown[index] ? (
              <Text className="tw-w-4 tw-h-4 tw-text-accent-foreground" />
            ) : (
              <FaMarkdown className="tw-w-4 tw-h-4 tw-text-accent-foreground" />
            )}
          </TooltipWrapper>
        </div>,
        container.query
      )}
    </Fragment>
  ));
}
