import '../../public/global.css';

import $ from 'jquery';

import DOMObserver from '@/utils/dom-observer';
import { queryClient } from '@/utils/queryClient';
import { ui } from '@/utils/ui';
import {
  getPPLXBuildId,
  injectMainWorldScript,
  waitForElement,
  waitForNextjsHydration,
  whereAmI,
} from '@/utils/utils';

import webpageListeners from './main-world/listeners';
import webpageMessageInterceptors from './main-world/message-interceptors';
import { webpageMessenger } from './main-world/messenger';
// @ts-expect-error
import messenger from './main-world/messenger?script&module';
// @ts-expect-error
import wsHook from './main-world/ws-hook?script&module';
import Root from './Root';
import uiTweaks from './ui-tweaks';

$(async (): Promise<void> => {
  await init();

  setupInterceptors();

  setupDOMObservers();

  Root();
});

function setupInterceptors() {
  webpageListeners.onWebSocketCaptured();

  webpageMessageInterceptors.trackQueryLimits();
  webpageMessageInterceptors.alterQueries();
  webpageMessageInterceptors.blockTelemetry();
  webpageMessageInterceptors.removeComplexityIdentifier();
}

function setupDOMObservers() {
  if (import.meta.env.DEV) {
    $(document).on('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'Q') {
        DOMObserver.destroyAll();
        alert('All observers destroyed!');
      }
    });
  }

  // DOMObserver.enableLogging();

  uiTweaks.hideScrollToBottomButton();
  uiTweaks.collapseEmptyThreadVisualColumns();

  const observe = (url: string) => {
    queryClient.resetQueries({
      predicate(query) {
        return query.queryKey[0] === 'domNode';
      },
    });

    DOMObserver.destroyAll();

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
      if (trigger === 'popstate') return;

      observe(url);
    }
  );
}

async function init() {
  injectMainWorldScript(chrome.runtime.getURL(messenger)).then(() =>
    injectMainWorldScript(chrome.runtime.getURL(wsHook))
  );

  uiTweaks.correctColorScheme();
  uiTweaks.injectCustomStyles();

  await waitForNextjsHydration();

  $('html').attr({
    'data-dev': `${import.meta.env.DEV}`,
  });

  softUpdateCheck();
}

async function softUpdateCheck() {
  const pplxBuildId = 'cfzuIprv6N1qK8_fikAkn';

  const latestPPLXBuildId = await getPPLXBuildId();

  if (latestPPLXBuildId && pplxBuildId !== latestPPLXBuildId) {
    console.warn(
      "COMPLEXITY: Perplexity web app's new build id detected! The extension maybe outdated and some features may not work as expected. Report issues by joining the Discord server: https://discord.gg/fxzqdkwmWx.",
      'BUILD_ID:',
      latestPPLXBuildId
    );
  }
}
