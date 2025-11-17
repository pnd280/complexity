import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  ExtensionPermissionsService as ExtensionPermissionsServiceType,
} from "@/entrypoints/services/extension-api-wrappers/permissions";
import { isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: typeof ExtensionPermissionsServiceType | undefined;
let proxyServiceInstance: typeof ExtensionPermissionsServiceType | undefined;

const [registerService, getService] = defineProxy(
  getExtensionPermissionsRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
    heartbeatCheck: false,
  },
);

function getExtensionPermissionsRootService(): typeof ExtensionPermissionsServiceType {
  invariant(
    isBackgroundScript(),
    "[ExtensionPermissionsService] Invalid context",
  );

  rootServiceInstance ??= ExtensionPermissionsServiceType;

  return rootServiceInstance;
}

function getExtensionPermissionsProxyService(): typeof ExtensionPermissionsServiceType {
  invariant(
    !isBackgroundScript(),
    "[ExtensionPermissionsService] Invalid context",
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
