import $ from 'jquery';

import webpageListeners from '@/content-script/main-world/listeners';
import webpageMessageInterceptors from '@/content-script/main-world/message-interceptors';
import DOMObserver from '@/utils/dom-observer';
import { queryClient } from '@/utils/queryClient';
import { ui } from '@/utils/ui';
import uiTweaks from '@/utils/ui-tweaks';
import {
  getPPLXBuildId,
  injectMainWorldScript,
  waitForElement,
  waitForNextjsHydration,
  whereAmI,
} from '@/utils/utils';

import { webpageMessenger } from '@/content-script/main-world/messenger';
import ReactRoot from '@/content-script/ReactRoot';

import domHook from '@/content-script/main-world/dom-hook?script&module';
import nextRouter from '@/content-script/main-world/next-router?script&module';
import shiki from '@/content-script/main-world/shiki?script&module';
import wsHook from '@/content-script/main-world/ws-hook?script&module';

$(async () => {
  await initDependencies();

  initTrafficInterceptors();

  initDOMObserversWatchdog();

  ReactRoot();
});

async function initDependencies() {
  uiTweaks.correctColorScheme();
  uiTweaks.injectCustomStyles();

  await Promise.all([
    injectMainWorldScript(chrome.runtime.getURL(wsHook)),
    injectMainWorldScript(chrome.runtime.getURL(nextRouter)),
    injectMainWorldScript(chrome.runtime.getURL(domHook)),
    injectMainWorldScript(chrome.runtime.getURL(shiki)),
    softUpdateCheck(),
  ]);
}

function initTrafficInterceptors() {
  webpageListeners.onWebSocketCaptured();

  webpageMessageInterceptors.trackQueryLimits();
  webpageMessageInterceptors.alterQueries();
  webpageMessageInterceptors.blockTelemetry();
  webpageMessageInterceptors.removeComplexityIdentifier();
}

function initDOMObserversWatchdog() {
  if (import.meta.env.DEV) {
    $(document).on('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'Q') {
        DOMObserver.destroyAll();
        alert('All observers destroyed!');
      }
    });
  }

  // DOMObserver.enableLogging();

  uiTweaks.collapseEmptyThreadVisualColumns();

  const observe = (url: string) => {
    DOMObserver.destroyAll('default');

    queryClient.resetQueries({
      predicate(query) {
        return query.queryKey[0] === 'domNode';
      },
    });

    uiTweaks.alterAttachButton();
    uiTweaks.calibrateMarkdownBlock();
    uiTweaks.calibrateThreadMessageStickyHeader();

    $(() => {
      switch (whereAmI(url)) {
        case 'thread':
          (async () => {
            const messagesContainer = await waitForElement({
              selector: () => ui.getMessagesContainer()[0],
              timeout: 5000,
            });

            if (!messagesContainer) return;

            uiTweaks.alterMessageQuery(messagesContainer);
            uiTweaks.displayModelNextToAnswerHeading(messagesContainer);
            uiTweaks.highlightMarkdownBlocks(messagesContainer);
          })();

          break;
      }
    });
  };

  observe(window.location.href);

  webpageMessenger.onMessage(
    'routeChange',
    async ({ payload: { url, trigger } }) => {
      if (trigger !== 'routeChangeComplete') return;

      observe(url);
    }
  );
}

async function softUpdateCheck() {
  await waitForNextjsHydration();

  const pplxBuildId = 'cfzuIprv6N1qK8_fikAkn';

  const latestPPLXBuildId = await getPPLXBuildId();

  if (latestPPLXBuildId && pplxBuildId !== latestPPLXBuildId) {
    console.log(
      "COMPLEXITY: Perplexity web app's new build id detected! The extension maybe outdated and some features may not work as expected. Report issues by joining the Discord server: https://discord.gg/fxzqdkwmWx.",
      'BUILD_ID:',
      latestPPLXBuildId
    );
  }
}
