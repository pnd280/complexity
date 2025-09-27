import { defineProxy } from "comctx";

import {
  csProxyServiceName,
  DomSelectorsServiceImpl,
  type DomSelectorsService as DomSelectorsServiceType,
} from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import {
  isMainWorldContext,
  invariant,
  isInContentScript,
} from "@/utils/misc/utils";
import { getDocumentAdapter } from "@/utils/wrappers/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/wrappers/comctx/types";

let rootServiceInstance: DomSelectorsServiceType | undefined;
let proxyServiceInstance: ComctxProxy<DomSelectorsServiceType> | undefined;

const [registerService, getProxy] = defineProxy(getDomSelectorsRootService, {
  namespace: csProxyServiceName,
  backup: false,
});

function getDomSelectorsRootService(): DomSelectorsServiceType {
  invariant(
    isInContentScript() && !isMainWorldContext(),
    "This method is only allowed in content script, use getDomSelectorsProxyService instead.",
  );

  rootServiceInstance ??= DomSelectorsServiceImpl;

  return rootServiceInstance;
}

function getDomSelectorsProxyService(): ComctxProxy<DomSelectorsServiceType> {
  invariant(
    isMainWorldContext(),
    "Use getDomSelectorsRootService to access the non-proxied instance in content script.",
  );

  proxyServiceInstance ??= getProxy(
    getDocumentAdapter(`complexity:${csProxyServiceName}`),
  ) as unknown as ComctxProxy<DomSelectorsServiceType>;

  return proxyServiceInstance;
}

export const DomSelectorsService = {
  get Root() {
    return getDomSelectorsRootService();
  },
  get Proxy() {
    return getDomSelectorsProxyService();
  },
  get Instance() {
    return isInContentScript()
      ? getDomSelectorsProxyService()
      : getDomSelectorsRootService();
  },
};

export default function () {
  registerService(getDocumentAdapter(`complexity:${csProxyServiceName}`));
}
