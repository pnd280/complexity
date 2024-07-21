import $ from 'jquery';

import { ReactNodeActionReturnType } from '@/content-script/main-world/react-node';
import { webpageMessenger } from '@/content-script/main-world/webpage-messenger';
import { popupSettingsStore } from '@/content-script/session-store/popup-settings';
import { cn } from '@/utils/shadcn-ui-utils';

import { getReactPropsKey, stripHtml } from './utils';

type PreBlockTransformResult = {
  $wrapper: JQuery<HTMLElement>;
  $container: JQuery<HTMLElement>;
  lang: string;
  isNative: boolean;
  id: string;
};

export default class MarkdownBlockUtils {
  static transformPreBlock(
    pre: Element | null
  ): PreBlockTransformResult | null {
    if (!pre) return null;

    const $pre = $(pre) as JQuery<HTMLElement>;
    const isNative = !$pre.parent('#markdown-query-wrapper').length;
    const lang = this.getLang($pre);

    if ($pre.attr('data-toolbar')) {
      return this.handleExistingToolbar($pre, lang, isNative);
    }

    const id = this.generateId();
    $pre.attr('id', `md-block-${id}`);

    const { $container, $wrapper } = this.createElements(isNative, $pre);

    this.applyStyles($pre, $wrapper, isNative);
    this.setupCodeBlock($pre, lang, isNative);
    this.appendElements($pre, $wrapper, $container, isNative);

    $pre.attr('data-toolbar', 'true');

    return { $wrapper, $container, id, lang, isNative };
  }

  private static handleExistingToolbar(
    $pre: JQuery<HTMLElement>,
    lang: string,
    isNative: boolean
  ): PreBlockTransformResult {
    return {
      $wrapper: $pre.parent() as JQuery<HTMLElement>,
      $container: $pre.prev() as JQuery<HTMLElement>,
      lang,
      isNative,
      id: $pre.attr('id') || '',
    };
  }

  private static generateId(): string {
    return Math.random().toString(36).slice(2, 9);
  }

  private static createElements(isNative: boolean, $pre: JQuery<HTMLElement>) {
    const $container = this.createContainer(isNative);
    const $wrapper = isNative ? $pre.parent() : this.createWrapper(isNative);
    return { $container, $wrapper };
  }

  private static appendElements(
    $pre: JQuery<HTMLElement>,
    $wrapper: JQuery<HTMLElement>,
    $container: JQuery<HTMLElement>,
    isNative: boolean
  ) {
    if (isNative) {
      $wrapper.prepend($container);
    } else {
      $pre.before($wrapper);
      $wrapper.append($pre).prepend($container);
    }
  }

  static getLang = ($pre: JQuery<HTMLElement>): string => {
    return (
      $pre.attr('data-lang') ||
      $pre
        .find('code')
        .attr('class')
        ?.match(/language-(\S+)/)?.[1] ||
      $pre.find('.rounded-br').text() ||
      ''
    );
  };

  private static createContainer(isNative: boolean): JQuery<HTMLElement> {
    const baseClasses = cn(
      'tw-sticky tw-w-full tw-z-[2] tw-rounded-t-md tw-overflow-hidden tw-transition-all',
      {
        'tw-top-[3.35rem]':
          !popupSettingsStore.getState().qolTweaks.threadMessageStickyToolbar,
        'tw-top-[6.45rem]':
          popupSettingsStore.getState().qolTweaks.threadMessageStickyToolbar,
      }
    );
    const nativeClasses = '!tw-h-[2.3125rem] tw-bg-secondary';
    return $('<div>').addClass(
      baseClasses + (isNative ? ` ${nativeClasses}` : '')
    );
  }

  private static createWrapper(isNative: boolean): JQuery<HTMLElement> {
    return $('<div>')
      .addClass('tw-rounded-md tw-relative tw-rounded-md')
      .toggleClass('tw-border !tw-border-border', !isNative);
  }

  private static applyStyles(
    $pre: JQuery<HTMLElement>,
    $wrapper: JQuery<HTMLElement>,
    isNative: boolean
  ): void {
    if (isNative) {
      $wrapper.addClass('tw-relative');
      $pre.addClass('!tw-m-0 !tw-rounded-md');
      $pre
        .find('div:nth-child(2)')[0]
        ?.style.setProperty('padding-top', '0', 'important');
      $pre
        .find('div:nth-child(2)')
        .addClass('tw-rounded-none tw-rounded-md !tw-p-0');
      $pre.find('.rounded-br, button').addClass('!tw-hidden');
    } else {
      $pre.addClass(
        '!tw-m-0 !tw-px-[.7rem] !tw-py-2 !tw-rounded-md tw-overflow-auto'
      );
    }
  }

  private static setupCodeBlock(
    $pre: JQuery<HTMLElement>,
    lang: string,
    isNative: boolean
  ): void {
    $pre
      .find('code')
      .css({
        padding: '0.5rem 0.75rem',
      })
      .toggleClass('!tw-p-0', !isNative);
  }

  static extractCodeFromPreBlock = (preElement: Element) => {
    return stripHtml($(preElement)?.find('code').html());
  };

  static extractCodeFromPreReactNode = async (preElement: Element) => {
    const highlightedCode = (await webpageMessenger.sendMessage({
      event: 'getReactNodeData',
      payload: {
        querySelector: `#${preElement.id}`,
        action: 'getCodeFromPreBlock',
      },
      timeout: 5000,
    })) as ReactNodeActionReturnType['getCodeFromPreBlock'];

    if (highlightedCode) return highlightedCode;

    return MarkdownBlockUtils.extractCodeFromPreBlock(preElement);
  };

  static getPreBlockLocalIndex = ($pre: JQuery<HTMLElement>): number => {
    const messageBlock = $pre[0].closest('.message-block');

    if (!messageBlock) return -1;

    return $(messageBlock).find('pre').index($pre);
  };

  static extractLanguage = (pre: HTMLElement) => {
    try {
      const propsKey = getReactPropsKey(pre);

      if (!propsKey) return;

      const props = (pre as any)[propsKey];

      if (typeof props !== 'object') return;

      const className = props.children?.[0]?.props?.className;
      const lang = className?.split('-').slice(1).join('-');
      return lang || 'text';
    } catch (e) {
      return 'text';
    }
  };

  static async isInFlight(pre: HTMLElement) {
    const messageBlock = pre.closest('.message-block');

    if (!messageBlock) return false;

    if ($(messageBlock).find('.mt-sm.flex.items-center.justify-between').length)
      return false;

    return getInFlightStateFromReactNode(pre);

    async function getInFlightStateFromReactNode(pre: HTMLElement) {
      const messageContent = (await webpageMessenger.sendMessage({
        event: 'getReactNodeData',
        payload: {
          querySelector: `.message-block:has(#${pre.id})`,
          action: 'getMessageData',
        },
        timeout: 5000,
      })) as ReactNodeActionReturnType['getMessageData'];

      if (!messageContent) return false;

      const preBlockCodeContent = (await webpageMessenger.sendMessage({
        event: 'getReactNodeData',
        payload: {
          querySelector: `#${pre.id}`,
          action: 'getCodeFromPreBlock',
        },
        timeout: 5000,
      })) as ReactNodeActionReturnType['getCodeFromPreBlock'];

      return !messageContent.answer.includes(`${preBlockCodeContent}\`\`\``);
    }
  }

  static async handleVisibility(pre: HTMLElement) {
    const $pre = $(pre);

    $pre
      .closest('div.w-full.max-w-\\[90vw\\]')
      .addClass(
        '!tw-visible !tw-opacity-100 [&>*]:!tw-visible [&>*]:!tw-opacity-100 tw-transition-all'
      )
      .toggleClass(
        '[&>:not(.canvas-placeholder)]:!tw-invisible',
        $pre.attr('data-mask') === 'true'
      );
  }

  static async handleInFlightState(pre: HTMLElement) {
    const messageBlock = pre.closest('.message-block');

    if (!messageBlock) return false;

    const isInFlight = popupSettingsStore.getState().qolTweaks.canvas.enabled
      ? await MarkdownBlockUtils.isInFlight(pre)
      : false;

    $(messageBlock)
      .find(`.${pre.id}-inflight-indicator`)
      .attr('data-inflight', (!!isInFlight).toString());

    return isInFlight;
  }

  static async highlightNativelyUnsupportedLang(pre: HTMLElement) {
    const supportedLangs = ['gdscript', 'blade'];

    if ($(pre).attr('data-mask') === 'true' || $(pre).attr('data-highlighted'))
      return true;

    if (supportedLangs.includes(MarkdownBlockUtils.getLang($(pre)))) {
      const html = await webpageMessenger.sendMessage({
        event: 'getHighlightedCodeAsHtml',
        payload: {
          code: await MarkdownBlockUtils.extractCodeFromPreReactNode(
            $(`#${pre.id}`)[0]
          ),
          lang: MarkdownBlockUtils.getLang($(pre)),
        },
        timeout: 5000,
        suppressTimeoutError: true,
      });

      if (html) $(pre).find('code').html($(html).find('code').html());
    }

    $(pre).attr('data-highlighted', 'true');
  }
}
