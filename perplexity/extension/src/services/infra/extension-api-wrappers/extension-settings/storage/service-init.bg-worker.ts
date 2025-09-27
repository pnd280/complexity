import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  ExtensionSettingsStorageService as ExtensionSettingsStorageServiceType,
} from "@/services/infra/extension-api-wrappers/extension-settings/storage";
import { isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: typeof ExtensionSettingsStorageServiceType | undefined;
let proxyServiceInstance:
  | typeof ExtensionSettingsStorageServiceType
  | undefined;

const [registerService, getService] = defineProxy(
  getExtensionSettingsStorageRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
  },
);

function getExtensionSettingsStorageRootService(): typeof ExtensionSettingsStorageServiceType {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getExtensionSettingsStorageProxyService instead.",
  );

  rootServiceInstance ??= ExtensionSettingsStorageServiceType;

  return rootServiceInstance;
}

function getExtensionSettingsStorageProxyService(): typeof ExtensionSettingsStorageServiceType {
  invariant(
    !isBackgroundScript(),
    "Use getExtensionSettingsStorageRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export const ExtensionSettingsStorageService = {
  get Root() {
    return getExtensionSettingsStorageRootService();
  },
  get Proxy() {
    return getExtensionSettingsStorageProxyService();
  },
  get Instance() {
    return isBackgroundScript()
      ? getExtensionSettingsStorageRootService()
      : getExtensionSettingsStorageProxyService();
  },
};

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
