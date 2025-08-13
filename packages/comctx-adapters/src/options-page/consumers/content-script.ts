import { onMessage, sendMessage } from "webext-bridge/content-script";

import { createConsumer } from "@/_factories/consumer";

export const ContentScriptConsumer = createConsumer({
  webextBridgeMessageChannelId: "comctx:options-page",
  destination: "options",
  bridge: { onMessage, sendMessage },
});
