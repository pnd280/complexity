import $ from 'jquery';

import { whereAmI } from './utils';

export const ui = {
  findActiveQueryBoxTextarea() {
    return $('button[aria-label="Submit"]:last')
      .parents()
      .find('textarea[placeholder]:last');
  },
  getStickyHeader() {
    return $('.sticky.left-0.right-0.top-0.z-20.border-b');
  },
  findMostVisibleElementIndex(elements: Element[]) {
    let maxVisiblePercentage = 0;
    let indexWithMaxVisible = -1;

    elements.forEach((element, index) => {
      const visiblePercentage = getVisiblePercentage(element);
      if (visiblePercentage > maxVisiblePercentage) {
        maxVisiblePercentage = visiblePercentage;
        indexWithMaxVisible = index;
      }
    });

    return indexWithMaxVisible;

    function getVisiblePercentage(element: Element) {
      const rect = element.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const windowWidth =
        window.innerWidth || document.documentElement.clientWidth;

      // Calculate the visible part of the element
      const visibleWidth = Math.max(
        0,
        Math.min(rect.right, windowWidth) - Math.max(rect.left, 0)
      );
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
      );
      const visibleArea = visibleWidth * visibleHeight;
      const totalArea = rect.width * rect.height;

      return (visibleArea / totalArea) * 100;
    }
  },
  getMessagesContainer() {
    // user's thread
    let $messageContainer = $(
      '.h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div:first-child > div:first-child > div:first-child > div'
    );

    // branched thread
    if (!$messageContainer.length) {
      $messageContainer = $(
        '.h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div:first-child > div:first-child > div:nth-child(2)'
      );
    }

    return $messageContainer;
  },
  getMessageBlocks() {
    if (whereAmI() !== 'thread') return [];

    const $messageContainer = this.getMessagesContainer();

    const messageBlocks: {
      $messageBlock: JQuery<Element>;
      $answerHeading: JQuery<Element>;
      $query: JQuery<Element>;
      $answer: JQuery<Element>;
    }[] = [];

    $messageContainer.children().each((_, messageBlock) => {
      const $messageBlock = $(messageBlock);
      const $query = $messageBlock.find('.my-md.md\\:my-lg');
      const $answer = $messageBlock.find(
        '.relative.default.font-sans.text-base'
      );
      const $answerHeading = $messageBlock.find(
        '.mb-sm.flex.w-full.items-center.justify-between:last'
      );

      $messageBlock.find('.col-span-8:last').addClass('message-col');
      $messageBlock.find('.col-span-4:last').addClass('visual-col');

      const messageBlockData = {
        $messageBlock,
        $answerHeading,
        $query,
        $answer,
      };

      messageBlocks.push(messageBlockData);
    });

    return messageBlocks;
  },
};
