import $ from 'jquery';

import observer from '@/utils/observer';
import { ui } from '@/utils/ui';
import {
  calculateRenderLines,
  jsonUtils,
  markdown2Html,
  sleep,
  whereAmI,
} from '@/utils/utils';

import { globalStore } from './session-store/global';
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

function injectCustomStyles() {
  globalStore.subscribe(({ customTheme: { customCSS } }) => {
    if ($('#complexity-custom-styles').length) {
      $('#complexity-custom-styles').text(
        jsonUtils.safeParse(customCSS || '') || ''
      );
      return;
    }

    $('<style>')
      .attr({
        id: 'complexity-custom-styles',
      })
      .text(jsonUtils.safeParse(customCSS || '') || '')
      .appendTo('head');
  });

  globalStore.subscribe(
    ({ customTheme: { uiFont, monoFont, accentColor } }) => {
      type CustomTheme = {
        '--ui-font'?: string;
        '--mono-font'?: string;
        '--accent-foreground'?: string;
        '--accent-foreground-darker'?: string;
        '--ring'?: string;
        '--ring-darker'?: string;
      };

      const css: CustomTheme = {
        '--ui-font': uiFont,
        '--mono-font': monoFont,
        '--accent-foreground': accentColor,
        '--accent-foreground-darker': `${accentColor}80`,
        '--ring': accentColor,
        '--ring-darker': `${accentColor}80`,
      };

      if (!uiFont) delete css['--ui-font'];
      if (!monoFont) delete css['--mono-font'];
      if (!accentColor) {
        delete css['--accent-foreground'];
        delete css['--accent-foreground-darker'];
        delete css['--ring'];
        delete css['--ring-darker'];
      }

      $('html').css(css);
    }
  );
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

      if (document.title === "We'll be right back") {
        $(targetNode).addClass('dark tw-dark');
        $('h1').addClass('!tw-text-[4rem]');
        $('p.message').addClass('tw-font-sans');
      }
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
      $wrapper.parent().addClass('md:!tw-bottom-[.3rem]');

      observer.onAttributeChanges({
        targetNode: $(
          '.pointer-events-none.fixed.z-10.grid-cols-12.gap-xl.px-sm.py-sm.md\\:bottom-lg'
        )[0],
        attributes: ['class'],
        callback: ({ targetNode }) => {
          $(targetNode).addClass('md:!tw-bottom-[.3rem]');
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
  if (!popupSettingsStore.getState().queryBoxSelectors.focus) return;

  observer.onElementExist({
    selector:
      '.gap-sm.group\\/switch.flex.cursor-default.items-center.cursor-pointer[data-testid="copilot-toggle"]',
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

function alternateMessageQuery({
  $messageBlock,
  $query,
}: {
  $messageBlock: JQuery<Element>;
  $query: JQuery<Element>;
}) {
  if (whereAmI() !== 'thread') return;

  const mardownedText = markdown2Html($query.text());

  const $newQueryWrapper = $('<div>')
    .html(mardownedText)
    .attr('id', 'markdown-query-wrapper')
    .addClass(
      'prose dark:prose-invert inline leading-normal break-words min-w-0 [word-break:break-word] default font-display dark:text-textMainDark selection:bg-super/50 selection:text-textMain dark:selection dark:selection'
    );

  const fontFamily =
    $('h1')?.css('font-family')?.split(',')?.[0]?.trim() || 'ui-sans-serif';

  const currentFontSize = parseInt($newQueryWrapper.css('font-size'));

  const calculatedWrappedLines = calculateRenderLines(
    $query.text(),
    $query.width() || $messageBlock.width()!,
    fontFamily,
    currentFontSize
  );

  $newQueryWrapper.addClass(
    calculatedWrappedLines > 1 ? 'text-base' : 'text-3xl'
  );

  $query.append($newQueryWrapper);

  $query.off('dblclick').on('dblclick', () => {
    const $buttonBar = $messageBlock.find(
      '.mt-sm.flex.items-center.justify-between'
    );

    const $editButton = $buttonBar.children().last().children().eq(1);

    $editButton.trigger('click');
  });
}

function alterMessageQuery() {
  if (!popupSettingsStore.getState().visualTweaks.threadQueryMarkdown) return;

  observer.onElementExist({
    selector: () => {
      const elements: {
        element: Element;
        args: JQuery<Element>;
      }[] = [];

      const messageBlocks = ui.getMessageBlocks();

      messageBlocks.forEach(({ $query, $messageBlock }) => {
        if (!$messageBlock?.length) return;

        elements.push({ element: $query[0], args: $messageBlock });
      });

      return elements;
    },
    callback: ({ element, args }) => {
      requestIdleCallback(() =>
        alternateMessageQuery({ $messageBlock: args!, $query: $(element) })
      );
    },
    observedIdentifier: 'alter-message-query',
  });
}

const uiTweaks = {
  injectBaseStyles,
  injectCustomStyles,
  correctColorScheme,
  alterAttachButton,
  adjustSelectorsBorderRadius,
  adjustQueryBoxWidth,
  hideScrollToBottomButton,
  hideNativeProSearchSwitch,
  signThreadColumns,
  collapseEmptyThreadVisualColumns,
  alterMessageQuery,
};

export default uiTweaks;
