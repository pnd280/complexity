import { onMessage, sendMessage } from "webext-bridge/options";

import { createTabConsumer } from "@/_factories/consumer";

export const OptionsPageConsumer = createTabConsumer({
  webextBridgeMessageChannelId: "comctx:content-script",
  destinationContext: "content-script",
  bridge: { onMessage, sendMessage },
});
