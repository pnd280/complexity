import { DocumentAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import { csProxyServiceName } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import type { DomSelectorsService } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import type { ComctxProxy } from "@/utils/comctx-async-proxy";

const [, getService] = defineProxy(() => ({}) as typeof DomSelectorsService, {
  namespace: csProxyServiceName,
});

let proxyServiceInstance: typeof DomSelectorsService | undefined;

export function getDomSelectorsProxyService(): ComctxProxy<
  typeof DomSelectorsService
> {
  invariant(
    isMainWorldContext(),
    "Use getDomSelectorsRootService to access the non-proxied instance in content script.",
  );

  proxyServiceInstance ??= getService(
    new DocumentAdapter(`complexity:${csProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<
    typeof DomSelectorsService
  >;
}
