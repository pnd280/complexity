import { onMessage, sendMessage } from "webext-bridge/options";

import { createTabConsumer } from "@/_factories/consumer";

export const OptionsPageConsumer = createTabConsumer({
  webextBridgeMessageChannelId: "comctx:window",
  destinationContext: "window",
  bridge: { onMessage, sendMessage },
});
