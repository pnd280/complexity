import $ from 'jquery';

import DOMObserver from '@/utils/dom-observer';
import prismJs from '@/utils/prism';
import { ui } from '@/utils/ui';
import {
  jsonUtils,
  markdown2Html,
  waitForElement,
  whereAmI,
} from '@/utils/utils';

import { globalStore } from './session-store/global';
import { popupSettingsStore } from './session-store/popup-settings';

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

  DOMObserver.create('alter-attach-button', {
    target: document.querySelector('body > div'),
    config: {
      childList: true,
      subtree: true,
    },
    useRAF: true,
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
}

function correctColorScheme() {
  $(() => {
    const darkTheme = $('html').hasClass('dark');

    if (darkTheme) $('html').addClass('tw-dark');

    // downtime page
    if (document.title === "We'll be right back") {
      $('html').addClass('dark tw-dark');
      $('h1').addClass('!tw-text-[4rem]');
      $('p.message').addClass('tw-font-sans');
    }
  });
}

function hideScrollToBottomButton() {
  $(document.body).addClass('hide-scroll-to-bottom-button');
}

function calibrateMarkdownBlock() {
  $(document.body).toggleClass(
    'alternate-markdown-block',
    popupSettingsStore.getState().qolTweaks.markdownBlockToolbar &&
      whereAmI() === 'thread'
  );
}

function calibrateThreadMessageStickyHeader() {
  $(document.body).toggleClass(
    'thread-message-sticky-toolbar',
    popupSettingsStore.getState().qolTweaks.threadMessageStickyHeader &&
      whereAmI() === 'thread'
  );
}

async function collapseEmptyThreadVisualColumns() {
  $(document.body).toggleClass(
    'collapse-empty-thread-visual-columns',
    popupSettingsStore.getState().visualTweaks.collapseEmptyThreadVisualColumns
  );
}

async function alterMessageQuery() {
  if (!popupSettingsStore.getState().qolTweaks.threadMessageStickyHeader)
    return;

  const id = 'alter-message-query';

  const element = await waitForElement({
    selector: () => ui.getMessagesContainer()[0],
    timeout: 5000,
  });

  if (!element) return;

  if ($('.message-block').length === 0) ui.getMessageBlocks();

  DOMObserver.create(id, {
    target: element,
    config: {
      childList: true,
      subtree: true,
    },
    debounceTime: 200,
    useRAF: true,
    onAny: callback,
  });

  async function callback() {
    const $messageBlocks = $(`.message-block:not([data-${id}])`);
    let index = 0;

    function processNextMessageBlock() {
      if (index >= $messageBlocks.length) {
        return;
      }

      const $messageBlock = $($messageBlocks[index]);
      $messageBlock.attr(`data-${id}`, '');

      const $query = $messageBlock.find('.my-md.md\\:my-lg');

      rewriteQuery({ $query });

      index++;
      queueMicrotask(processNextMessageBlock);
    }

    queueMicrotask(processNextMessageBlock);
  }

  async function rewriteQuery({ $query }: { $query: JQuery<Element> }) {
    const mardownedText = markdown2Html($query.text());

    const $newQueryWrapper = $('<div>')
      .html(mardownedText)
      .attr('id', 'markdown-query-wrapper')
      .addClass(
        'prose dark:prose-invert inline leading-normal break-words min-w-0 [word-break:break-word] default font-display dark:text-textMainDark selection:bg-super/50 selection:text-textMain dark:selection dark:selection'
      );

    $newQueryWrapper.addClass(
      $query.text().length > 70 ? 'text-base' : 'text-3xl'
    );

    $query.append($newQueryWrapper);
  }
}

async function displayModelNextToAnswerHeading() {
  if (!popupSettingsStore.getState().qolTweaks.threadMessageStickyHeader)
    return;

  const id = 'display-model-next-to-answer-heading';

  const element = await waitForElement({
    selector: () => ui.getMessagesContainer()[0],
    timeout: 5000,
  });

  if (!element) return;

  if ($('.message-block').length === 0) ui.getMessageBlocks();

  requestIdleCallback(callback);

  DOMObserver.create(id, {
    target: element,
    config: {
      childList: true,
      subtree: true,
    },
    debounceTime: 200,
    useRAF: true,
    onAny: callback,
  });

  async function callback() {
    $(
      `.message-block .mt-sm.flex.items-center.justify-between>*:last-child:not([data-${id}-observed])`
    ).each((_, element) => {
      $(element).attr(`data-${id}-observed`, 'true');

      const { $answerHeading, $messageBlock } = ui.parseMessageBlock(
        $(element).closest('.message-block')
      );

      const $bottomButtonBar = $messageBlock.find(
        '.mt-sm.flex.items-center.justify-between'
      );

      if (!$bottomButtonBar.length) return;

      const bottomRightButtonBar = $bottomButtonBar.children().last();

      const modelName =
        bottomRightButtonBar.children().last().text() || 'CLAUDE 3 HAIKU';

      $answerHeading
        .find('div:contains("Answer"):last')
        .text(modelName.toUpperCase())
        .addClass(
          '!tw-font-mono !tw-text-xs tw-p-1 tw-px-2 tw-rounded-md tw-border tw-border-border tw-animate-in tw-fade-in tw-slide-in-from-right'
        );
    });
  }
}

async function highlightMarkdownBlocks() {
  if (!popupSettingsStore.getState().qolTweaks.markdownBlockToolbar) return;

  const element = await waitForElement({
    selector: () => ui.getMessagesContainer()[0],
    timeout: 5000,
  });

  if (!element) return;

  const id = 'highlight-markdown-block';

  requestIdleCallback(callback);

  DOMObserver.create(id, {
    target: element,
    config: {
      childList: true,
      subtree: true,
    },
    debounceTime: 200,
    useRAF: true,
    onAny: callback,
  });

  function callback() {
    // only process the last 10 message blocks
    const messageBlocks = ui.getMessageBlocks().slice(-10);

    let blockIndex = 0;

    function processNextBlock() {
      if (blockIndex >= messageBlocks.length) {
        return;
      }

      const { $messageBlock } = messageBlocks[blockIndex];
      const $bottomButtonBar = $messageBlock.find(
        '.mt-sm.flex.items-center.justify-between'
      );

      if ($bottomButtonBar.length) {
        const $codeBlocks = $bottomButtonBar
          .closest('.message-block')
          .find(`pre:not([data-${id}])`);

        let codeBlockIndex = 0;

        const processNextCodeBlock = () => {
          if (codeBlockIndex >= $codeBlocks.length) {
            blockIndex++;
            queueMicrotask(processNextBlock);
            return;
          }

          const pre = $codeBlocks[codeBlockIndex];
          $(pre).attr(`data-${id}`, '');

          const lang = $(pre).find('.absolute').text();

          prismJs.highlightBlock({ pre, lang });

          codeBlockIndex++;
          queueMicrotask(processNextCodeBlock);
        };

        queueMicrotask(processNextCodeBlock);
      } else {
        blockIndex++;
        queueMicrotask(processNextBlock);
      }
    }

    queueMicrotask(processNextBlock);
  }
}

const uiTweaks = {
  injectCustomStyles,
  correctColorScheme,
  alterAttachButton,
  hideScrollToBottomButton,
  collapseEmptyThreadVisualColumns,
  alterMessageQuery,
  displayModelNextToAnswerHeading,
  highlightMarkdownBlocks,
  calibrateMarkdownBlock,
  calibrateThreadMessageStickyHeader,
};

export default uiTweaks;
