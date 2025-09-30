import { defineProxy } from "comctx";

import {
  getCodeBlockContent,
  getCodeBlocksContent,
} from "@/plugins/__core__/dom-observers/_main-world/actions/code-block-content";
import {
  getInternalSearchStates,
  setInternalSearchStates,
} from "@/plugins/__core__/dom-observers/_main-world/actions/internal-search-states";
import { getThreadMessages } from "@/plugins/__core__/dom-observers/_main-world/actions/thread-messages";
import { isInContentScript } from "@/utils/misc/utils";
import { getDocumentAdapter } from "@/utils/wrappers/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/wrappers/comctx/types";
import { mainWorldExec } from "@/utils/wrappers/hof";

const namespace = "corePlugin:domObservers:mainWorldActions";

const [registerService, getService] = defineProxy(getRootService, {
  namespace,
  backup: false,
});

const Implementation = {
  isInitialized: () => true,
  getThreadMessages,
  getCodeBlocksContent,
  getCodeBlockContent,
  getInternalSearchStates,
  setInternalSearchStates,
};

let rootServiceInstance: typeof Implementation | undefined;
let proxyServiceInstance: typeof Implementation | undefined;

function getRootService(): typeof Implementation {
  invariant(
    isInContentScript() && isMainWorldContext(),
    "[DomObserversMainWorldActions] Invalid context",
  );

  rootServiceInstance ??= Implementation;

  return rootServiceInstance;
}

function getProxyService(): ComctxProxy<typeof Implementation> {
  invariant(
    !isMainWorldContext(),
    "[DomObserversMainWorldActions] Invalid context",
  );

  proxyServiceInstance ??= getService(
    getDocumentAdapter(`complexity:${namespace}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<typeof Implementation>;
}

export const DomObserversMainWorldActions = {
  get Root() {
    return getRootService();
  },
  get Proxy() {
    return getProxyService();
  },
  get Instance(): ComctxProxy<typeof Implementation> {
    return isMainWorldContext() ? (getRootService() as any) : getProxyService();
  },
};

mainWorldExec(() => {
  registerService(getDocumentAdapter(`complexity:${namespace}`));
})();
