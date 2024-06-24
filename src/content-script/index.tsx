import '../assets/global.css';
import '@/content-script/webpage/ws-hook';

import $ from 'jquery';

import { ChromeStore } from '@/types/ChromeStore';
import background from '@/utils/background';
import {
  getPPLXBuildId,
  waitForNextjsHydration,
} from '@/utils/utils';

import Root from './Root';
import { globalStore } from './session-store/global';
import { popupSettingsStore } from './session-store/popup-settings';
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
  await waitForNextjsHydration();

  $('html').attr({
    'data-dev': `${import.meta.env.DEV}`,
  });

  uiTweaks.correctColorScheme();
  uiTweaks.injectBaseStyles();
  uiTweaks.injectCustomStyles();

  softUpdateCheck();

  await background.sendMessage({ action: 'injectScript' });

  handleArtifactsInjection();
}

async function softUpdateCheck() {
  const pplxBuildId = 'cfzuIprv6N1qK8_fikAkn';

  const latestPPLXBuildId = await getPPLXBuildId();

  if (latestPPLXBuildId && pplxBuildId !== latestPPLXBuildId) {
    console.warn(
      "COMPLEXITY: Perplexity web app's new build id detected! The extension maybe outdated and some features may not work as expected. Please report any issues by joining the Discord server: https://discord.gg/fxzqdkwmWx.",
      'BUILD_ID:',
      latestPPLXBuildId
    );
  }
}

function handleArtifactsInjection() {
  const injected: ChromeStore['artifacts'] = {
    mermaid: false,
  };

  globalStore.subscribe(({ artifacts }) => {
    inject({
      markdownBlockEnhancedToolbarEnabled:
        popupSettingsStore.getState().qolTweaks.markdownBlockEnhancedToolbar,
      artifacts,
    });
  });

  popupSettingsStore.subscribe(
    ({ qolTweaks: { markdownBlockEnhancedToolbar } }) => {
      inject({
        markdownBlockEnhancedToolbarEnabled: markdownBlockEnhancedToolbar,
        artifacts: globalStore.getState().artifacts,
      });
    }
  );

  function inject({
    markdownBlockEnhancedToolbarEnabled,
    artifacts,
  }: {
    markdownBlockEnhancedToolbarEnabled: ChromeStore['popupSettings']['qolTweaks']['markdownBlockEnhancedToolbar'];
    artifacts: ChromeStore['artifacts'];
  }) {
    if (!markdownBlockEnhancedToolbarEnabled) return;

    const { mermaid } = artifacts;

    requestIdleCallback(async () => {
      const darkTheme = $('html').hasClass('dark');

      if (mermaid) {
        if (injected.mermaid) return;

        await background.sendMessage({
          action: 'injectMermaid',
          payload: { darkTheme },
        });
      }
    });
  }
}
