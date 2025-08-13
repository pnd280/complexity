import { onMessage, sendMessage } from "webext-bridge/background";

import { createConsumer } from "@/_factories/consumer";

export const BackgroundConsumer = createConsumer({
  webextBridgeMessageChannelId: "comctx:options-page",
  destination: "options",
  bridge: { onMessage, sendMessage },
});
