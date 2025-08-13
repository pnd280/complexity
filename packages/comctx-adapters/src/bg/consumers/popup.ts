import { onMessage, sendMessage } from "webext-bridge/popup";

import { createConsumer } from "@/_factories/consumer";

export const PopupConsumer = createConsumer({
  webextBridgeMessageChannelId: "comctx:background",
  destination: "background",
  bridge: { onMessage, sendMessage },
});
