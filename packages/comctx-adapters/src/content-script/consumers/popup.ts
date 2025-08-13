import { onMessage, sendMessage } from "webext-bridge/popup";

import { createTabConsumer } from "@/_factories/consumer";

export const PopupConsumer = createTabConsumer({
  webextBridgeMessageChannelId: "comctx:content-script",
  destinationContext: "content-script",
  bridge: { onMessage, sendMessage },
});
