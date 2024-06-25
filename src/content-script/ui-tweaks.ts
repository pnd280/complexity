import $ from 'jquery';
import { debounce } from 'lodash';

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
import { queryBoxStore } from './session-store/query-box';

function injectBaseStyles() {
  if (whereAmI() === 'api') $('html').addClass('tw-dark dark');

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
      const darkTheme = $('html').hasClass('dark');

      type CustomTheme = {
        '--ui-font'?: string;
        '--mono-font'?: string;
        '--accent-foreground'?: string;
        '--accent-foreground-darker'?: string;
        '--ring'?: string;
        '--ring-darker'?: string;
        '--selection'?: string;
        '--selection-foreground'?: string;
      };

      const css: CustomTheme = {
        '--ui-font': uiFont,
        '--mono-font': monoFont,
        '--accent-foreground': accentColor,
        '--accent-foreground-darker': `${accentColor}80`,
        '--ring': accentColor,
        '--ring-darker': `${accentColor}80`,
        '--selection': !darkTheme ? `${accentColor}80` : undefined,
        '--selection-foreground': darkTheme ? accentColor : undefined,
      };

      if (!uiFont) delete css['--ui-font'];
      if (!monoFont) delete css['--mono-font'];
      if (!accentColor) {
        delete css['--accent-foreground'];
        delete css['--accent-foreground-darker'];
        delete css['--ring'];
        delete css['--ring-darker'];
        delete css['--selection'];
        delete css['--selection-foreground'];
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
      $wrapper.parent().addClass('md:!tw-bottom-[.3rem] !tw-z-20');

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
    selector: () => ui.getNativeProSearchSwitchWrapper().toArray(),
    callback: ({ element }) => {
      $(element).addClass('!tw-hidden');
    },
    observedIdentifier: 'hide-native-pro-search-switch',
  });
}

function correctNativeProSearchSwitch() {
  if (!popupSettingsStore.getState().queryBoxSelectors.focus) return;

  queryBoxStore.subscribe(({ webAccess: { allowWebAccess, proSearch } }) => {
    const $nativeProSearchWrapper = ui.getNativeProSearchSwitchWrapper();

    const currentState = $nativeProSearchWrapper
      .find('button')
      .attr('data-state');

    if (currentState === 'checked' && (!allowWebAccess || !proSearch)) {
      return $nativeProSearchWrapper.find('button').trigger('click');
    }

    if (currentState === 'unchecked' && allowWebAccess && proSearch) {
      return $nativeProSearchWrapper.find('button').trigger('click');
    }
  });
}

function collapseEmptyThreadVisualColumns() {
  if (
    !popupSettingsStore.getState().visualTweaks.collapseEmptyThreadVisualColumns
  )
    return;

  observer.onElementExist({
    selector: () =>
      ui
        .getMessageBlocks()
        .map(({ $messageBlock }) => $messageBlock.find('.visual-col')[0]),
    callback: ({ element }) => {
      const collapseExpand = debounce(() => {
        if ($(element).find('div > div:nth-child(2)').length) {
          $(element).show();
          $(element).prev().removeClass('col-span-12').addClass('col-span-8');
        } else {
          $(element).hide();
          $(element).prev().removeClass('col-span-8').addClass('col-span-12');
        }
      }, 100);

      requestIdleCallback(() => {
        collapseExpand();

        observer.onDOMChanges({
          targetNode: element,
          callback: collapseExpand,
        });
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
}

function alterMessageQuery() {
  if (!popupSettingsStore.getState().qolTweaks.threadMessageStickyToolbar)
    return;

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

function displayModelNextToAnswerHeading() {
  if (!popupSettingsStore.getState().qolTweaks.threadMessageStickyToolbar)
    return;

  observer.onElementExist({
    selector: () => {
      const elements: {
        element: Element;
        args: {
          answerHeading: Element;
          modelName: string;
        };
      }[] = [];

      const messageBlocks = ui.getMessageBlocks();

      messageBlocks.forEach(({ $answerHeading, $messageBlock }) => {
        if (!$messageBlock?.length) return;

        const bottomRightButtonBar = $messageBlock
          .find('.mt-sm.flex.items-center.justify-between')
          ?.children()
          .last();

        // hide the bar
        $messageBlock
          .find('.mt-sm.flex.items-center.justify-between')
          .addClass('!tw-hidden');

        const modelName = bottomRightButtonBar.children().last().text();

        elements.push({
          element: bottomRightButtonBar.children().last()[0],
          args: {
            answerHeading: $answerHeading[0],
            modelName,
          },
        });
      });

      return elements;
    },
    callback: ({ element, args }) => {
      if (!element || !args?.answerHeading) return;

      args.modelName &&
        $(args.answerHeading)
          .find('div:contains("Answer"):last')
          .text(args.modelName.toUpperCase())
          .addClass(
            '!tw-font-mono !tw-text-xs tw-p-1 tw-px-2 tw-rounded-md tw-border tw-border-border tw-animate-in tw-fade-in tw-slide-in-from-right'
          );
    },
    observedIdentifier: 'display-model-next-to-answer-heading',
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
  collapseEmptyThreadVisualColumns,
  alterMessageQuery,
  displayModelNextToAnswerHeading,
  correctNativeProSearchSwitch,
};

export default uiTweaks;
