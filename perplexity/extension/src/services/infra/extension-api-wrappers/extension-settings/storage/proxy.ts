import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import type { ExtensionSettingsStorageService } from "@/services/infra/extension-api-wrappers/extension-settings/storage";
import { backgroundProxyServiceName } from "@/services/infra/extension-api-wrappers/extension-settings/storage";
import { isBackgroundScript } from "@/utils/utils";

const [, getService] = defineProxy(
  () => ({}) as typeof ExtensionSettingsStorageService,
  {
    namespace: backgroundProxyServiceName,
  },
);

let proxyServiceInstance: typeof ExtensionSettingsStorageService | undefined;

export function getExtensionSettingsStorageProxyService(): typeof ExtensionSettingsStorageService {
  invariant(
    !isBackgroundScript(),
    "Use getExtensionSettingsStorageRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}
