import { useCallback, useEffect, useState } from 'react';

import $ from 'jquery';
import {
  Ellipsis,
  ListOrdered,
  LucideThumbsDown,
  Share2,
  Text,
  X,
} from 'lucide-react';
import { FaMarkdown } from 'react-icons/fa';
import { PiNotePencil } from 'react-icons/pi';
import { Updater } from 'use-immer';

import { cn } from '@/utils/shadcn-ui-utils';
import { scrollToElement, sleep, stripHtml } from '@/utils/utils';

import Tooltip from '@/shared/components/Tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/ui/dropdown-menu';
import CopyButton from './CopyButton';
import RewriteDropdown from './RewriteDropdown';
import { Container, ContainerStates } from './ThreadMessageStickyToolbar';
import ThreadTitle from './ThreadTitle';

type ThreadMessageStickyToolbarComponents = {
  containerIndex: number;
  containers: Container[];
  containersStates: ContainerStates[];
  setContainersStates: Updater<ContainerStates[]>;
};

export default function ThreadMessageStickyToolbarComponents({
  containerIndex,
  containers,
  containersStates,
  setContainersStates,
}: ThreadMessageStickyToolbarComponents) {
  const [markdownVisualDiff, setMarkdownVisualDiff] = useState(false);

  const handleVisualDiff = useCallback(() => {
    const markdownText = stripHtml(
      $(containers[containerIndex].query)
        .find('>#markdown-query-wrapper')
        .html()
    );

    const originalText = stripHtml(
      $(containers[containerIndex].query)
        .find('>*:not(#markdown-query-wrapper)')
        .html()
    );

    setMarkdownVisualDiff(
      !!markdownText.length &&
        !!originalText.length &&
        markdownText !== originalText
    );
  }, [containerIndex, containers]);

  useEffect(() => {
    handleVisualDiff();
  }, [containersStates, handleVisualDiff]);

  // TODO: prone to changes, needs refactoring
  const $messageEditButton = $(containers?.[containerIndex]?.messageBlock)
    .find('.mt-sm.flex.items-center.justify-between')
    .children()
    .last()
    .children()
    .find('div:has([data-icon="pen-to-square"])');

  const isMessageEditable = !!$messageEditButton.length;

  const $messageShareButton = $(containers?.[containerIndex]?.messageBlock)
    .find('.mt-sm.flex.items-center.justify-between')
    .children()
    .first()
    .children()
    .find('div:contains("Share"):last')
    .closest('button');

  const isMessageShareable = !!$messageShareButton.length;

  return (
    <div
      className={cn(
        'thread-message-toolbar w-w-full tw-py-[.8rem] tw-px-2 tw-border-b tw-border-border tw-bg-background tw-flex tw-items-center tw-gap-2',
        {
          'tw-shadow-bottom-lg':
            containersStates[containerIndex].isQueryOutOfViewport,
        }
      )}
    >
      <div className="tw-flex tw-items-center tw-gap-2 tw-w-full">
        {!containersStates[containerIndex].isHidden &&
          !containersStates[containerIndex].isQueryOutOfViewport &&
          markdownVisualDiff && (
            <Tooltip
              content={
                containersStates[containerIndex].isMarkdown
                  ? 'Convert Query to Plain Text'
                  : 'Convert Query to Markdown'
              }
              contentOptions={{
                sideOffset: 15,
              }}
              contentClassName="tw-w-max"
            >
              <div
                className="tw-text-secondary-foreground tw-cursor-pointer tw-transition-all tw-animate-in tw-fade-in tw-slide-in-from-top active:tw-scale-95 tw-opacity-10 hover:tw-opacity-100"
                onClick={() => {
                  if (
                    $(containers[containerIndex].query).find('textarea').length
                  ) {
                    $messageEditButton.trigger('click');
                  }

                  setContainersStates((draft) => {
                    $(containers[containerIndex].query)
                      .find('.whitespace-pre-line.break-words')
                      .toggleClass(
                        '!tw-hidden',
                        !draft[containerIndex].isMarkdown
                      );
                    $(containers[containerIndex].query)
                      .find('#markdown-query-wrapper')
                      .toggleClass(
                        '!tw-hidden',
                        draft[containerIndex].isMarkdown
                      );
                    draft[containerIndex].isMarkdown =
                      !draft[containerIndex].isMarkdown;
                    scrollToElement(
                      $(containers[containerIndex].query as unknown as Element),
                      -60
                    );
                  });
                }}
              >
                {containersStates[containerIndex].isMarkdown ? (
                  <FaMarkdown className="tw-size-4" />
                ) : (
                  <Text className="tw-size-4" />
                )}
              </div>
            </Tooltip>
          )}

        <ThreadTitle
          query={
            $(containers[containerIndex].query).find('textarea').text() ||
            $(containers[containerIndex].query)
              .find('>*:not(#markdown-query-wrapper):not(.tw-sticky)')
              .first()
              .text()
          }
          onClick={() => {
            scrollToElement($(containers[containerIndex].query), -60);
          }}
          isOutOfViewport={
            containersStates[containerIndex].isQueryOutOfViewport
          }
        />
      </div>

      <div
        className={cn('tw-ml-auto tw-flex tw-items-center tw-gap-2', {
          'tw-invisible tw-opacity-0':
            containersStates[containerIndex].isHidden,
        })}
      >
        {isMessageEditable && (
          <RewriteDropdown container={containers[containerIndex]} />
        )}

        <CopyButton
          container={containers[containerIndex]}
          containerIndex={containerIndex}
        />

        {isMessageEditable && (
          <Tooltip content="Edit Query">
            <div
              className="tw-text-secondary-foreground tw-cursor-pointer tw-transition-all tw-animate-in tw-fade-in active:tw-scale-95 hover:tw-bg-secondary tw-rounded-md tw-p-1 tw-group"
              onClick={() => {
                $messageEditButton.trigger('click');
              }}
            >
              <PiNotePencil className="tw-size-4 tw-text-muted-foreground group-hover:tw-text-foreground tw-transition-all" />
            </div>
          </Tooltip>
        )}

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <div
              className="tw-text-secondary-foreground tw-cursor-pointer tw-transition-all tw-animate-in tw-fade-in active:tw-scale-95 hover:tw-bg-secondary tw-rounded-md tw-p-1 tw-group"
              onClick={() => {}}
            >
              <Ellipsis className="tw-size-4 tw-text-muted-foreground group-hover:tw-text-foreground tw-transition-all" />
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
                <ListOrdered className="tw-size-4" />
                View Sources
              </DropdownMenuItem>
            )}

            {isMessageShareable && (
              <DropdownMenuItem
                onSelect={() => {
                  $messageShareButton.trigger('click');
                }}
                className="tw-flex tw-gap-2 tw-items-center"
              >
                <Share2 className="tw-size-4" />
                Share
              </DropdownMenuItem>
            )}

            {isMessageEditable && (
              <DropdownMenuItem
                onSelect={async () => {
                  moreMenuItemClick({
                    container: containers[containerIndex],
                    item: 'Report',
                  });
                }}
                className="tw-flex tw-gap-2 tw-items-center"
              >
                <LucideThumbsDown className="tw-size-4" />
                Report
              </DropdownMenuItem>
            )}

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
                  <X className="tw-size-4" />
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
