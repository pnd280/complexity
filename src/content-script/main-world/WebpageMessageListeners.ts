import { globalStore } from "../session-store/global";

import { webpageMessenger } from "./webpage-messenger";

export default class WebpageMessageListeners {
  static onWebSocketCaptured() {
    webpageMessenger.onMessage("webSocketCaptured", async () => {
      globalStore.setState({ isWebSocketCaptured: true });
    });

    webpageMessenger.onMessage("longPollingCaptured", async () => {
      globalStore.setState({ isLongPollingCaptured: true });
    });
  }
}
