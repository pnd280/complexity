import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  ExtensionPermissionsService,
} from "@/services/infra/extension-api-wrappers/extension-permissions";
import { isBackgroundScript } from "@/utils/utils";

let rootServiceInstance: typeof ExtensionPermissionsService | undefined;
let proxyServiceInstance: typeof ExtensionPermissionsService | undefined;

const [registerService, getService] = defineProxy(
  getExtensionPermissionsRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
  },
);

export function getExtensionPermissionsRootService(): typeof ExtensionPermissionsService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getExtensionPermissionsProxyService instead.",
  );

  rootServiceInstance ??= ExtensionPermissionsService;

  return rootServiceInstance;
}

export function getExtensionPermissionsProxyService(): typeof ExtensionPermissionsService {
  invariant(
    !isBackgroundScript(),
    "Use getExtensionPermissionsRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export function getExtensionPermissionsService(): typeof ExtensionPermissionsService {
  return isBackgroundScript()
    ? getExtensionPermissionsRootService()
    : getExtensionPermissionsProxyService();
}

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
