import { onMessage } from "webext-bridge/background";

import { InstantCssInjector } from "@/services/features/instant-css/injector.proxy-service";

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "bg:instantCss:requestInjection": () => void;
  }
}

export default async function listener() {
  onMessage("bg:instantCss:requestInjection", ({ sender }) => {
    const tabId = sender.tabId;
    InstantCssInjector.injectCssToTab(tabId);
  });
}
