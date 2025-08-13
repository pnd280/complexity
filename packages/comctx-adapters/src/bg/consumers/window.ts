import { onMessage, sendMessage } from "webext-bridge/window";

import { createConsumer } from "@/_factories/consumer";

export const WindowConsumer = createConsumer({
  webextBridgeMessageChannelId: "comctx:background",
  destination: "background",
  bridge: { onMessage, sendMessage },
});
