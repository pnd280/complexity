import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import defineProxy from "comctx";

import {
  backgroundProxyServiceName,
  InstantCssStorageService,
} from "@/services/features/instant-css/storage";
import { isBackgroundScript } from "@/utils/utils";

let serviceInstance: typeof InstantCssStorageService | undefined;

export function getInstantCssStorageService(): typeof InstantCssStorageService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getInstantCssStorageProxyService instead.",
  );

  serviceInstance ??= InstantCssStorageService;

  return serviceInstance;
}

export default function listener() {
  const [registerService] = defineProxy(() => getInstantCssStorageService(), {
    namespace: backgroundProxyServiceName,
  });

  registerService(new BrowserRuntimeAdapter());
}
