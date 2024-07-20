import $ from 'jquery';
import { ChevronLeft, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import useRouter from '@/content-script/hooks/useRouter';
import { useCanvasStore } from '@/content-script/session-store/canvas';
import { popupSettingsStore } from '@/content-script/session-store/popup-settings';
import Tooltip from '@/shared/components/Tooltip';
import { cn } from '@/utils/shadcn-ui-utils';
import UIUtils from '@/utils/UI';
import { scrollToElement } from '@/utils/utils';
import {
  useDebounce,
  useToggle,
  useWindowScroll,
  useWindowSize,
} from '@uidotdev/usehooks';

export default function ThreadTOC() {
  const { isOpen: isCanvasOpen } = useCanvasStore();

  const { visibleMessageIndex, anchorsProps, wrapperPos } =
    useThreadTOCObserver();

  const [visible, toggleVisibility] = useToggle(true);

  const [wrapperWidth, setWrapperWidth] = useState<number>(
    $('#thread-toc')?.outerWidth() || 0
  );

  const isFloat =
    isCanvasOpen ||
    (wrapperPos
      ? wrapperPos.left + wrapperWidth + 50 > window.innerWidth
      : false);

  useEffect(() => {
    isCanvasOpen && toggleVisibility(false);
  }, [isCanvasOpen, toggleVisibility]);

  useEffect(() => {
    requestAnimationFrame(() => {
      setWrapperWidth($('#thread-toc')?.outerWidth() || 0);
    });
  });

  if (!anchorsProps || !wrapperPos || !anchorsProps.length) return null;

  return (
    <>
      <div
        className="tw-fixed tw-w-max tw-z-20 tw-right-0 tw-top-0 tw-transition-all"
        style={{
          top: `${(UIUtils.getStickyNavbar().outerHeight() || 50) + (isFloat ? 60 : 30)}px`,
          [!isFloat ? 'left' : 'right']: !isFloat
            ? `${wrapperPos.left + 20}px`
            : '2rem',
        }}
      >
        {anchorsProps && anchorsProps.length > 1 && (
          <div
            className={cn(
              'tw-animate-in tw-slide-in-from-right tw-transition-all tw-font-sans',
              {
                'tw-relative tw-bg-background tw-p-3 tw-rounded-md tw-border tw-border-border tw-shadow-lg':
                  isFloat,
                'tw-hidden': !visible && isFloat,
              }
            )}
            id="thread-toc"
          >
            <div className="tw-min-w-[150px] tw-max-w-[250px] tw-flex tw-flex-col tw-gap-1 tw-max-h-[50dvh] tw-overflow-auto custom-scrollbar">
              {anchorsProps?.map((anchorProps, index) => (
                <div
                  key={index}
                  className={cn(
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
                    className={cn(
                      'tw-w-[.1rem] tw-h-5 tw-rounded-md tw-bg-muted tw-transition-colors tw-duration-300 tw-ease-in-out',
                      {
                        '!tw-bg-accent-foreground':
                          index === visibleMessageIndex,
                      }
                    )}
                  />
                  <div
                    className={cn(
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
            </div>
            {isFloat && visible && (
              <div
                className={cn(
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
          className={cn(
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
          <Tooltip
            content="Show Table of Content"
            contentOptions={{
              side: 'left',
            }}
          >
            <ChevronLeft className="tw-w-5 tw-h-5 tw-text-muted-foreground tw-cursor-pointer hover:!tw-text-foreground tw-transition-colors" />
          </Tooltip>
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

const useThreadTOCObserver = () => {
  const { url } = useRouter();

  const wndSize = useDebounce(useWindowSize(), 100);
  const [{ y: scrollY }] = useWindowScroll();

  const isCanvasOpen = useCanvasStore((state) => state.isOpen);

  const [visibleMessageIndex, setVisibleMessageIndex] = useState<number>(0);

  const [anchorsProps, setAnchorsProps] = useState<AnchorProps[]>();

  const [wrapperPos, setWrapperPos] = useState<{
    top: number;
    left: number;
  }>();

  const myObserver = useCallback(() => {
    const documentNotOverflowing = $(document).height()! <= $(window).height()!;

    if (documentNotOverflowing) return setAnchorsProps([]);

    setVisibleMessageIndex(
      UIUtils.getMostVisibleElementIndex(
        UIUtils.getMessagesContainer().children().toArray()
      )
    );

    const $messagesContainer = UIUtils.getMessagesContainer();
    const $messageBlocks = UIUtils.getMessageBlocks();

    if (!$messageBlocks.length || !$messagesContainer.length) return;

    setWrapperPos({
      top: $messagesContainer.offset()?.top || 0,
      left:
        $messagesContainer.width()! + ($messagesContainer.offset()?.left || 0),
    });

    setAnchorsProps([]);

    $messageBlocks.forEach(({ $query, $answer, $messageBlock }) => {
      queueMicrotask(() => {
        const title = $query
          .find('>*:not(#markdown-query-wrapper):not(.tw-sticky)')
          .first()
          .text();

        if (!title.length) return;

        const anchorProps = {
          title,
          onClick: () => {
            scrollToElement($messageBlock, -10);
          },
          onContextMenu: () => {
            const threadMessageStickyToolbar =
              popupSettingsStore.getState().qolTweaks
                .threadMessageStickyToolbar;

            const isScrollingUp =
              ($answer.offset()?.top || 0) <= $(window).scrollTop()!;

            const offset =
              isScrollingUp && threadMessageStickyToolbar ? -110 : -60;

            scrollToElement($answer, offset);
          },
        } as AnchorProps;

        setAnchorsProps((prev) => [...(prev || []), anchorProps]);
      });
    });
  }, []);

  useEffect(() => {
    !isCanvasOpen && requestIdleCallback(() => myObserver());
  }, [url, isCanvasOpen, wndSize, scrollY, myObserver]);

  return { visibleMessageIndex, anchorsProps, wrapperPos };
};
