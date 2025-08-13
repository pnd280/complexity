import { onMessage, sendMessage } from "webext-bridge/background";

import { createProvider } from "@/_factories/provider";

export const BackgroundProvider = createProvider({
  webextBridgeMessageChannelId: "comctx:background",
  bridge: {
    onMessage,
    sendMessage,
  },
});
