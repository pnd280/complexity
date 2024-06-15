import '../assets/global.css';
import '@/content-script/webpage/ws-hook';

import $ from 'jquery';

import { getPPLXBuildId } from '@/utils/utils';

import Root from './Root';
import uiTweaks from './ui-tweaks';
import webpageListeners from './webpage/listeners';
import webpageMessageInterceptors from './webpage/message-interceptors';

(async function () {
  await init();

  Root();

  webpageListeners.onWebSocketCaptured();
  webpageMessageInterceptors.trackQueryLimits();
  webpageMessageInterceptors.alterQueries();
  webpageMessageInterceptors.blockNativeProSearchMessages();
  webpageMessageInterceptors.blockTelemetry();
  webpageMessageInterceptors.removeComplexityIdentifier();

  uiTweaks.alterAttachButton();
  uiTweaks.adjustSelectorsBorderRadius();
  uiTweaks.adjustQueryBoxWidth();
  uiTweaks.hideScrollToBottomButton();
  uiTweaks.correctNativeProSearchSwitch();
  uiTweaks.hideNativeProSearchSwitch();
  uiTweaks.collapseEmptyThreadVisualColumns();
  uiTweaks.displayModelNextToAnswerHeading();

  uiTweaks.alterMessageQuery();

  // webpageMessageInterceptors.inspectWebSocketEvents();
  // webpageMessageInterceptors.inspectLongPollingEvents();
})();

async function init() {
  $('html').attr({
    'data-dev': `${import.meta.env.DEV}`,
  });

  await Promise.all([
    chrome.runtime.sendMessage({ action: 'injectScript' }),
    softUpdateCheck(),
  ]);
  uiTweaks.correctColorScheme();
  uiTweaks.injectBaseStyles();
  uiTweaks.injectCustomStyles();
}

async function softUpdateCheck() {
  const pplxBuildId = 'cfzuIprv6N1qK8_fikAkn';

  const latestPPLXBuildId = await getPPLXBuildId();

  if (latestPPLXBuildId && pplxBuildId !== latestPPLXBuildId) {
    console.warn(
      "COMPLEXITY: Perplexity web app's new build id detected! The extension maybe outdated and some features may not work as expected.",
      'BUILD_ID:',
      latestPPLXBuildId
    );
  }
}
