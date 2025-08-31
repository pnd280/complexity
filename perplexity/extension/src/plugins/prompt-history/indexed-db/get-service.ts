import type { PromptHistoryService } from "@/plugins/prompt-history/indexed-db";
import { getPromptHistoryProxyService } from "@/plugins/prompt-history/indexed-db/proxy";
import { getPromptHistoryRootService } from "@/plugins/prompt-history/indexed-db/proxy-register.bg-worker";
import { isBackgroundScript } from "@/utils/utils";

export function getPromptHistoryService(): PromptHistoryService {
  return isBackgroundScript()
    ? getPromptHistoryRootService()
    : getPromptHistoryProxyService();
}
