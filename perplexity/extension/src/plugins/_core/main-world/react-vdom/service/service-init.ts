import { defineProxy } from "comctx";

import {
  mainWorldProxyServiceName,
  ReactVdomServiceImpl,
  type ReactVdomService,
} from "@/plugins/_core/main-world/react-vdom/service";
import { isInContentScript } from "@/utils/misc/utils";
import { getDocumentAdapter } from "@/utils/wrappers/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/wrappers/comctx/types";

let rootServiceInstance: ReactVdomService | undefined;
let proxyServiceInstance: ReactVdomService | undefined;

const [registerService, getService] = defineProxy(getReactVdomRootService, {
  namespace: mainWorldProxyServiceName,
  backup: false,
});

export function getReactVdomRootService(): ReactVdomService {
  invariant(
    isInContentScript() && isMainWorldContext(),
    "This method is only allowed in main world, use getReactVdomProxyService instead.",
  );

  rootServiceInstance ??= ReactVdomServiceImpl;

  return rootServiceInstance;
}

export function getReactVdomProxyService(): ComctxProxy<ReactVdomService> {
  invariant(
    !isMainWorldContext(),
    "Use getReactVdomRootService to access the non-proxied instance in main world.",
  );

  proxyServiceInstance ??= getService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<ReactVdomService>;
}

export function getReactVdomService(): ComctxProxy<ReactVdomService> {
  return isMainWorldContext()
    ? (getReactVdomRootService() as any)
    : getReactVdomProxyService();
}

export default function registerProxyService() {
  registerService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );
}
