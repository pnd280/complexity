import { useEffect } from 'react';

import $ from 'jquery';

import {
  popupSettingsStore,
} from '@/content-script/session-store/popup-settings';
import { cn } from '@/lib/utils';
import DOMObserver from '@/utils/dom-observer';
import { ui } from '@/utils/ui';
import { whereAmI } from '@/utils/utils';

import useRouter from './useRouter';

type UseQueryBoxObserverProps = {
  setContainers: (containers: Element) => void;
  setFollowUpContainers: (containers: Element) => void;
  refetchUserSettings: () => void;
  disabled?: boolean;
};

export default function useQueryBoxObserver({
  setContainers,
  setFollowUpContainers,
  refetchUserSettings,
  disabled,
}: UseQueryBoxObserverProps) {
  const location = whereAmI(useRouter());

  useEffect(() => {
    const mainId = 'main-query-box-selectors';
    const followUpId = 'follow-up-query-box-selectors';

    if (location === 'home') {
      DOMObserver.create(mainId, {
        target: document.body,
        config: { childList: true, subtree: true },

        onAny() {
          if (disabled) return;

          const $buttonBar = ui
            .findActiveQueryBoxTextarea({ type: 'main' })
            .parent()
            .next();

          if (!$buttonBar.length || $buttonBar.attr(`data-${mainId}`)) return;

          $buttonBar.attr(`data-${mainId}`, 'true');

          $buttonBar.addClass(() =>
            cn('tw-col-span-3 tw-col-start-1 tw-flex-wrap tw-gap-y-1', {
              'tw-mr-[7rem]':
                !popupSettingsStore.getState().queryBoxSelectors.focus,
              'tw-mr-10': popupSettingsStore.getState().queryBoxSelectors.focus,
            })
          );

          const $buttonBarChildren = $buttonBar.children(
            ':not(.mr-xs.flex.shrink-0.items-center)'
          );

          if (popupSettingsStore.getState().queryBoxSelectors.focus) {
            $buttonBarChildren.first().addClass('hidden');
          }

          setContainers($buttonBar[0]);

          refetchUserSettings();
        },
      });
    } else {
      DOMObserver.destroy(mainId);
    }

    DOMObserver.create(followUpId, {
      target: document.body,
      config: { childList: true, subtree: true },
      throttleTime: 200,
      priority: 999,
      useRAF: true,
      onAdd() {
        if (disabled) return;

        const $followUpQueryBoxContainer = $(
          'textarea[placeholder="Ask follow-up"]'
        )
          .parents()
          .eq(6);

        if (
          !$followUpQueryBoxContainer.length ||
          $followUpQueryBoxContainer.attr(`data-${followUpId}`)
        )
          return;

        $followUpQueryBoxContainer.attr(`data-${followUpId}`, 'true');

        if (
          $followUpQueryBoxContainer &&
          $followUpQueryBoxContainer.children().eq(1).attr('class') ===
            'mb-2 flex justify-center'
        ) {
          $('.mb-2.flex.justify-center').prependTo(
            $followUpQueryBoxContainer as JQuery<HTMLElement>
          );
        }

        const $container = $('<div>')
          .addClass(
            'tw-flex tw-justify-center tw-mb-2 tw-mx-auto [&>div>*]:tw-h-full [&_button_span]:!tw-font-sans'
          )
          .attr('id', 'query-box-follow-up-container');

        $followUpQueryBoxContainer.children().last().before($container);

        const $selectorContainer = $('<div>').addClass(
          'tw-w-fit tw-p-1 tw-rounded-[.5rem] tw-border tw-border-border tw-shadow-lg tw-bg-background dark:tw-bg-secondary tw-flex tw-flex-wrap tw-justify-center tw-items-center tw-h-10 tw-animate-in tw-slide-in-from-bottom tw-zoom-in tw-transition-all tw-duration-300 tw-min-w-[100px]'
        );

        $followUpQueryBoxContainer
          .children()
          .last()
          .prev()
          .append($selectorContainer);

        $followUpQueryBoxContainer.children().last().before($container);

        setFollowUpContainers($selectorContainer[0]);

        refetchUserSettings();
      },
    });

    return () => {
      DOMObserver.destroy(mainId);
      DOMObserver.destroy(followUpId);
    };
  }, [
    disabled,
    location,
    refetchUserSettings,
    setContainers,
    setFollowUpContainers,
  ]);
}
