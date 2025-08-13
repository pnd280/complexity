import { onMessage, sendMessage } from "webext-bridge/window";

import { createTabConsumer } from "@/_factories/consumer";

export const WindowConsumer = createTabConsumer({
  webextBridgeMessageChannelId: "comctx:content-script",
  destinationContext: "content-script",
  bridge: { onMessage, sendMessage },
});
