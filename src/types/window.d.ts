import $ from "jquery";

import { Nullable } from "./Utils";
import { MessageListener, SendMessage } from "./WebpageMessenger";

import type * as shiki from "shiki";
import type { Mermaid } from "mermaid";
import type * as svgPanZoom from "svg-pan-zoom";

declare global {
  interface Window {
    next?: {
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

    shiki?: typeof shiki;
    mermaid?: Mermaid;
    svgPanZoom?: typeof svgPanZoom;
  }
}
