import { DocumentAdapter } from "@comctx-adapters/core";
import defineProxy from "comctx";

import {
  csProxyServiceName,
  DomSelectorsService,
} from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import { isInContentScript } from "@/utils/utils";

let serviceInstance: typeof DomSelectorsService | undefined;

export function getDomSelectorsRootService(): typeof DomSelectorsService {
  invariant(
    isInContentScript() && !isMainWorldContext(),
    "This method is only allowed in content script, use getDomSelectorsProxyService instead.",
  );

  serviceInstance ??= DomSelectorsService;

  return serviceInstance;
}

export default function () {
  const [registerService] = defineProxy(getDomSelectorsRootService, {
    namespace: csProxyServiceName,
  });

  registerService(new DocumentAdapter(`complexity:${csProxyServiceName}`));
}
