import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  ExtensionSettingsStorageService,
} from "@/services/infra/extension-api-wrappers/extension-settings/storage";
import { isBackgroundScript } from "@/utils/utils";

let rootServiceInstance: typeof ExtensionSettingsStorageService | undefined;
let proxyServiceInstance: typeof ExtensionSettingsStorageService | undefined;

const [registerService, getService] = defineProxy(
  getExtensionSettingsStorageRootService,
  {
    namespace: backgroundProxyServiceName,
    backup: false,
  },
);

export function getExtensionSettingsStorageRootService(): typeof ExtensionSettingsStorageService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getExtensionSettingsStorageProxyService instead.",
  );

  rootServiceInstance ??= ExtensionSettingsStorageService;

  return rootServiceInstance;
}

export function getExtensionSettingsStorageProxyService(): typeof ExtensionSettingsStorageService {
  invariant(
    !isBackgroundScript(),
    "Use getExtensionSettingsStorageRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export function getExtensionSettingsStorageService(): typeof ExtensionSettingsStorageService {
  return isBackgroundScript()
    ? getExtensionSettingsStorageRootService()
    : getExtensionSettingsStorageProxyService();
}

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
