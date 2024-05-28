import $ from 'jquery';

import {
  popupSettingsStore,
} from '@/content-script/session-store/popup-settings';
import { whereAmI } from '@/utils/utils';

import useElementObserver from './useElementObserver';

type UseQueryBoxObserverProps = {
  setContainers: (containers: Element) => void;
  setFollowUpContainers: (containers: Element) => void;
  refetchUserSettings: () => void;
  refetchCollections: () => void;
  disabled?: boolean;
};

export default function useQueryBoxObserver({
  setContainers,
  setFollowUpContainers,
  refetchUserSettings,
  refetchCollections,
  disabled,
}: UseQueryBoxObserverProps) {
  useElementObserver({
    selector: () =>
      $('textarea[placeholder="Ask anything..."]').next().toArray(),
    callback: ({ element }) => {
      if (disabled) return;

      $(element).addClass('tw-col-span-2');

      const $buttonBarChildren = $(element).children(
        ':not(.mr-xs.flex.shrink-0.items-center)'
      );

      if (popupSettingsStore.getState().queryBoxSelectors.focus) {
        $buttonBarChildren.first().addClass('hidden');
      }

      setContainers(element);
      refetchUserSettings();
      refetchCollections();
    },
    observedIdentifier: 'model-selectors',
  });

  useElementObserver({
    selector: () => [
      $('textarea[placeholder="Ask follow-up"]').parents().eq(6)[0],
    ],
    callback: ({ element }) => {
      if (whereAmI() !== 'thread') return;

      if (disabled) return;

      const $followUpQueryBoxContainer = $(element);

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
          'tw-flex tw-justify-center tw-mb-1 tw-mx-auto [&>div>*]:tw-h-full [&_button_span]:!tw-font-sans'
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
      refetchCollections();
    },
    observedIdentifier: 'model-selectors',
  });
}
