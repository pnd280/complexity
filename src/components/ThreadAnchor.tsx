import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';
import $ from 'jquery';
import { debounce } from 'lodash';
import {
  ChevronLeft,
  X,
} from 'lucide-react';

import {
  popupSettingsStore,
} from '@/content-script/session-store/popup-settings';
import observer from '@/utils/observer';
import { ui } from '@/utils/ui';
import {
  scrollToElement,
  whereAmI,
} from '@/utils/utils';
import { useToggle } from '@uidotdev/usehooks';

import TooltipWrapper from './TooltipWrapper';

export default function ThreadAnchor() {
  const { visibleMessageIndex, anchorsProps, wrapperPos } =
    useThreadAnchorObserver();

  const [visible, toggleVisibility] = useToggle(true);

  const [wrapperWidth, setWrapperWidth] = useState<number>(
    $('#thread-anchor')?.outerWidth() || 0
  );

  const isFloat = wrapperPos
    ? wrapperPos.left + wrapperWidth + 50 > window.innerWidth
    : false;

  requestIdleCallback(() => {
    setWrapperWidth($('#thread-anchor')?.outerWidth() || 0);
  });

  if (!anchorsProps || !wrapperPos || whereAmI() !== 'thread') return null;

  return (
    <>
      <div
        className="tw-fixed tw-w-max tw-z-20 tw-right-0 tw-top-0 tw-transition-all"
        style={{
          top: `${(ui.getStickyHeader().outerHeight() || 50) + (isFloat ? 60 : 30)}px`,
          [!isFloat ? 'left' : 'right']: !isFloat
            ? `${wrapperPos.left + 20}px`
            : '2rem',
        }}
      >
        {anchorsProps && anchorsProps.length > 1 && (
          <div
            className={clsx(
              'tw-flex tw-flex-col tw-gap-1 tw-min-w-[150px] tw-max-w-[250px] tw-animate-in tw-slide-in-from-right tw-transition-all tw-font-sans tw-max-h-[50vh] tw-overflow-auto',
              {
                'tw-relative tw-bg-background tw-p-3 tw-rounded-md tw-border tw-border-border tw-shadow-lg':
                  isFloat,
                'tw-hidden': !visible && isFloat,
              }
            )}
            id="thread-anchor"
          >
            {anchorsProps?.map((anchorProps, index) => (
              <div
                key={index}
                className={clsx(
                  'tw-flex tw-items-center tw-space-x-2 tw-text-sm tw-cursor-pointer tw-group',
                  {
                    'tw-mr-6': visible && isFloat && index === 0,
                  }
                )}
                onClick={anchorProps.onClick}
                onContextMenu={(e) => {
                  e.preventDefault();
                  anchorProps.onContextMenu();
                }}
              >
                <div
                  className={clsx(
                    'tw-w-[.1rem] tw-h-5 tw-rounded-md tw-bg-muted tw-transition-colors tw-duration-300 tw-ease-in-out',
                    {
                      '!tw-bg-accent-foreground': index === visibleMessageIndex,
                    }
                  )}
                />
                <div
                  className={clsx(
                    'tw-truncate tw-w-full tw-cursor-pointer tw-text-foreground-darker group-hover:tw-text-muted-foreground tw-transition-colors tw-duration-300 tw-ease-in-out tw-select-none',
                    {
                      '!tw-text-foreground': index === visibleMessageIndex,
                    }
                  )}
                >
                  {anchorProps.title}
                </div>
              </div>
            ))}

            {isFloat && visible && (
              <div
                className={clsx(
                  'tw-absolute tw-top-1 tw-right-1 active:tw-scale-95 tw-transition-colors tw-duration-300'
                )}
                onClick={() => {
                  toggleVisibility(false);
                }}
              >
                <X className="tw-w-5 tw-h-5 tw-text-muted-foreground tw-cursor-pointer hover:!tw-text-foreground tw-transition-colors" />
              </div>
            )}
          </div>
        )}

        <div
          className={clsx(
            'tw-absolute -tw-top-2 -tw-right-10 tw-bg-secondary tw-rounded-full tw-h-20 active:tw-scale-95 tw-transition-all tw-border tw-border-border tw-shadow-lg tw-cursor-pointer tw-animate-in tw-slide-in-from-left',
            'tw-flex tw-items-center hover:-tw-right-8',
            {
              'tw-hidden': !isFloat || visible,
            }
          )}
          onClick={() => {
            toggleVisibility(true);
          }}
        >
          <TooltipWrapper
            content="Show Table of Content"
            contentOptions={{
              side: 'left',
            }}
          >
            <ChevronLeft className="tw-w-5 tw-h-5 tw-text-muted-foreground tw-cursor-pointer hover:!tw-text-foreground tw-transition-colors" />
          </TooltipWrapper>
        </div>
      </div>
    </>
  );
}

type AnchorProps = {
  title: string;
  onClick: () => void;
  onContextMenu: () => void;
};

const useThreadAnchorObserver = () => {
  const [visibleMessageIndex, setVisibleMessageIndex] = useState<number>(0);

  const [anchorsProps, setAnchorsProps] = useState<AnchorProps[]>();

  const [wrapperPos, setWrapperPos] = useState<{
    top: number;
    left: number;
  }>();

  const myObserver = useCallback(() => {
    const documentNotOverflowing = $(document).height()! <= $(window).height()!;

    if (whereAmI() !== 'thread' || documentNotOverflowing)
      return setAnchorsProps([]);

    setVisibleMessageIndex(
      ui.findMostVisibleElementIndex(
        ui.getMessagesContainer().children().toArray()
      )
    );

    const $messagesContainer = ui.getMessagesContainer();
    const $messageBlocks = ui.getMessageBlocks();

    if (!$messageBlocks.length || !$messagesContainer.length) return;

    setWrapperPos({
      top: $messagesContainer.offset()?.top || 0,
      left:
        $messagesContainer.width()! + ($messagesContainer.offset()?.left || 0),
    });

    setAnchorsProps([]);

    $messageBlocks.forEach(({ $query, $answer, $messageBlock }) => {
      const anchorProps = {
        title:
          $query.find('textarea').text() ||
          $query
            .find('>*:not(#markdown-query-wrapper):not(.tw-sticky)')
            .first()
            .text(),
        onClick: () => {
          scrollToElement($messageBlock, -10);
        },
        onContextMenu: () => {
          const threadMessageStickyToolbar =
            popupSettingsStore.getState().qolTweaks.threadMessageStickyToolbar;

          const isScrollingUp =
            ($answer.offset()?.top || 0) <= $(window).scrollTop()!;

          const offset =
            isScrollingUp && threadMessageStickyToolbar ? -110 : -60;

          scrollToElement($answer, offset);
        },
      } as AnchorProps;

      setAnchorsProps((prev) => [...(prev || []), anchorProps]);
    });
  }, []);

  useEffect(() => {
    const debouncedObserver = debounce(myObserver, 100);

    requestIdleCallback(() => debouncedObserver());

    $(window).on('scroll', () => debouncedObserver());
    observer.onShallowRouteChange(() => {
      requestIdleCallback(() => debouncedObserver());
    });

    $(window)
      .off('resize.threadAnchor')
      .on('resize.threadAnchor', () => {
        debouncedObserver();
      });
  }, [myObserver]);

  return { visibleMessageIndex, anchorsProps, wrapperPos };
};
