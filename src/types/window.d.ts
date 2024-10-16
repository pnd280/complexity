import type { Mermaid } from "mermaid";
import type * as shiki from "shiki";
import type * as svgPanZoom from "svg-pan-zoom";

import { Nullable } from "@/types/utils.types";
import { MessageListener, SendMessage } from "@/types/webpage-messenger.types";

declare global {
  interface Window {
    next?: {
      appDir: boolean;
      version: string;
      router: {
        back: () => void;
        forward: () => void;
        refresh: () => void;
        replace: (url: string) => void;
        push: (url: string) => void;
        prefetch: (url: string) => void;
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
