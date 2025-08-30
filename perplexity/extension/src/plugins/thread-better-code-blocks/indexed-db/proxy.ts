import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  type BetterCodeBlocksFineGrainedService,
} from "@/plugins/thread-better-code-blocks/indexed-db";
import { isBackgroundScript } from "@/utils/utils";

const [, getService] = defineProxy(
  () => ({}) as BetterCodeBlocksFineGrainedService,
  {
    namespace: backgroundProxyServiceName,
  },
);

let proxyServiceInstance: BetterCodeBlocksFineGrainedService | undefined;

export function getBetterCodeBlocksFineGrainedOptionsProxyService(): BetterCodeBlocksFineGrainedService {
  invariant(
    !isBackgroundScript(),
    "Use getBetterCodeBlocksFineGrainedOptionsService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}
