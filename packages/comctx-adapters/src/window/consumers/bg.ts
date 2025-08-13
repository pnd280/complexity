import { onMessage, sendMessage } from "webext-bridge/background";

import { createTabConsumer } from "@/_factories/consumer";

export const BackgroundConsumer = createTabConsumer({
  webextBridgeMessageChannelId: "comctx:window",
  destinationContext: "window",
  bridge: { onMessage, sendMessage },
});
