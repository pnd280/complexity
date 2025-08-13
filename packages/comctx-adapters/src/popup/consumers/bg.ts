import { onMessage, sendMessage } from "webext-bridge/background";

import { createConsumer } from "@/_factories/consumer";

export const BackgroundConsumer = createConsumer({
  webextBridgeMessageChannelId: "comctx:popup",
  destination: "popup",
  bridge: { onMessage, sendMessage },
});
