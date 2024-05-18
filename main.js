(async () => {
  'use strict';

  await loadDependencies();

  await Promise.all([
    softCheckForUpdates(),
    Utils.whereAmI() !== 'lab' && hookSocket(),
  ]);

  UITweaks.setAccentColor('#72AEFD');
  UITweaks.alterSloganHeading('Chatplexity');
  UITweaks.closePopoversOnScroll();
  Utils.increaseScrollSpeed(5);

  unsafeWindow.STORE = {
    focus:
      JSONUtils.safeParse(localStorage.getItem('defaultFocus')) || 'internet',
    activeCollectionUUID: JSONUtils.safeParse(
      localStorage.getItem('defaultCollectionUUID')
    ),
    activePromptId: JSONUtils.safeParse(
      localStorage.getItem('defaultPromptId')
    ),
    username: getUsername(),
  };

  QueryBox.mountObserver();
  ThreadLayout.mountObserver();
  ThreadAnchor.mountObserver();
  FollowUpPopover.mountObserver();
})();

async function loadDependencies() {
  await Promise.all([
    typeof jQuery === 'undefined' &&
      Utils.loadScriptAsync(
        'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js'
      ),
    Utils.loadScriptAsync(
      'https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js'
    ),
    Utils.loadScriptAsync(
      'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.2/purify.min.js'
    ),
  ]);

  $('<style>')
    .attr('type', 'text/css')
    .html(GM_getResourceText('CSS'))
    .appendTo('head');

  window.$UI_TEMPLATE = $('<template>').append(
    $.parseHTML(GM_getResourceText('UI') + GM_getResourceText('UI_PROMPT_BOX'))
  );
}

async function softCheckForUpdates() {
  const latestPPLXBuildId = '2_5TBnJwoiZtFt5klr0Vv';

  while (!$('script#__NEXT_DATA__').text().includes('"buildId":')) {
    await Utils.sleep(100);
  }

  window.BUILD_ID = $('script#__NEXT_DATA__')
    .text()
    .match(/"buildId":"(.+?)"/)[1]
    .trim();

  if (window.BUILD_ID !== latestPPLXBuildId) {
    console.warn(
      "WARNING: Perplexity web app's new build id detected! The script maybe outdated and some features may or may not work as expected.",
      'BUILD_ID: ',
      window.BUILD_ID
    );
  }
}

function getUsername() {
  return $('script#__NEXT_DATA__')
    .text()
    .match(/"username":"(.+?)"/)?.[1]
    .trim();
}

async function hookSocket() {
  unsafeWindow.WSHOOK_INSTANCE = new WSHook();

  unsafeWindow.WSHOOK_INSTANCE.hookSocket();

  return new Promise((resolve) => {
    let intervalId;

    intervalId = Utils.setImmediateInterval(() => {
      const activeSocket = unsafeWindow.WSHOOK_INSTANCE.getActiveSocket();

      if (!activeSocket || !intervalId) return;

      clearInterval(intervalId);
      resolve();
    }, 10);
  });
}
