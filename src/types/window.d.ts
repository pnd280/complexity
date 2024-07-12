import { Nullable } from './Utils';
import { MessageListener, SendMessage } from './WebpageMessenger';

import { type codeToHtml } from 'shiki';

import $ from 'jquery';

declare global {
  interface Window {
    next: {
      router: {
        push: (url: string, as?: string, options?: any) => Promise<boolean>;
        replace: (url: string, as?: string, options?: any) => Promise<boolean>;
        events: {
          on: (event: string, callback: () => void) => void;
          off: (event: string, callback: () => void) => void;
        };
      };
    };

    $: typeof $;

    Messenger: {
      onMessage: MessageListener;
      sendMessage: SendMessage;
    };

    capturedSocket: Nullable<WebSocket | XMLHttpRequest>;
    longPollingInstance: Nullable<XMLHttpRequest>;

    shiki: {
      codeToHtml: typeof codeToHtml;
    };
  }
}
