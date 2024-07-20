import $ from 'jquery';
import { useEffect } from 'react';

import { popupSettingsStore } from '@/content-script/session-store/popup-settings';
import DOMObserver from '@/utils/DOMObserver';
import { cn } from '@/utils/shadcn-ui-utils';
import UIUtils from '@/utils/UI';
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
    const alterAttachButtonId = 'alter-attach-button';

    DOMObserver.create(mainId, {
      target: document.body,
      config: { childList: true, subtree: true },
      source: 'hook',
      onAny() {
        if (disabled) return;

        const $buttonBar = UIUtils.getActiveQueryBoxTextarea({ type: 'main' })
          .parent()
          .next();

        if (!$buttonBar.length || $buttonBar.attr(`data-${mainId}`)) return;

        $buttonBar.attr(`data-${mainId}`, 'true');

        $buttonBar.addClass(() =>
          cn(
            'tw-col-span-3 tw-col-start-1 !tw-col-end-4 tw-flex-wrap tw-gap-y-1',
            {
              'tw-mr-[7rem]':
                !popupSettingsStore.getState().queryBoxSelectors.focus,
              'tw-mr-10': popupSettingsStore.getState().queryBoxSelectors.focus,
            }
          )
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

    if (location === 'thread' || location === 'page') {
      DOMObserver.create(followUpId, {
        target: document.body,
        config: { childList: true, subtree: true },
        throttleTime: 200,
        source: 'hook',
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

    DOMObserver.create(alterAttachButtonId, {
      target: document.body,
      config: {
        childList: true,
        subtree: true,
      },
      source: 'hook',
      onAny() {
        const $attachButton = $('button:contains("Attach"):last');

        if (
          $attachButton.length &&
          $attachButton.find('>div>div').text() === 'Attach'
        ) {
          $attachButton.find('>div').removeClass('gap-xs');
          $attachButton.find('>div>div').addClass('hidden');
        }
      },
    });

    return () => {
      DOMObserver.destroy(mainId);
      DOMObserver.destroy(followUpId);
      DOMObserver.destroy(alterAttachButtonId);
    };
  }, [
    disabled,
    location,
    refetchUserSettings,
    setContainers,
    setFollowUpContainers,
  ]);
}
