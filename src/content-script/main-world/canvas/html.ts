import $ from 'jquery';

import { mainWorldExec } from '@/utils/hoc';

import { webpageMessenger } from '../webpage-messenger';

type RenderAction = {
  action: 'render';
  payload: string;
};

type PopoutAction = {
  action: 'popOut';
  payload: '_blank' | 'PopupWindow';
};

export type HTMLCanvasAction = RenderAction | PopoutAction;

class HTMLCanvas {
  private static instance: HTMLCanvas;

  blobUrl: string | null = null;

  private constructor() {}

  static getInstance() {
    if (!HTMLCanvas.instance) {
      HTMLCanvas.instance = new HTMLCanvas();
    }
    return HTMLCanvas.instance;
  }

  initialize() {
    this.setupContentScriptRequestListeners();
  }

  private setupContentScriptRequestListeners() {
    webpageMessenger.onMessage(
      'htmlCanvasAction',
      async ({ payload: { action, payload } }) => {
        switch (action) {
          case 'render':
            return this.handleRenderAction(payload);
          case 'popOut':
            if (!this.blobUrl) return false;
            window.open(
              this.blobUrl,
              payload,
              payload === 'PopupWindow' ? 'width=600,height=600' : ''
            );
            return true;
          default:
            console.log('Unknown action:', action);
            return false;
        }
      }
    );
  }

  private async handleRenderAction(rawHTML: string) {
    const $iframe = $('<iframe>')
      .attr('id', 'html-wrapper')
      .addClass('tw-size-full tw-opacity-0');

    $('#complexity-canvas').empty().append($iframe);

    try {
      return await new Promise<boolean>((resolve) => {
        $iframe.on('load', function () {
          const thisElement = this as HTMLIFrameElement;

          const iframeDocument =
            thisElement.contentDocument || thisElement.contentWindow?.document;

          if (!iframeDocument) {
            return resolve(false);
          }

          $iframe
            .removeClass('tw-opacity-0')
            .addClass('tw-animate-in tw-fade-in');

          resolve(true);
        });

        const blob = new Blob([rawHTML], { type: 'text/html' });
        $iframe.attr('src', URL.createObjectURL(blob));

        this.blobUrl = URL.createObjectURL(blob);
      });
    } catch (error) {
      console.error('Error rendering HTML canvas:', error);
      return false;
    }
  }
}

mainWorldExec(() =>
  $(() => {
    HTMLCanvas.getInstance().initialize();
  })
)();
