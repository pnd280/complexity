import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  BetterCodeBlocksFineGrainedServiceImpl,
  type BetterCodeBlocksFineGrainedService as BetterCodeBlocksFineGrainedServiceType,
} from "@/plugins/thread-better-code-blocks/indexed-db";
import { isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: BetterCodeBlocksFineGrainedServiceType | undefined;
let proxyServiceInstance: BetterCodeBlocksFineGrainedServiceType | undefined;

const [registerService, getService] = defineProxy(
  getBetterCodeBlocksFineGrainedOptionsRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
    heartbeatCheck: false,
  },
);

function getBetterCodeBlocksFineGrainedOptionsRootService(): BetterCodeBlocksFineGrainedServiceType {
  invariant(
    isBackgroundScript(),
    "[BetterCodeBlocksFineGrainedService] Invalid context",
  );

  rootServiceInstance ??= BetterCodeBlocksFineGrainedServiceImpl;

  return rootServiceInstance;
}

function getBetterCodeBlocksFineGrainedOptionsProxyService(): BetterCodeBlocksFineGrainedServiceType {
  invariant(
    !isBackgroundScript(),
    "[BetterCodeBlocksFineGrainedService] Invalid context",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export const BetterCodeBlocksFineGrainedService = {
  get Root() {
    return getBetterCodeBlocksFineGrainedOptionsRootService();
  },
  get Proxy() {
    return getBetterCodeBlocksFineGrainedOptionsProxyService();
  },
  get Instance() {
    return isBackgroundScript()
      ? getBetterCodeBlocksFineGrainedOptionsRootService()
      : getBetterCodeBlocksFineGrainedOptionsProxyService();
  },
};

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
