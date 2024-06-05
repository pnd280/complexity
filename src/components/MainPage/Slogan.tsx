import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import clsx from 'clsx';
import $ from 'jquery';
import { Zap } from 'lucide-react';

import { useGlobalStore } from '@/content-script/session-store/global';

import useElementObserver from '../hooks/useElementObserver';

export default function Slogan() {
  const isReady = useGlobalStore((state) => state.isWebsocketCaptured);

  const slogan =
    useGlobalStore((state) => state.customTheme.slogan) ||
    'Where knowledge begins';

  const container = useElementObserver({
    selector: '.mb-lg.flex.items-center.justify-center.pb-xs.md\\:text-center',
    observedIdentifier: 'complexity-main-page',
    callback: ({ element }) =>
      $(element)
        .toggleClass('tw-animate-pulse', !isReady)
        .find('> div:first-child')
        .addClass('tw-relative tw-fade-in tw-animate-in')
        .find('span')
        .addClass(
          'hover:tw-tracking-wide tw-transition-all tw-duration-300 tw-ease-in-out text-shadow-hover tw-select-none !tw-leading-[1.2rem]'
        )
        .text(slogan)
        .on('mouseenter', () => {
          $(element)
            .find('#slogan-decoration')
            .addClass('tw-translate-x-1/2 tw-right-1/2');
        })
        .on('mouseleave', () => {
          $(element)
            .find('#slogan-decoration')
            .removeClass('tw-translate-x-1/2 tw-right-1/2');
        }),
  });

  useEffect(() => {
    container && $(container).toggleClass('tw-animate-pulse', !isReady);
  }, [isReady, container]);

  if (!container) return null;

  return (
    <>
      {ReactDOM.createPortal(
        <div
          id="slogan-decoration"
          className="!tw-h-0 !tw-leading-[0px] tw-flex tw-items-center tw-gap-1 tw-justify-center tw-absolute tw-right-0 tw-top-[-1rem] tw-w-fit tw-font-sans tw-text-[.8rem] tw-text-accent-foreground tw-transition-all tw-duration-300 tw-fade-in tw-animate-in tw-select-none"
        >
          {slogan.length > 5 && (
            <>
              <span
                className={clsx({
                  'tw-text-muted-foreground tw-text-sha': !isReady,
                })}
              >
                {isReady ? 'enhanced' : 'loading...'}
              </span>
              {isReady && (
                <Zap className="tw-w-2 tw-h-2 tw-text-accent-foreground" />
              )}
            </>
          )}
        </div>,
        $(container).find('> div:first-child')[0]
      )}
    </>
  );
}
