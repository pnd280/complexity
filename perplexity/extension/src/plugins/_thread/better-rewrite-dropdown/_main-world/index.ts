import { defineProxy } from "comctx";

import { triggerRewriteOption } from "@/plugins/_thread/better-rewrite-dropdown/_main-world/trigger-rewrite-option";
import { isInContentScript } from "@/utils/misc/utils";
import { getDocumentAdapter } from "@/utils/wrappers/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/wrappers/comctx/types";
import { mainWorldExec } from "@/utils/wrappers/hof";

const namespace = "plugin:thread:betterRewriteDropdowns:mainWorldActions";

const [registerService, getService] = defineProxy(getRootService, {
  namespace,
  backup: false,
});

const Implementation = {
  triggerRewriteOption,
};

let rootServiceInstance: typeof Implementation | undefined;
let proxyServiceInstance: typeof Implementation | undefined;

function getRootService(): typeof Implementation {
  invariant(
    isInContentScript() && isMainWorldContext(),
    "[BetterRewriteDropdownsMainWorldActions] Invalid context",
  );

  rootServiceInstance ??= Implementation;

  return rootServiceInstance;
}

function getProxyService(): ComctxProxy<typeof Implementation> {
  invariant(
    !isMainWorldContext(),
    "[BetterRewriteDropdownsMainWorldActions] Invalid context",
  );

  proxyServiceInstance ??= getService(
    getDocumentAdapter(`complexity:${namespace}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<typeof Implementation>;
}

export const BetterRewriteDropdownsMainWorldActions = {
  get Root() {
    return getRootService();
  },
  get Proxy() {
    return getProxyService();
  },
  get Instance(): ComctxProxy<typeof Implementation> {
    return isMainWorldContext()
      ? (getRootService() as unknown as ComctxProxy<typeof Implementation>)
      : getProxyService();
  },
};

mainWorldExec(() => {
  registerService(getDocumentAdapter(`complexity:${namespace}`));
})();
