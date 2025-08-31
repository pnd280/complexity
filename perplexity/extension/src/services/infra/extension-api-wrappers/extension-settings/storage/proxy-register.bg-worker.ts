import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import defineProxy from "comctx";

import {
  backgroundProxyServiceName,
  ExtensionSettingsStorageService,
} from "@/services/infra/extension-api-wrappers/extension-settings/storage";
import { isBackgroundScript } from "@/utils/utils";

let serviceInstance: typeof ExtensionSettingsStorageService | undefined;

export function getExtensionSettingsStorageRootService(): typeof ExtensionSettingsStorageService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getExtensionSettingsStorageProxyService instead.",
  );

  serviceInstance ??= ExtensionSettingsStorageService;

  return serviceInstance;
}

export default function () {
  const [registerService] = defineProxy(
    getExtensionSettingsStorageRootService,
    {
      namespace: backgroundProxyServiceName,
    },
  );

  registerService(new BrowserRuntimeAdapter());
}
