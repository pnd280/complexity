import $ from 'jquery';

import { Nullable } from '@/types/Utils';

import { stripHtml } from './utils';
import { cn } from '@/utils/shadcn-ui-utils';
import { popupSettingsStore } from '@/content-script/session-store/popup-settings';

type RewritePreBlockResult = {
  $container: JQuery<HTMLElement>;
  lang: string;
  isNative: boolean;
  id: string;
};

export const rewritePreBlock = (
  pre: Element
): Nullable<RewritePreBlockResult> => {
  if (!pre) return null;

  const $pre = $(pre) as JQuery<HTMLElement>;

  const isNative = !$pre.parent('#markdown-query-wrapper').length;
  const lang = getLang($pre);

  if ($pre.attr('data-processed')) {
    return {
      $container: $pre.prev() as JQuery<HTMLElement>,
      lang,
      isNative,
      id: $pre.attr('id') || '',
    };
  }

  const randomId = Math.random().toString(36).slice(2, 9);
  $pre.attr('id', `markdown-block-${randomId}`);

  const $container = createContainer(isNative);
  const $wrapper = isNative ? $pre.parent() : createWrapper();

  applyStyles($pre, $wrapper, isNative);
  setupCodeBlock($pre, lang, isNative);

  if (isNative) {
    $wrapper.prepend($container);
  } else {
    $pre.before($wrapper);
    $wrapper.append(pre).prepend($container);
  }

  $pre.attr('data-processed', 'true');

  return { $container, lang, isNative, id: randomId };
};

export const getLang = ($pre: JQuery<HTMLElement>): string => {
  return (
    $pre.attr('data-lang') ||
    $pre
      .find('code:first')
      .attr('class')
      ?.match(/language-(\S+)/)?.[1] ||
    $pre.find('.rounded-br').text() ||
    ''
  );
};

const createContainer = (isNative: boolean): JQuery<HTMLElement> => {
  const baseClasses = cn(
    'tw-sticky tw-w-full tw-z-[2] tw-rounded-t-md tw-overflow-hidden tw-transition-all',
    {
      'tw-top-[3.35rem]':
        !popupSettingsStore.getState().qolTweaks.threadMessageStickyHeader,
      'tw-top-[6.45rem]':
        popupSettingsStore.getState().qolTweaks.threadMessageStickyHeader,
    }
  );
  const nativeClasses = '!tw-h-[2.3125rem] tw-bg-secondary';
  return $('<div>').addClass(
    baseClasses + (isNative ? ` ${nativeClasses}` : '')
  );
};

const createWrapper = (): JQuery<HTMLElement> => {
  return $('<div>').addClass(
    'tw-rounded-md tw-relative tw-rounded-md tw-border !tw-border-accent-foreground-darker dark:!tw-border-muted'
  );
};

const applyStyles = (
  $pre: JQuery<HTMLElement>,
  $wrapper: JQuery<HTMLElement>,
  isNative: boolean
): void => {
  if (isNative) {
    $wrapper.addClass('tw-relative');
    $pre.addClass('!tw-m-0 !tw-rounded-none !tw-rounded-b-md');
    $pre
      .find('div:nth-child(2)')[0]
      ?.style.setProperty('padding-top', '0', 'important');
    $pre
      .find('div:nth-child(2)')
      .addClass('tw-rounded-none tw-rounded-b-md !tw-p-0');
    $pre.find('.rounded-br, button').addClass('!tw-hidden');
  } else {
    $pre.addClass(
      '!tw-rounded-none !tw-m-0 !tw-px-[.7rem] !tw-py-2 !tw-rounded-b-md'
    );
  }
};

const setupCodeBlock = (
  $pre: JQuery<HTMLElement>,
  lang: string,
  isNative: boolean
): void => {
  $pre
    .find('code:first')
    .css({
      padding: '0.5rem 0.75rem',
    })
    .toggleClass('!tw-p-0', !isNative);
};

export const extractCodeFromPreBlock = (preElement: Element) => {
  return stripHtml($(preElement)?.find('code:first').html());
};
