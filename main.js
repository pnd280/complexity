(async () => {
  'use strict';

  {
    window.scriptLatestBuildId = 'PZguQUnh74bBftgKhoRRY';

    unsafeWindow.WSHOOK_INSTANCE = new WSHook();

    unsafeWindow.WSHOOK_INSTANCE.hookSocket();

    if (typeof jQuery === 'undefined') {
      await Utils.loadScriptAsync(
        'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js'
      );

      console.log('jQuery loaded');
    }

    await Utils.loadScriptAsync(
      'https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js'
    );

    console.log('Showdown loaded');

    $('<style>')
      .attr('type', 'text/css')
      .html(GM_getResourceText('CSS'))
      .appendTo('head');

    while (!$('script#__NEXT_DATA__').text().includes('"buildId":')) {
      await Utils.sleep(100);
    }

    window.BUILD_ID = $('script#__NEXT_DATA__')
      .text()
      .match(/"buildId":"(.+?)"/)[1]
      .trim();

    if (window.BUILD_ID !== window.scriptLatestBuildId) {
      console.warn(
        "WARNING: Perplexity web app's new build id detected! The script maybe outdated and some features may or may not work as expected.",
        'BUILD_ID: ',
        window.BUILD_ID
      );
    }

    window.$UI_HTML = $('<template>').append(
      $.parseHTML(
        GM_getResourceText('UI') + GM_getResourceText('UI_PROMPT_BOX')
      )
    );

    await waitForSocketHooking();

    unsafeWindow.STORE = {
      focus: JSONUtils.safeParse(localStorage.getItem('defaultFocus')),
      activeCollectionUUID: JSONUtils.safeParse(
        localStorage.getItem('defaultCollectionUUID')
      ),
    };

    Utils.setImmediateInterval(() => {
      UITweaks.alterSloganHeading('Chatplexity');
      QueryBox.createSelectors();

      UITweaks.alterThreadCollectionButton();
      UITweaks.alterThreadLayout();
      UITweaks.toggleEmptyThreadMessageVisualContainer();

      // FIXME:
      // UITweaks.alterRewriteButton();
      // UITweaks.hideThreadShareButtons();
    }, 100);

    ThreadAnchor.mountObserver();
    MyObserver.closePopovers();
  }

  function waitForSocketHooking() {
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
})();
