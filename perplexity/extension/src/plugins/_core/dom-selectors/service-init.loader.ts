import { defineProxy } from "comctx";

import {
  csProxyServiceName,
  DomSelectorsServiceImpl,
  type DomSelectorsService,
} from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import {
  isMainWorldContext,
  invariant,
  isInContentScript,
} from "@/utils/misc/utils";
import { getDocumentAdapter } from "@/utils/wrappers/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/wrappers/comctx/types";

let rootServiceInstance: DomSelectorsService | undefined;
let proxyServiceInstance: ComctxProxy<DomSelectorsService> | undefined;

const [registerService, getProxy] = defineProxy(getDomSelectorsRootService, {
  namespace: csProxyServiceName,
  backup: false,
});

export function getDomSelectorsRootService(): DomSelectorsService {
  invariant(
    isInContentScript() && !isMainWorldContext(),
    "This method is only allowed in content script, use getDomSelectorsProxyService instead.",
  );

  rootServiceInstance ??= DomSelectorsServiceImpl;

  return rootServiceInstance;
}

export function getDomSelectorsProxyService(): ComctxProxy<DomSelectorsService> {
  invariant(
    isMainWorldContext(),
    "Use getDomSelectorsRootService to access the non-proxied instance in content script.",
  );

  proxyServiceInstance ??= getProxy(
    getDocumentAdapter(`complexity:${csProxyServiceName}`),
  ) as unknown as ComctxProxy<DomSelectorsService>;

  return proxyServiceInstance;
}

export default function () {
  registerService(getDocumentAdapter(`complexity:${csProxyServiceName}`));
}
