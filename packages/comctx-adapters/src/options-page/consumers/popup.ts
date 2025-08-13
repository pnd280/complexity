import { onMessage, sendMessage } from "webext-bridge/popup";

import { createConsumer } from "@/_factories/consumer";

export const PopupConsumer = createConsumer({
  webextBridgeMessageChannelId: "comctx:options-page",
  destination: "options",
  bridge: { onMessage, sendMessage },
});
