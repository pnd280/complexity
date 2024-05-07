(() => {
  'use strict';

  initGlobals();

  async function initGlobals() {
    unsafeWindow.$ = $; // for debugging purposes

    const scriptLatestBuildId = '7aCnXXs0TIGkrB5u5yDhl';

    window.BUILD_ID = $('script#__NEXT_DATA__')
      .text()
      .match(/"buildId":"(.+?)"/)[1]
      .trim();

    if (window.BUILD_ID !== scriptLatestBuildId) {
      console.warn(
        "WARNING: Perplexity web app's new build id detected! The script maybe outdated and some features may or may not work as expected.",
        'BUILD_ID: ',
        window.BUILD_ID
      );
    }

    window.$UI_HTML = $('<template>').append(
      $.parseHTML(GM_getResourceText('UI') + GM_getResourceText('UI_PROMPT_BOX'))
    );

    unsafeWindow.PERSISTENT_SETTINGS = {
      focus: 'internet',
    };

    unsafeWindow.WSHOOK_INSTANCE = new WSHook();

    unsafeWindow.WSHOOK_INSTANCE.hookSocket();

    init();
  }

  async function init() {
    $('<style>')
      .attr('type', 'text/css')
      .html(GM_getResourceText('CSS'))
      .appendTo('head');

    await waitForSocketHooking();

    Utils.setImmediateInterval(() => {
      QueryBox.createSelectors();
      // UITweaks.declutterCollectionPage();
      // UITweaks.hideThreadShareButtons();
      // UITweaks.populateCollectionButtons();
    }, 100);

    QueryBox.autoRefetch();
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
