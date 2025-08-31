import type { DeclarativeNetRequestService } from "@/services/infra/extension-api-wrappers/declarative-net-request";
import { getDeclarativeNetRequestProxyService } from "@/services/infra/extension-api-wrappers/declarative-net-request/proxy";
import { getDeclarativeNetRequestRootService } from "@/services/infra/extension-api-wrappers/declarative-net-request/proxy-register.bg-worker";
import { isBackgroundScript } from "@/utils/utils";

export function getDeclarativeNetRequestService(): typeof DeclarativeNetRequestService {
  return isBackgroundScript()
    ? getDeclarativeNetRequestRootService()
    : getDeclarativeNetRequestProxyService();
}
