import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import { globalStore } from "@/content-script/session-store/global";

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
