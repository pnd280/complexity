import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import defineProxy from "comctx";

import {
  backgroundProxyServiceName,
  PromptHistoryService,
} from "@/plugins/prompt-history/indexed-db";
import { isBackgroundScript } from "@/utils/utils";

let serviceInstance: PromptHistoryService | undefined;

export function getPromptHistoryService(): PromptHistoryService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getPromptHistoryProxyService instead.",
  );

  serviceInstance ??= new PromptHistoryService();

  return serviceInstance;
}

export default function listener() {
  const [registerService] = defineProxy(() => getPromptHistoryService(), {
    namespace: backgroundProxyServiceName,
  });

  registerService(new BrowserRuntimeAdapter());
}
