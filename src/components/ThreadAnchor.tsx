import {
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';
import $ from 'jquery';
import {
  Menu,
  X,
} from 'lucide-react';

import observer from '@/utils/observer';
import { ui } from '@/utils/ui';
import {
  scrollToElement,
  whereAmI,
} from '@/utils/utils';
import { useToggle } from '@uidotdev/usehooks';

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

  if (!anchorsProps || !wrapperPos) return null;

  return (
    <>
      <div
        className="tw-fixed tw-w-max tw-z-10 tw-right-0 tw-top-0 tw-transition-all"
        style={{
          top: `${(ui.getStickyHeader().outerHeight() || 50) + 30}px`,
          [!isFloat ? 'left' : 'right']: !isFloat
            ? `${wrapperPos.left + 20}px`
            : '2rem',
        }}
      >
        {anchorsProps && anchorsProps.length > 1 && (
          <div
            className={clsx(
              'tw-flex tw-flex-col tw-gap-1 tw-min-w-[150px] tw-max-w-[250px] tw-animate-in tw-zoom-in tw-transition-all tw-font-sans',
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
            'tw-absolute -tw-top-2 tw-right-1 tw-bg-secondary tw-rounded-full tw-p-3 active:tw-scale-95 tw-transition-all tw-border tw-border-border tw-shadow-lg tw-cursor-pointer tw-animate-in tw-zoom-in',
            {
              'tw-hidden': !isFloat || visible,
            }
          )}
          onClick={() => {
            toggleVisibility(true);
          }}
        >
          <Menu className="tw-w-5 tw-h-5 tw-text-muted-foreground tw-cursor-pointer hover:!tw-text-foreground tw-transition-colors" />
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

  const myObserver = () => {
    const documentNotOverflowing = $(document).height()! <= $(window).height()!;

    if (whereAmI() !== 'thread' || documentNotOverflowing)
      return setAnchorsProps([]);

    setVisibleMessageIndex(
      ui.findMostVisibleElementIndex(
        ui.getMessagesContainer().children().toArray()
      )
    );

    const $messageContainer = ui.getMessagesContainer();

    if (!$messageContainer.length) return;

    setWrapperPos({
      top: $messageContainer.offset()?.top || 0,
      left:
        $messageContainer.width()! + ($messageContainer.offset()?.left || 0),
    });

    setAnchorsProps([]);

    $messageContainer.children().each((index, messageBlock) => {
      const anchorProps = {
        title: '',
        onClick: () => {},
        onContextMenu: () => {},
      } as AnchorProps;

      const $query = $(messageBlock).find('.my-md.md\\:my-lg');
      const $answer = $(messageBlock).find(
        '.mb-sm.flex.w-full.items-center.justify-between'
      );

      const title =
        $query.find('textarea').text() ||
        $query.find('>*:not(#markdown-query-wrapper)').first().text();

      anchorProps.title = title;

      anchorProps.onClick = () => {
        scrollToElement($query, -10);
      };

      anchorProps.onContextMenu = () => {
        scrollToElement($answer, -10);
      };

      setAnchorsProps((prev) => [...(prev || []), anchorProps]);
    });
  };

  useEffect(() => {
    requestIdleCallback(() => myObserver());

    $(window).on('scroll', () => myObserver());
    observer.onShallowRouteChange(() => {
      requestIdleCallback(() => myObserver());
    });

    $(window)
      .off('resize.threadAnchor')
      .on('resize.threadAnchor', () => {
        myObserver();
      });
  }, []);

  return { visibleMessageIndex, anchorsProps, wrapperPos };
};
