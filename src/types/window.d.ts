import type { Mermaid } from "mermaid";
import type * as shiki from "shiki";
import type * as svgPanZoom from "svg-pan-zoom";

import { Nullable } from "@/types/utils.types";
import { MessageListener, SendMessage } from "@/types/webpage-messenger.types";

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
