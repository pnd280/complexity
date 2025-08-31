import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import defineProxy from "comctx";

import {
  backgroundProxyServiceName,
  LocalThemesService,
} from "@/plugins/_core/custom-theme/indexed-db";
import { isBackgroundScript } from "@/utils/utils";

let serviceInstance: LocalThemesService | undefined;

export function getLocalThemesService(): LocalThemesService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getLocalThemesProxyService instead.",
  );

  serviceInstance ??= new LocalThemesService();

  return serviceInstance;
}

export default function () {
  const [registerService] = defineProxy(() => getLocalThemesService(), {
    namespace: backgroundProxyServiceName,
  });

  registerService(new BrowserRuntimeAdapter());
}
