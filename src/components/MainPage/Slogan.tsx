import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import clsx from 'clsx';
import $ from 'jquery';
import { Zap } from 'lucide-react';

import { useGlobalStore } from '@/content-script/session-store/global';

import useElementObserver from '../hooks/useElementObserver';

export default function Slogan() {
  const isReady = useGlobalStore((state) => state.isReady);

  const container = useElementObserver({
    selector: '.mb-lg.flex.items-center.justify-center.pb-xs.md\\:text-center',
    observedIdentifier: 'complexity-main-page',
    callback: ({ element }) =>
      $(element)
        .addClass('tw-tracking-widest')
        .toggleClass('tw-animate-pulse', !isReady)
        .toggleClass('!tw-tracking-[.2em]', isReady)
        .find('> div:first-child')
        .addClass('tw-group tw-relative tw-fade-in tw-animate-in')
        .find('span')
        .addClass(
          'group-hover:tw-tracking-[.2em] tw-transition-all tw-duration-300 tw-ease-in-out hover:tw-text-accent-foreground tw-select-none'
        )
        .text('Perplexity'.toUpperCase()),
  });

  useEffect(() => {
    container &&
      $(container)
        .toggleClass('tw-animate-pulse', !isReady)
        .toggleClass('!tw-tracking-[.2em]', isReady);
  }, [isReady, container]);

  if (!container) return null;

  return (
    <>
      {ReactDOM.createPortal(
        <div className="tw-flex tw-items-center gap-1 tw-justify-center tw-absolute tw-right-0 tw-top-[-1rem] group-hover:tw-right-1/2 group-hover:tw-translate-x-1/2 tw-w-fit tw-h-fit tw-font-sans tw-text-[.8rem] tw-text-accent-foreground tw-transition-all tw-duration-300 tw-fade-in tw-animate-in tw-select-none tw-tracking-normal">
          <>
            <span
              className={clsx({
                'tw-text-muted-foreground': !isReady,
              })}
            >
              {isReady ? 'enhanced' : 'loading...'}
            </span>
            {isReady && (
              <Zap className="tw-w-2 tw-h-2 tw-text-accent-foreground" />
            )}
          </>
        </div>,
        $(container).find('> div:first-child')[0]
      )}
    </>
  );
}
