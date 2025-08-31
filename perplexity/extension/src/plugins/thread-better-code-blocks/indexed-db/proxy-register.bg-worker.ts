import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import defineProxy from "comctx";

import {
  backgroundProxyServiceName,
  BetterCodeBlocksFineGrainedService,
} from "@/plugins/thread-better-code-blocks/indexed-db";
import { isBackgroundScript } from "@/utils/utils";

let serviceInstance: BetterCodeBlocksFineGrainedService | undefined;

export function getBetterCodeBlocksFineGrainedOptionsService(): BetterCodeBlocksFineGrainedService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getBetterCodeBlocksFineGrainedOptionsProxyService instead.",
  );

  serviceInstance ??= new BetterCodeBlocksFineGrainedService();

  return serviceInstance;
}

export default function () {
  const [registerService] = defineProxy(
    () => getBetterCodeBlocksFineGrainedOptionsService(),
    {
      namespace: backgroundProxyServiceName,
    },
  );

  registerService(new BrowserRuntimeAdapter());
}
