import { onMessage, sendMessage } from "webext-bridge/content-script";

import { createConsumer } from "@/_factories/consumer";

export const ContentScriptConsumer = createConsumer({
  webextBridgeMessageChannelId: "comctx:popup",
  destination: "popup",
  bridge: { onMessage, sendMessage },
});
