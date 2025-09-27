import { defineProxy } from "comctx";

import {
  mainWorldProxyServiceName,
  ReactVdomServiceImpl,
  type ReactVdomService as ReactVdomServiceType,
} from "@/plugins/_core/main-world/react-vdom/service";
import { isInContentScript } from "@/utils/misc/utils";
import { getDocumentAdapter } from "@/utils/wrappers/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/wrappers/comctx/types";

let rootServiceInstance: ReactVdomServiceType | undefined;
let proxyServiceInstance: ReactVdomServiceType | undefined;

const [registerService, getService] = defineProxy(getReactVdomRootService, {
  namespace: mainWorldProxyServiceName,
  backup: false,
});

function getReactVdomRootService(): ReactVdomServiceType {
  invariant(
    isInContentScript() && isMainWorldContext(),
    "This method is only allowed in main world, use getReactVdomProxyService instead.",
  );

  rootServiceInstance ??= ReactVdomServiceImpl;

  return rootServiceInstance;
}

function getReactVdomProxyService(): ComctxProxy<ReactVdomServiceType> {
  invariant(
    !isMainWorldContext(),
    "Use getReactVdomRootService to access the non-proxied instance in main world.",
  );

  proxyServiceInstance ??= getService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<ReactVdomServiceType>;
}

export const ReactVdomService = {
  get Root() {
    return getReactVdomRootService();
  },
  get Proxy() {
    return getReactVdomProxyService();
  },
  get Instance(): ComctxProxy<ReactVdomServiceType> {
    return isMainWorldContext()
      ? (getReactVdomRootService() as any)
      : getReactVdomProxyService();
  },
};

export default function registerProxyService() {
  registerService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );
}
