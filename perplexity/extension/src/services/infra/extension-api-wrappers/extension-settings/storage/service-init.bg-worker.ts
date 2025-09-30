import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  ExtensionSettingsStorageServiceImpl,
} from "@/services/infra/extension-api-wrappers/extension-settings/storage";
import { isBackgroundScript } from "@/utils/misc/utils";

let rootServiceInstance: typeof ExtensionSettingsStorageServiceImpl | undefined;
let proxyServiceInstance:
  | typeof ExtensionSettingsStorageServiceImpl
  | undefined;

const [registerService, getService] = defineProxy(
  getExtensionSettingsStorageRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
  },
);

function getExtensionSettingsStorageRootService(): typeof ExtensionSettingsStorageServiceImpl {
  invariant(
    isBackgroundScript(),
    "[ExtensionSettingsStorageService] Invalid context",
  );

  rootServiceInstance ??= ExtensionSettingsStorageServiceImpl;

  return rootServiceInstance;
}

function getExtensionSettingsStorageProxyService(): typeof ExtensionSettingsStorageServiceImpl {
  invariant(
    !isBackgroundScript(),
    "[ExtensionSettingsStorageService] Invalid context",
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
