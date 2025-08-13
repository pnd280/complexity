import { onMessage, sendMessage } from "webext-bridge/content-script";

import { createTabConsumer } from "@/_factories/consumer";

export const ContentScriptConsumer = createTabConsumer({
  webextBridgeMessageChannelId: "comctx:content-script",
  destinationContext: "content-script",
  bridge: { onMessage, sendMessage },
});
