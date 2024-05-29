import $ from 'jquery';

import observer from '@/utils/observer';
import { ui } from '@/utils/ui';
import {
  sleep,
  whereAmI,
} from '@/utils/utils';

import { popupSettingsStore } from './session-store/popup-settings';

function injectBaseStyles() {
  $('<link>')
    .attr({
      rel: 'stylesheet',
      type: 'text/css',
      href: chrome.runtime.getURL('base.css'),
      id: 'complexity-base-styles',
    })
    .appendTo('head');
}

function alterAttachButton() {
  if (
    !popupSettingsStore.getState().queryBoxSelectors.focus &&
    !popupSettingsStore.getState().queryBoxSelectors.collection
  )
    return;

  observer.onElementExist({
    selector: () => {
      const $element = $('button:contains("Attach"):last');

      if ($element.length && $element.find('>div>div').text() === 'Attach') {
        return [$element[0]];
      }

      return [];
    },
    callback({ element }) {
      $(element).find('>div').removeClass('gap-xs');
      $(element).find('>div>div').addClass('hidden');
    },
    observedIdentifier: 'alter-attach-button',
  });
}

function correctColorScheme() {
  observer.onAttributeChanges({
    targetNode: $('html')[0],
    attributes: ['class'],
    callback: ({ targetNode }) => {
      $(targetNode).toggleClass('tw-dark', $(targetNode).hasClass('dark'));

      document.title === "We'll be right back" &&
        $(targetNode).addClass('dark tw-dark');
    },
    immediateInvoke: true,
  });
}

function adjustSelectorsBorderRadius() {
  observer.onElementExist({
    selector: () =>
      $('textarea[placeholder="Ask anything..."]').next().toArray(),
    callback: ({ element }) => {
      $(element)
        .children()
        .each((_, child) => {
          $(child).addClass('[&_button]:tw-rounded-md');
        });
    },
    observedIdentifier: 'adjust-selectors-border-radius',
  });
}

function adjustQueryBoxWidth() {
  const {
    queryBoxSelectors: { collection, focus, imageGenModel, languageModel },
  } = popupSettingsStore.getState();

  if (!collection && !focus && !imageGenModel && !languageModel) return;

  observer.onElementExist({
    selector: () => [
      $('.pointer-events-auto.md\\:col-span-8').children().last()[0],
    ],
    callback: async ({ element }) => {
      if (whereAmI() !== 'thread') return;

      const $element = $(element);

      while (!$element.width()) {
        await sleep(50);
      }

      const $wrapper = $element.parent();

      $wrapper.addClass('tw-transition-all tw-duration-300');
      $wrapper.parent().addClass('tw-transition-all tw-duration-300');
      $wrapper.removeClass('md:col-span-8').addClass('col-span-12');
      $wrapper.parent().addClass('!tw-bottom-[5px]');

      observer.onAttributeChanges({
        targetNode: $(
          '.pointer-events-none.fixed.z-10.grid-cols-12.gap-xl.px-sm.py-sm.md\\:bottom-lg'
        )[0],
        attributes: ['class'],
        callback: ({ targetNode }) => {
          $(targetNode).addClass('!tw-bottom-[5px]');
        },
      });
    },
    observedIdentifier: 'adjust-query-box-width',
  });
}

function hideScrollToBottomButton() {
  observer.onElementExist({
    selector: '.pointer-events-auto .mb-2.flex.justify-center',
    callback: ({ element }) => {
      if (whereAmI() !== 'thread') return;

      $(element).addClass('!tw-hidden');
    },
    observedIdentifier: 'hide-scroll-to-bottom-button',
  });
}

function hideNativeProSearchSwitch() {
  // FIXME: Data retention switch also gets hidden (unintended)

  if (!popupSettingsStore.getState().queryBoxSelectors.focus) return;

  observer.onElementExist({
    selector:
      '.gap-sm.group\\/switch.flex.cursor-default.items-center.cursor-pointer',
    callback: ({ element }) => {
      $(element).addClass('!tw-hidden');
    },
    observedIdentifier: 'hide-native-pro-search-switch',
  });
}

function signThreadColumns() {
  observer.onElementExist({
    selector: () =>
      ui.getMessageBlocks().map(({ $messageBlock }) => $messageBlock[0]),
    callback() {},
    observedIdentifier: 'sign-thread-columns',
  });
}

function collapseEmptyThreadVisualColumns() {
  console.log(
    popupSettingsStore.getState().visualTweaks.collapseEmptyThreadVisualColumns
  );

  if (
    !popupSettingsStore.getState().visualTweaks.collapseEmptyThreadVisualColumns
  )
    return;

  observer.onElementExist({
    selector: () => [ui.getMessagesContainer()[0]],
    callback: ({ element }) => {
      observer.onDOMChanges({
        targetNode: element,
        callback: () => {
          const $messageContainer = $(element);

          $messageContainer.children().each((_, messageBlock) => {
            if (
              $(messageBlock).find('.visual-col > div > div:nth-child(2)')
                .length
            ) {
              $(messageBlock).find('.visual-col').show();
              $(messageBlock)
                .find('.message-col')
                .removeClass('col-span-12')
                .addClass('col-span-8');
            } else {
              $(messageBlock).find('.visual-col').hide();
              $(messageBlock)
                .find('.message-col')
                .removeClass('col-span-8')
                .addClass('col-span-12');
            }
          });
        },
      });
    },
    observedIdentifier: 'collapse-empty-thread-visual-columns',
  });
}

const uiTweaks = {
  injectBaseStyles,
  correctColorScheme,
  alterAttachButton,
  adjustSelectorsBorderRadius,
  adjustQueryBoxWidth,
  hideScrollToBottomButton,
  hideNativeProSearchSwitch,
  signThreadColumns,
  collapseEmptyThreadVisualColumns,
};

export default uiTweaks;
