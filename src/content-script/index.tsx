import '../assets/global.css';
import '@/content-script/webpage/ws-hook';

import $ from 'jquery';

import { chromeStorage } from '@/utils/chrome-store';
import { sleep } from '@/utils/utils';

import Root from './Root';
import uiTweaks from './ui-tweaks';
import webpageListeners from './webpage/listeners';
import webpageMessageInterceptors from './webpage/message-interceptors';

(async function () {
  await init();

  Root({});

  webpageListeners.onWebSocketCaptured();

  webpageMessageInterceptors.trackQueryLimits();

  webpageMessageInterceptors.alterQuery();

  // webpageMessageInterceptors.inspectWebSocketEvents();

  // webpageMessageInterceptors.inspectLongPollingEvents();

  uiTweaks.alterAttachButton();

  // chrome.storage.onChanged.addListener((changes, areaName) => {
  //   if (areaName === 'local') {
  //     for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
  //       console.log(`Storage key "${key}" in "local" changed.`);
  //       console.log(`Old value: `, oldValue);
  //       console.log(`New value: `, newValue);
  //     }
  //   }
  // });

  console.log(await chromeStorage.getStorageValue('popupSettings'));
})();

async function init() {
  $('html').attr({
    'data-dev': `${import.meta.env.DEV}`,
  });

  await Promise.all([
    softUpdateCheck(),
    chrome.runtime.sendMessage({ action: 'injectScript' }),
  ]);

  uiTweaks.injectBaseStyles();
  uiTweaks.correctColorScheme();
}

async function softUpdateCheck() {
  const pplxBuildId = 'Hww6VlF0ln_WDkrGUFhrk';

  while (!$('script#__NEXT_DATA__').text().includes('"buildId":')) {
    await sleep(100);
  }

  const latestPPLXBuildId = $('script#__NEXT_DATA__')
    ?.text()
    ?.match(/"buildId":"(.+?)"/)?.[1]
    .trim();

  if (latestPPLXBuildId && pplxBuildId !== latestPPLXBuildId) {
    console.warn(
      "WARNING: Perplexity web app's new build id detected! The script maybe outdated and some features may not work as expected.",
      'BUILD_ID:',
      latestPPLXBuildId
    );
  }
}
