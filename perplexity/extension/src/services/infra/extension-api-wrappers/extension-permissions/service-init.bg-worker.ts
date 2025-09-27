import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  ExtensionPermissionsService as ExtensionPermissionsServiceType,
} from "@/services/infra/extension-api-wrappers/extension-permissions";
import { isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: typeof ExtensionPermissionsServiceType | undefined;
let proxyServiceInstance: typeof ExtensionPermissionsServiceType | undefined;

const [registerService, getService] = defineProxy(
  getExtensionPermissionsRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
  },
);

function getExtensionPermissionsRootService(): typeof ExtensionPermissionsServiceType {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getExtensionPermissionsProxyService instead.",
  );

  rootServiceInstance ??= ExtensionPermissionsServiceType;

  return rootServiceInstance;
}

function getExtensionPermissionsProxyService(): typeof ExtensionPermissionsServiceType {
  invariant(
    !isBackgroundScript(),
    "Use getExtensionPermissionsRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export const ExtensionPermissionsService = {
  get Root() {
    return getExtensionPermissionsRootService();
  },
  get Proxy() {
    return getExtensionPermissionsProxyService();
  },
  get Instance() {
    return isBackgroundScript()
      ? getExtensionPermissionsRootService()
      : getExtensionPermissionsProxyService();
  },
};

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
