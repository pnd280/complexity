import { onMessage, sendMessage } from "webext-bridge/popup";

import { createProvider } from "@/_factories/provider";

export const PopupProvider = createProvider({
  webextBridgeMessageChannelId: "comctx:popup",
  bridge: {
    onMessage,
    sendMessage,
  },
});
