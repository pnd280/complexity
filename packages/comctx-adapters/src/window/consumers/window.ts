import { onMessage, sendMessage } from "webext-bridge/window";

import { createTabConsumer } from "@/_factories/consumer";

export const WindowConsumer = createTabConsumer({
  webextBridgeMessageChannelId: "comctx:window",
  destinationContext: "window",
  bridge: { onMessage, sendMessage },
});
