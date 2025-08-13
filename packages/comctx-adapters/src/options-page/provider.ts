import { onMessage, sendMessage } from "webext-bridge/options";

import { createProvider } from "@/_factories/provider";

export const OptionsPageProvider = createProvider({
  webextBridgeMessageChannelId: "comctx:options-page",
  bridge: {
    onMessage,
    sendMessage,
  },
});
