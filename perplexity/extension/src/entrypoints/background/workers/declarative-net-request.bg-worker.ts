import { onMessage } from "webext-bridge/background";

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "bg:updateDynamicRules": (params: {
      removeRuleIds?: number[];
      addRules?: chrome.declarativeNetRequest.Rule[];
    }) => void;
  }
}

export default function () {
  onMessage(
    "bg:updateDynamicRules",
    ({ data: { addRules, removeRuleIds } }) => {
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules,
        removeRuleIds,
      });
    },
  );
}
