// BACKGROUND SCRIPT

import { BridgeRegistryService } from "@/services/bridge-registry";

const bridgeRegistry = new BridgeRegistryService();

(async () => {
  console.log(await chrome.tabs.query({}));

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.tab?.id == null) return;

    switch (message.type) {
      case "getTabId":
        sendResponse(sender.tab.id);
        break;
      case "registerBridgeService": {
        const success = bridgeRegistry.register({
          tabId: sender.tab.id,
          namespace: message.details.namespace,
        });
        sendResponse({ success });
        break;
      }
    }
  });
})();
