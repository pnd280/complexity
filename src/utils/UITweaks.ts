import $ from 'jquery';

import { globalStore } from '@/content-script/session-store/global';
import { popupSettingsStore } from '@/content-script/session-store/popup-settings';
import { jsonUtils, whereAmI } from '@/utils/utils';
import UIUtils from './UI';

export default class UITweaks {
  static injectCustomStyles() {
    $(document.body).addClass('!tw-mr-0');

    globalStore.subscribe(({ customTheme: { customCSS } }) => {
      if ($('#complexity-custom-styles').length) {
        $('#complexity-custom-styles').text(
          jsonUtils.safeParse(customCSS || '')
        );
        return;
      }

      $('<style>')
        .attr({
          id: 'complexity-custom-styles',
        })
        .text(jsonUtils.safeParse(customCSS || ''))
        .appendTo('head');
    });

    const darkTheme = UIUtils.isDarkTheme();

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

        $(document.body).css(css);
      }
    );
  }

  static correctColorScheme() {
    $(() => {
      const darkTheme = UIUtils.isDarkTheme();

      if (darkTheme) $('html').addClass('tw-dark');

      // downtime page
      if (document.title === "We'll be right back") {
        $('html').addClass('dark tw-dark');
        $('h1').addClass('!tw-text-[4rem]');
        $('p.message').addClass('tw-font-sans');
      }
    });
  }

  static async applySettingsAsHTMLAttrs(location: ReturnType<typeof whereAmI>) {
    const settings = popupSettingsStore.getState();

    $(document.body)
      .toggleClass(
        'alter-attach-button',
        popupSettingsStore.getState().queryBoxSelectors.focus ||
          popupSettingsStore.getState().queryBoxSelectors.collection
      )
      .toggleClass(
        'collapse-empty-thread-visual-columns',
        settings.visualTweaks.collapseEmptyThreadVisualColumns &&
          location === 'thread'
      )
      .toggleClass(
        'alternate-markdown-block',
        settings.qolTweaks.alternateMarkdownBlock && location === 'thread'
      )
      .toggleClass(
        'thread-message-sticky-toolbar',
        popupSettingsStore.getState().qolTweaks.threadMessageStickyToolbar &&
          location === 'thread'
      )
      .toggleClass(
        'cplx-canvas',
        popupSettingsStore.getState().qolTweaks.alternateMarkdownBlock &&
          popupSettingsStore.getState().qolTweaks.canvas.enabled &&
          location === 'thread'
      );

    (function setMaskableMarkdownBlocks() {
      if ($(document.body).attr('data-maskable-md-blocks')) return;

      const maskableLangs = settings.qolTweaks.canvas.mask;

      const dataString = Object.entries(maskableLangs)
        .filter(([, maskable]) => maskable)
        .map(([lang]) => lang)
        .join(' ');

      if (dataString) {
        $(document.body).attr(`data-maskable-md-blocks`, dataString);
      }
    })();
  }

  static async applySelectableAttrs(location: ReturnType<typeof whereAmI>) {
    if (location !== 'thread') return;

    UIUtils.getMessageBlocks();
  }
}
