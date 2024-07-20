import $ from 'jquery';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import useWaitForElement from '@/content-script/hooks/useWaitForElement';
import { useGlobalStore } from '@/content-script/session-store/global';
import useExtensionUpdate from '@/shared/hooks/useExtensionUpdate';
import background from '@/utils/background';
import { cn } from '@/utils/shadcn-ui-utils';
import { isDOMNode } from '@/utils/utils';
import { useDebounce, useToggle } from '@uidotdev/usehooks';

export default function Slogan() {
  const { newVersionAvailable } = useExtensionUpdate({});

  const [container, setContainer] = useState<Element>();

  const isReady = useGlobalStore(
    (state) => state.isWebSocketCaptured || state.isLongPollingCaptured
  );

  const [visible, toggleVisibility] = useToggle(!isReady);

  const debouncedIsReady = useDebounce(isReady, 1000);

  const slogan =
    useGlobalStore((state) => state.customTheme.slogan) ||
    'Where knowledge begins';

  const { element, isWaiting } = useWaitForElement({
    id: 'slogan',
    selector: '.mb-lg.flex.items-center.justify-center.pb-xs.md\\:text-center',
  });

  useEffect(() => {
    if (!isDOMNode(element) || !$(element).length) return;

    const $nativeSlogan = $(element);

    if (!$nativeSlogan.length) return;

    $nativeSlogan
      .find('> div:first-child')
      .addClass('tw-relative')
      .find('span:first')
      .addClass(
        'hover:tw-tracking-wide tw-transition-all tw-duration-300 tw-ease-in-out text-shadow-hover tw-select-none !tw-leading-[1.2rem]'
      )
      .text(slogan);

    setContainer($nativeSlogan[0]);
  }, [element, isWaiting, slogan]);

  if (!container) return null;

  return (
    <>
      {ReactDOM.createPortal(
        <>
          {visible && (
            <div
              className={cn(
                'tw-flex tw-items-center tw-gap-1 tw-justify-center tw-absolute -tw-top-[2rem] tw-left-1/2 -tw-translate-x-1/2  tw-w-fit tw-font-sans tw-text-[.8rem] tw-text-accent-foreground tw-transition-all tw-duration-300 tw-fade-in tw-animate-in tw-select-none',
                {
                  'tw-animate-out tw-zoom-out tw-fade-out tw-slide-out-to-top tw-fill-mode-forwards':
                    debouncedIsReady,
                }
              )}
              onAnimationEnd={() => {
                if (debouncedIsReady) {
                  toggleVisibility(false);
                }
              }}
            >
              {slogan.length > 5 && (
                <div className="tw-flex tw-items-center tw-gap-1">
                  <LoaderCircle className="tw-size-2 tw-animate-spin" />
                  <span>Complexity</span>
                </div>
              )}
            </div>
          )}
        </>,
        $(container).find('> div:first-child')[0]
      )}
      {newVersionAvailable &&
        ReactDOM.createPortal(
          <div
            className="tw-fixed tw-bottom-20 tw-font-sans tw-cursor-pointer tw-select-none"
            onClick={() => {
              background.sendMessage({ action: 'openChangelog' });
            }}
          >
            <div>
              A new version of{' '}
              <span className="tw-font-bold tw-text-accent-foreground">
                Complexity
              </span>{' '}
              is available
            </div>
            <div className="tw-size-2 tw-rounded-full tw-bg-accent-foreground tw-animate-ping tw-absolute -tw-right-3 tw-top-0"></div>
            <div className="tw-size-2 tw-rounded-full tw-bg-accent-foreground tw-absolute -tw-right-3 tw-top-0"></div>
          </div>,
          container
        )}
    </>
  );
}
