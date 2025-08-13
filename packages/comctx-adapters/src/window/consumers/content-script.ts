import { onMessage, sendMessage } from "webext-bridge/content-script";

import { createTabConsumer } from "@/_factories/consumer";

export const ContentScriptConsumer = createTabConsumer({
  webextBridgeMessageChannelId: "comctx:window",
  destinationContext: "window",
  bridge: { onMessage, sendMessage },
});
