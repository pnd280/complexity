import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  ContentScriptBgUtilsService,
} from "@/services/features/content-script-utils";
import { isBackgroundScript } from "@/utils/utils";

let serviceInstance: typeof ContentScriptBgUtilsService | undefined;

export function getContentScriptBgUtilsRootService(): typeof ContentScriptBgUtilsService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getContentScriptBgUtilsProxyService instead.",
  );

  serviceInstance ??= ContentScriptBgUtilsService;

  return serviceInstance;
}

export default function () {
  const [registerService] = defineProxy(getContentScriptBgUtilsRootService, {
    namespace: backgroundProxyServiceName,
  });

  registerService(new BrowserRuntimeAdapter());
}
