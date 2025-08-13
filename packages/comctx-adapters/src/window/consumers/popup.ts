import { onMessage, sendMessage } from "webext-bridge/popup";

import { createTabConsumer } from "@/_factories/consumer";

export const PopupConsumer = createTabConsumer({
  webextBridgeMessageChannelId: "comctx:window",
  destinationContext: "window",
  bridge: { onMessage, sendMessage },
});
