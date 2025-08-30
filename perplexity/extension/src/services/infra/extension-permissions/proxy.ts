import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  type ExtensionPermissionsService,
} from "@/services/infra/extension-permissions";
import { isBackgroundScript } from "@/utils/utils";

const [, getService] = defineProxy(
  () => ({}) as typeof ExtensionPermissionsService,
  {
    namespace: backgroundProxyServiceName,
  },
);

let proxyServiceInstance: typeof ExtensionPermissionsService | undefined;

export function getExtensionPermissionsProxyService(): typeof ExtensionPermissionsService {
  invariant(
    !isBackgroundScript(),
    "Use getExtensionPermissionsService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}
