(() => {
  'use strict';

  init();

  async function init() {
    unsafeWindow.$ = $; // for debugging purposes

    initGlobals();

    $('<style>')
      .attr('type', 'text/css')
      .html(GM_getResourceText('CSS'))
      .appendTo('head');

    unsafeWindow.WSHOOK_INSTANCE.hookSocket();

    await waitForSocketHooking();

    Utils.setImmediateInterval(() => {
      QueryBox.createSelectors();
      // UITweaks.declutterCollectionPage();
      // UITweaks.hideThreadShareButtons();
      // UITweaks.populateCollectionButtons();
    }, 100);
  }

  function initGlobals() {
    const scriptLatestBuildId = '7aCnXXs0TIGkrB5u5yDhl';

    window.BUILD_ID = $('script#__NEXT_DATA__')
      .text()
      .match(/"buildId":"(.+?)"/)[1]
      .trim();

    if (window.BUILD_ID !== scriptLatestBuildId) {
      console.warn(
        "WARNING: Perplexity web app's new build id detected! The script maybe outdated and some features may or may not work as expected.",
        "BUILD_ID: ", window.BUILD_ID
      );
    }

    window.$UI_HTML = $('<template>').append(
      $.parseHTML(GM_getResourceText('UI'))
    );

    unsafeWindow.WSHOOK_INSTANCE = new WSHook();
  }

  function waitForSocketHooking() {
    return new Promise((resolve) => {
      const interval = Utils.setImmediateInterval(() => {
        const activeSocket = unsafeWindow.WSHOOK_INSTANCE.getSocket();

        if (!activeSocket) return;

        unsafeWindow.INTERCEPTED_SOCKET = activeSocket;

        clearInterval(interval);
        resolve();
      }, 10);
    });
  }
})();
