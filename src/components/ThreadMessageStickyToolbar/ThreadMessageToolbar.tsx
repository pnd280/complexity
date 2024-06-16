import {
  useCallback,
  useState,
} from 'react';

import $ from 'jquery';
import {
  Ellipsis,
  ListOrdered,
  LucideThumbsDown,
  Text,
  X,
} from 'lucide-react';
import { FaMarkdown } from 'react-icons/fa';
import { PiNotePencil } from 'react-icons/pi';
import { Updater } from 'use-immer';

import { cn } from '@/lib/utils';
import observer from '@/utils/observer';
import {
  scrollToElement,
  sleep,
  stripHtml,
} from '@/utils/utils';
import { useDebounce } from '@uidotdev/usehooks';

import useElementObserver from '../hooks/useElementObserver';
import TooltipWrapper from '../TooltipWrapper';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Container } from './';
import CopyButton from './CopyButton';
import RewriteDropdown from './RewriteDropdown';

type ThreadMessageToolbar = {
  containerIndex: number;
  containers: Container[];
  setContainers: Updater<Container[]>;
};

export default function ThreadMessageToolbar({
  containers,
  containerIndex,
  setContainers,
}: ThreadMessageToolbar) {
  const debouncedContainers = useDebounce(containers, 100);

  const [markdownVisualDiff, setMarkdownVisualDiff] = useState(false);

  const handleVisualDiff = useCallback(() => {
    console.log(1);
    const $textarea = $(containers[containerIndex].query).find('textarea');

    const markdownText = stripHtml(
      $(containers[containerIndex].query)
        .find('>#markdown-query-wrapper')
        .html()
    );

    const originalText = $(containers[containerIndex].query)
      .find('>*:not(#markdown-query-wrapper)')
      .html();

    setMarkdownVisualDiff(
      !!markdownText.length &&
        markdownText !== originalText &&
        !$textarea.length
    );
  }, [containerIndex, containers]);

  useElementObserver({
    container: containers[containerIndex].query,
    selector: () => [
      $(containers[containerIndex].query).find('#markdown-query-wrapper')[0],
    ],
    callback: () => {
      handleVisualDiff();
    },
  });

  useElementObserver({
    container: containers[containerIndex].query,
    selector: () => [$(containers[containerIndex].query).find('textarea')[0]],
    callback: () => {
      handleVisualDiff();

      observer.onElementRemoved({
        container: containers[containerIndex].query,
        selector: $(containers[containerIndex].query).find('textarea')[0],
        callback: () => {
          return handleVisualDiff();
        },
      });
    },
  });

  return (
    <div
      className={cn(
        'tw-w-full tw-py-[.8rem] tw-px-2 tw-border-b tw-border-border tw-bg-background tw-flex tw-items-center tw-gap-2 thread-query-format-switch-toolbar',
        {
          'tw-shadow-bottom-lg':
            containers[containerIndex].states.isQueryOutOfViewport,
        }
      )}
    >
      <div className="tw-flex tw-items-center tw-gap-2 tw-w-full">
        {!debouncedContainers[containerIndex].states.isQueryOutOfViewport &&
          markdownVisualDiff && (
            <TooltipWrapper
              content={
                containers[containerIndex].states.isMarkdown
                  ? 'Convert Query to Plain Text'
                  : 'Convert Query to Markdown'
              }
              contentOptions={{
                sideOffset: 15,
              }}
              delayDuration={0}
              contentClassName="tw-w-max"
            >
              <div
                className="tw-text-secondary-foreground tw-cursor-pointer tw-transition-all tw-animate-in tw-fade-in tw-slide-in-from-top active:tw-scale-95 tw-opacity-10 hover:tw-opacity-100"
                onClick={() => {
                  setContainers((draft) => {
                    $(draft[containerIndex].query)
                      .find('.whitespace-pre-line.break-words')
                      .toggleClass(
                        '!tw-hidden',
                        !draft[containerIndex].states.isMarkdown
                      );
                    $(draft[containerIndex].query)
                      .find('#markdown-query-wrapper')
                      .toggleClass(
                        '!tw-hidden',
                        draft[containerIndex].states.isMarkdown
                      );
                    draft[containerIndex].states.isMarkdown =
                      !draft[containerIndex].states.isMarkdown;
                    scrollToElement(
                      $(draft[containerIndex].query as unknown as Element),
                      -60
                    );
                  });
                }}
              >
                {containers[containerIndex].states.isMarkdown ? (
                  <FaMarkdown className="tw-w-4 tw-h-4" />
                ) : (
                  <Text className="tw-w-4 tw-h-4" />
                )}
              </div>
            </TooltipWrapper>
          )}

        {debouncedContainers[containerIndex].states.isQueryOutOfViewport && (
          <div
            className={cn(
              'tw-transition-all tw-max-w-[20rem] tw-truncate tw-text-muted-foreground tw-select-none tw-cursor-pointer active:tw-scale-95 tw-duration-300 tw-font-sans tw-animate-in tw-fade-in tw-slide-in-from-bottom'
            )}
            onClick={() => {
              scrollToElement($(containers[containerIndex].query), -60);
            }}
          >
            <span>
              {$(containers[containerIndex].query).find('textarea').text() ||
                $(containers[containerIndex].query)
                  .find('>*:not(#markdown-query-wrapper):not(.tw-sticky)')
                  .first()
                  .text()}
            </span>
          </div>
        )}
      </div>

      <div className="tw-ml-auto tw-flex tw-items-center tw-gap-2">
        <RewriteDropdown container={containers[containerIndex]} />

        <CopyButton
          container={containers[containerIndex]}
          containerIndex={containerIndex}
        />

        <TooltipWrapper content="Edit Query">
          <div
            className="tw-text-secondary-foreground tw-cursor-pointer tw-transition-all tw-animate-in tw-fade-in active:tw-scale-95 hover:tw-bg-secondary tw-rounded-md tw-p-1 tw-group"
            onClick={() => {
              const $buttonBar = $(
                containers[containerIndex].messageBlock
              ).find('.mt-sm.flex.items-center.justify-between');

              const $editButton = $buttonBar
                .children()
                .last()
                .children()
                .find('div:has([data-icon="pen-to-square"])');

              if (!$editButton.length) return;

              $editButton.trigger('click');

              setContainers((draft) => {
                draft[containerIndex].states.isEditing =
                  !draft[containerIndex].states.isEditing;
              });
            }}
          >
            <PiNotePencil className="tw-w-4 tw-h-4 tw-text-muted-foreground group-hover:tw-text-foreground tw-transition-all" />
          </div>
        </TooltipWrapper>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <div
              className="tw-text-secondary-foreground tw-cursor-pointer tw-transition-all tw-animate-in tw-fade-in active:tw-scale-95 hover:tw-bg-secondary tw-rounded-md tw-p-1 tw-group"
              onClick={() => {}}
            >
              <Ellipsis className="tw-w-4 tw-h-4 tw-text-muted-foreground group-hover:tw-text-foreground tw-transition-all" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {!!$(containers[containerIndex].messageBlock).find(
              '.mb-sm.flex.w-full.items-center.justify-between:contains("Sources")'
            ).length && (
              <DropdownMenuItem
                onSelect={async () => {
                  moreMenuItemClick({
                    container: containers[containerIndex],
                    item: 'View Sources',
                  });
                }}
                className="tw-flex tw-gap-2 tw-items-center"
              >
                <ListOrdered className="tw-w-4 tw-h-4" />
                View Sources
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={async () => {
                moreMenuItemClick({
                  container: containers[containerIndex],
                  item: 'Report',
                });
              }}
              className="tw-flex tw-gap-2 tw-items-center"
            >
              <LucideThumbsDown className="tw-w-4 tw-h-4" />
              Report
            </DropdownMenuItem>
            {containers.length - 1 === containerIndex &&
              containers.length > 1 && (
                <DropdownMenuItem
                  onSelect={async () => {
                    await moreMenuItemClick({
                      container: containers[containerIndex],
                      item: 'Delete',
                    });
                  }}
                  className="tw-flex tw-gap-2 tw-items-center"
                >
                  <X className="tw-w-4 tw-h-4" />
                  Delete
                </DropdownMenuItem>
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

async function moreMenuItemClick({
  container,
  item,
}: {
  container: Container;
  item: 'Report' | 'Delete' | 'View Sources';
}) {
  const $buttonBar = $(container.messageBlock).find(
    '.mt-sm.flex.items-center.justify-between'
  );

  const $button = $buttonBar
    .children()
    .last()
    .children()
    .find('button:has([data-icon="ellipsis"])');

  if (!$button.length) return;

  $button.trigger('click');

  let acc = 0;

  while (
    !$(`[data-popper-reference-hidden="true"]:contains("${item}")`).length
  ) {
    await sleep(10);

    acc += 10;

    if (acc > 1000) return;
  }

  $(`[data-popper-reference-hidden="true"] .md\\:h-full:contains("${item}")`)
    .last()
    .trigger('click');
}
