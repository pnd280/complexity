import { onMessage, sendMessage } from "webext-bridge/content-script";

import { createProvider } from "@/_factories/provider";

export const ContentScriptProvider = createProvider({
  webextBridgeMessageChannelId: "comctx:content-script",
  bridge: {
    onMessage,
    sendMessage,
  },
});
