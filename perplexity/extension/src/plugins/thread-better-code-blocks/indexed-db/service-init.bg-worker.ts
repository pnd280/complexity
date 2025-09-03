import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  BetterCodeBlocksFineGrainedServiceImpl,
  type BetterCodeBlocksFineGrainedService,
} from "@/plugins/thread-better-code-blocks/indexed-db";
import { isBackgroundScript } from "@/utils/utils";

let rootServiceInstance: BetterCodeBlocksFineGrainedService | undefined;
let proxyServiceInstance: BetterCodeBlocksFineGrainedService | undefined;

const [registerService, getService] = defineProxy(
  getBetterCodeBlocksFineGrainedOptionsRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
  },
);

export function getBetterCodeBlocksFineGrainedOptionsRootService(): BetterCodeBlocksFineGrainedService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getBetterCodeBlocksFineGrainedProxyService instead.",
  );

  rootServiceInstance ??= BetterCodeBlocksFineGrainedServiceImpl;

  return rootServiceInstance;
}

export function getBetterCodeBlocksFineGrainedOptionsProxyService(): BetterCodeBlocksFineGrainedService {
  invariant(
    !isBackgroundScript(),
    "Use getBetterCodeBlocksFineGrainedRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export function getBetterCodeBlocksFineGrainedOptionsService(): BetterCodeBlocksFineGrainedService {
  return isBackgroundScript()
    ? getBetterCodeBlocksFineGrainedOptionsRootService()
    : getBetterCodeBlocksFineGrainedOptionsProxyService();
}

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
