import { onMessage, sendMessage } from "webext-bridge/content-script";

import { createConsumer } from "@/_factories/consumer";

export const ContentScriptConsumer = createConsumer({
  webextBridgeMessageChannelId: "comctx:background",
  destination: "background",
  bridge: { onMessage, sendMessage },
});
