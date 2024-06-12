import $ from 'jquery';
import {
  Ellipsis,
  LucideThumbsDown,
  Text,
  X,
} from 'lucide-react';
import { FaMarkdown } from 'react-icons/fa';
import { PiNotePencil } from 'react-icons/pi';
import { Updater } from 'use-immer';

import { cn } from '@/lib/utils';
import {
  scrollToElement,
  sleep,
} from '@/utils/utils';

import CopyButton from '../ThreadQueryHeader/CopyButton';
import RewriteDropdown from '../ThreadQueryHeader/RewriteDropdown';
import TooltipWrapper from '../TooltipWrapper';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Container } from './';

type threadQueryToolbar = {
  containerIndex: number;
  containers: Container[];
  setContainers: Updater<Container[]>;
};

export default function threadQueryToolbar({
  containers,
  containerIndex,
  setContainers,
}: threadQueryToolbar) {
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
        {!containers[containerIndex].states.isQueryOutOfViewport && (
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
              className="tw-text-secondary-foreground tw-cursor-pointer tw-transition-all tw-animate-in tw-fade-in active:tw-scale-95 tw-opacity-10 hover:tw-opacity-100"
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

        <div
          className={cn(
            'tw-transition-all tw-max-w-[20rem] tw-truncate tw-text-muted-foreground tw-select-none tw-cursor-pointer active:tw-scale-95 tw-duration-300',
            {
              'tw-invisible tw-opacity-0':
                !containers[containerIndex].states.isQueryOutOfViewport,
            }
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

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              className="tw-text-secondary-foreground tw-cursor-pointer tw-transition-all tw-animate-in tw-fade-in active:tw-scale-95 hover:tw-bg-secondary tw-rounded-md tw-p-1 tw-group"
              onClick={() => {}}
            >
              <Ellipsis className="tw-w-4 tw-h-4 tw-text-muted-foreground group-hover:tw-text-foreground tw-transition-all" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
  item: 'Report' | 'Delete';
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

  while (
    !$(`[data-popper-reference-hidden="true"]:contains("${item}")`).length
  ) {
    await sleep(10);
  }

  $(`[data-popper-reference-hidden="true"] .md\\:h-full:contains("${item}")`)
    .last()
    .trigger('click');
}
