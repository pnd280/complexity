import { onMessage } from "webext-bridge/background";

import { getInstantCssInjectorService } from "@/services/features/instant-css/injector/proxy-register.background-listener";

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "bg:instantCss:requestInjection": () => void;
  }
}

export default async function listener() {
  onMessage("bg:instantCss:requestInjection", ({ sender }) => {
    const tabId = sender.tabId;
    getInstantCssInjectorService().injectCssToTab(tabId);
  });
}
