import $ from 'jquery';

import { Nullable } from '@/types/Utils';

import { stripHtml } from './utils';

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
    ''
  );
};

const createContainer = (isNative: boolean): JQuery<HTMLElement> => {
  const baseClasses =
    'tw-sticky tw-top-[var(--markdownBlockToolbarTop)] tw-bottom-[4rem] tw-w-full tw-z-[2] tw-rounded-t-md tw-overflow-hidden tw-transition-all';
  const nativeClasses =
    'markdown-block-toolbar !tw-h-[2.3125rem] tw-bg-secondary';
  return $('<div>').addClass(
    baseClasses + (isNative ? ` ${nativeClasses}` : '')
  );
};

const createWrapper = (): JQuery<HTMLElement> => {
  return $('<div>')
    .addClass(
      'tw-rounded-md tw-relative tw-rounded-md tw-border !tw-border-accent-foreground-darker dark:!tw-border-muted'
    )
    .attr('id', 'markdown-block-wrapper');
};

const applyStyles = (
  $pre: JQuery<HTMLElement>,
  $wrapper: JQuery<HTMLElement>,
  isNative: boolean
): void => {
  if (isNative) {
    $wrapper.addClass('tw-relative markdown-block-wrapper');
    $pre.addClass('!tw-m-0 !tw-rounded-none !tw-rounded-b-md');
    $pre
      .find('div:nth-child(2)')[0]
      ?.style.setProperty('padding-top', '0', 'important');
    $pre
      .find('div:nth-child(2)')
      .addClass('tw-rounded-none tw-rounded-b-md !tw-p-0');
    $pre.find('.border-b.border-r.font-thin, button').addClass('!tw-hidden');
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
  const $code = $pre.find('code:first');

  if (!isNative) {
    $code.addClass('!tw-p-0');
  }
};

export const extractTextFromBlock = (preElement: Element) => {
  const code = stripHtml($(preElement)?.find('code:first').html());

  return code;
};
