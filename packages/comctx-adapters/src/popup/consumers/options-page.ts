import { onMessage, sendMessage } from "webext-bridge/options";

import { createConsumer } from "@/_factories/consumer";

export const OptionsPageConsumer = createConsumer({
  webextBridgeMessageChannelId: "comctx:popup",
  destination: "popup",
  bridge: { onMessage, sendMessage },
});
