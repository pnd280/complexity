// @resource     CSS file:///C:/Users/ngocdg/Desktop/fedora/PPLX_userscript/pplx.css

(() => {
  'use strict';

  if (typeof jQuery === 'undefined') {
    const script = document.createElement('script');
    script.src =
      'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);

    script.onload = () => {
      init();
    };
  } else {
    init();
  }

  function init() {
    initGlobals();

    $('<style>')
      .attr('type', 'text/css')
      .html(GM_getResourceText('CSS'))
      .appendTo('head');

    unsafeWindow.WSHOOK_INSTANCE.hookSocket();

    waitForSocket();

    Utils.setImmediateInterval(() => {
      ChatBoxDropdowns.createDropdowns();
      UITweaks.declutterCollectionPage();
      // UITweaks.hideThreadShareButtons();
      // UITweaks.populateCollectionButtons();
    }, 500);
  }

  function initGlobals() {
    window.BUILD_ID = $('script#__NEXT_DATA__')
      .text()
      .match(/"buildId":"(.+?)"/)[1]
      .trim();

    window.$UI_HTML = $('<template>').append(
      $.parseHTML(GM_getResourceText('UI'))
    );

    unsafeWindow.WSHOOK_INSTANCE = new WSHook();
  }

  function waitForSocket() {
    return new Promise((resolve) => {
      const interval = Utils.setImmediateInterval(() => {
        const activeSocket = unsafeWindow.WSHOOK_INSTANCE.getSocket();

        if (!activeSocket) return;

        unsafeWindow.INTERCEPTED_SOCKET = activeSocket;

        clearInterval(interval);
        resolve();
      }, 100);
    });
  }
})();
