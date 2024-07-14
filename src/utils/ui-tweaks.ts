import $ from 'jquery';

import DOMObserver from '@/utils/dom-observer';
import { ui } from '@/utils/ui';
import { jsonUtils, markdown2Html, whereAmI } from '@/utils/utils';

import { globalStore } from '@/content-script/session-store/global';
import { popupSettingsStore } from '@/content-script/session-store/popup-settings';
import { extractCodeFromPreBlock, getLang } from '@/utils/markdown-block';
import { webpageMessenger } from '@/content-script/main-world/messenger';
import { shikiContentScript } from '@/content-script/main-world/shiki';

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

  const darkTheme = ui.isDarkTheme();

  globalStore.subscribe(
    ({ customTheme: { uiFont, monoFont, accentColor } }) => {
      type CustomTheme = {
        '--ui-font'?: string;
        '--mono-font'?: string;
        '--accent-foreground'?: string;
        '--accent-foreground-darker'?: string;
        '--ring'?: string;
        '--ring-darker'?: string;
        '--selection'?: string;
      };

      const css: CustomTheme = {
        '--ui-font': uiFont,
        '--mono-font': monoFont,
        '--accent-foreground': accentColor,
        '--accent-foreground-darker': `${accentColor}80`,
        '--ring': accentColor,
        '--ring-darker': `${accentColor}80`,
        '--selection': `${accentColor}60`,
      };

      if (!uiFont) delete css['--ui-font'];
      if (!monoFont) delete css['--mono-font'];
      if (!accentColor) {
        delete css['--accent-foreground'];
        delete css['--accent-foreground-darker'];
        delete css['--ring'];
        delete css['--ring-darker'];
        delete css['--selection'];
      }

      if (!darkTheme) {
        delete css['--accent-foreground'];
        delete css['--accent-foreground-darker'];
        delete css['--ring'];
        delete css['--ring-darker'];
        delete css['--selection'];
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

  $(document.body).toggleClass('alter-attach-button', true);

  DOMObserver.create('alter-attach-button', {
    target: document.body,
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
    const darkTheme = ui.isDarkTheme();

    if (darkTheme) $('html').addClass('tw-dark');

    // downtime page
    if (document.title === "We'll be right back") {
      $('html').addClass('dark tw-dark');
      $('h1').addClass('!tw-text-[4rem]');
      $('p.message').addClass('tw-font-sans');
    }
  });
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

async function alterMessageQuery(messagesContainer: Element) {
  if (!popupSettingsStore.getState().qolTweaks.threadMessageStickyHeader)
    return;

  const id = 'alter-message-query';

  if ($('#message-block').length === 0) ui.getMessageBlocks();

  DOMObserver.create(id, {
    target: messagesContainer,
    config: {
      childList: true,
      subtree: true,
    },
    debounceTime: 200,
    useRAF: true,
    onAny: callback,
  });

  async function callback() {
    const $messageBlocks = $(`#message-block:not([data-${id}])`);

    $messageBlocks.each((_, messageBlock) => {
      queueMicrotask(() => {
        const $messageBlock = $(messageBlock);
        $messageBlock.attr(`data-${id}`, '');

        const $query = $messageBlock.find('.my-md.md\\:my-lg');

        rewriteQuery({ $query });
      });
    });
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

async function displayModelNextToAnswerHeading(messagesContainer: Element) {
  if (!popupSettingsStore.getState().qolTweaks.threadMessageStickyHeader)
    return;

  const id = 'display-model-next-to-answer-heading';

  if ($('#message-block').length === 0) ui.getMessageBlocks();

  requestIdleCallback(callback);

  DOMObserver.create(id, {
    target: messagesContainer,
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
      `#message-block .mt-sm.flex.items-center.justify-between>*:last-child:not([data-${id}-observed])`
    ).each((_, element) => {
      $(element).attr(`data-${id}-observed`, 'true');

      const { $answerHeading, $messageBlock } = ui.parseMessageBlock(
        $(element).closest('#message-block')
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

async function highlightMarkdownBlocks(messagesContainer: Element) {
  if (!popupSettingsStore.getState().qolTweaks.markdownBlockToolbar) return;

  const id = 'highlight-markdown-block';

  await shikiContentScript.waitForInitialization();

  requestIdleCallback(callback);

  DOMObserver.create(id, {
    target: messagesContainer,
    config: {
      childList: true,
      subtree: true,
    },
    debounceTime: 200,
    useRAF: true,
    onAny: callback,
  });

  function callback() {
    const messageBlocks = ui.getMessageBlocks().slice(-10);

    messageBlocks.forEach(({ $messageBlock }) => {
      queueMicrotask(() => {
        const $bottomButtonBar = $messageBlock.find(
          '.mt-sm.flex.items-center.justify-between'
        );

        if ($bottomButtonBar.length) {
          const $codeBlocks = $bottomButtonBar
            .closest('#message-block')
            .find(`pre:not([data-${id}])`);

          $codeBlocks.each((_, pre) => {
            queueMicrotask(async () => {
              $(pre).attr(`data-${id}`, '');

              const html = await webpageMessenger.sendMessage({
                event: 'getHighlightedCodeAsHtml',
                payload: {
                  code: extractCodeFromPreBlock(pre),
                  lang: getLang($(pre)),
                },
                timeout: 5000,
              });

              if (!html) return;

              $(pre).find('code:first').html($(html).find('code').html());
            });
          });
        }
      });
    });
  }
}

const uiTweaks = {
  injectCustomStyles,
  correctColorScheme,
  alterAttachButton,
  collapseEmptyThreadVisualColumns,
  alterMessageQuery,
  displayModelNextToAnswerHeading,
  calibrateMarkdownBlock,
  calibrateThreadMessageStickyHeader,
  highlightMarkdownBlocks,
};

export default uiTweaks;
