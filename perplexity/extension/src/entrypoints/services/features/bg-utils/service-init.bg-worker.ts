import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  BgUtilsServiceImpl,
  type BgUtilsService as BgUtilsServiceType,
} from "@/entrypoints/services/features/bg-utils";
import { isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: BgUtilsServiceType | undefined;
let proxyServiceInstance: BgUtilsServiceType | undefined;

const [registerService, getService] = defineProxy(getBgUtilsRootService, {
  namespace: backgroundProxyServiceName,
  backup: false,
  heartbeatCheck: false,
});

function getBgUtilsRootService(): BgUtilsServiceType {
  invariant(isBackgroundScript(), "[BgUtilsService] Invalid context");

  rootServiceInstance ??= BgUtilsServiceImpl;

  return rootServiceInstance;
}

function getBgUtilsProxyService(): BgUtilsServiceType {
  invariant(!isBackgroundScript(), "[BgUtilsService] Invalid context");

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export const BgUtilsService = {
  get Root() {
    return getBgUtilsRootService();
  },
  get Proxy() {
    return getBgUtilsProxyService();
  },
  get Instance() {
    return isBackgroundScript()
      ? getBgUtilsRootService()
      : getBgUtilsProxyService();
  },
};

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
