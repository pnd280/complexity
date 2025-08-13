import { onMessage, sendMessage } from "webext-bridge/window";

import { createProvider } from "@/_factories/provider";

export const WindowProvider = createProvider({
  webextBridgeMessageChannelId: "comctx:window",
  bridge: {
    onMessage,
    sendMessage,
  },
});
