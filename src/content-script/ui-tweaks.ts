import $ from 'jquery';

import {
  onAttributeChanges,
  onElementExist,
} from '@/utils/observer';

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
  onElementExist({
    selector: () => {
      const $element = $('button:contains("Attach"):last');

      if ($element.length && $element.find('>div>div').text() === 'Attach') {
        return [$element[0]];
      }

      return [];
    },
    callback({ element }) {
      if (!popupSettingsStore.getState().queryBoxSelectors.focus) return;

      $(element).find('>div').removeClass('gap-xs');
      $(element).find('>div>div').addClass('hidden');
    },
    observedIdentifier: 'alter-attach-button',
  });
}

function correctColorScheme() {
  onAttributeChanges({
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

const uiTweaks = {
  injectBaseStyles,
  alterAttachButton,
  correctColorScheme,
};

export default uiTweaks;
