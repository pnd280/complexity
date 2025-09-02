import { getDocumentAdapter } from "@/utils/comctx/get-document-adapter";
import { defineProxy } from "comctx";

import {
  mainWorldProxyServiceName,
  ReactVdomService,
} from "@/plugins/_core/main-world/react-vdom/service";
import { isInContentScript } from "@/utils/utils";

let serviceInstance: typeof ReactVdomService | undefined;

export function getReactVdomRootService(): typeof ReactVdomService {
  invariant(
    isInContentScript() && isMainWorldContext(),
    "This method is only allowed in main world, use getReactVdomProxyService instead.",
  );

  serviceInstance ??= ReactVdomService;

  return serviceInstance;
}

export default function registerProxyService() {
  const [registerService] = defineProxy(getReactVdomRootService, {
    namespace: mainWorldProxyServiceName,
  });

  registerService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );
}
