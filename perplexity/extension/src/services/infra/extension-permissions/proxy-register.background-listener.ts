import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import defineProxy from "comctx";

import {
  backgroundProxyServiceName,
  ExtensionPermissionsService,
} from "@/services/infra/extension-permissions";
import { isBackgroundScript } from "@/utils/utils";

let serviceInstance: typeof ExtensionPermissionsService | undefined;

export function getExtensionPermissionsService(): typeof ExtensionPermissionsService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getExtensionPermissionsProxyService instead.",
  );

  serviceInstance ??= ExtensionPermissionsService;

  return serviceInstance;
}

export default function listener() {
  const [registerService] = defineProxy(
    () => getExtensionPermissionsService(),
    {
      namespace: backgroundProxyServiceName,
    },
  );

  registerService(new BrowserRuntimeAdapter());
}
