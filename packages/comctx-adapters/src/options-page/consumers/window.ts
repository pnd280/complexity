import { onMessage, sendMessage } from "webext-bridge/window";

import { createConsumer } from "@/_factories/consumer";

export const WindowConsumer = createConsumer({
  webextBridgeMessageChannelId: "comctx:options-page",
  destination: "options",
  bridge: { onMessage, sendMessage },
});
