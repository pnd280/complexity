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
  const location = whereAmI(useRouter().url);

  useEffect(() => {
    const mainId = 'main-query-box-selectors';
    const followUpId = 'follow-up-query-box-selectors';

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
    if (location === 'thread') {
      DOMObserver.create(followUpId, {
        target: document.body,
        config: { childList: true, subtree: true },
        throttleTime: 200,
        priority: 999,
        useRAF: true,
        onAdd() {
          if (disabled) return;

          const $toolbar = $('textarea[placeholder="Ask follow-up"]')
            .parent()
            .next();

          if (!$toolbar.length || $toolbar.attr(`data-${followUpId}`)) return;

          $toolbar.attr(`data-${followUpId}`, 'true');

          const $selectorContainer = $('<div>').addClass(
            'tw-flex tw-flex-wrap tw-items-center tw-zoom-in'
          );

          $toolbar.append($selectorContainer);

          setFollowUpContainers($selectorContainer[0]);

          refetchUserSettings();
        },
      });
    } else {
      DOMObserver.destroy(followUpId);
    }
  }, [
    disabled,
    location,
    refetchUserSettings,
    setContainers,
    setFollowUpContainers,
  ]);
}
