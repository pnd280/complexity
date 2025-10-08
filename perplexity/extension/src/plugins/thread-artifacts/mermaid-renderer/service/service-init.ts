import { defineProxy } from "comctx";

import {
  mainWorldProxyServiceName,
  MermaidRendererServiceImpl,
  type MermaidRendererService as MermaidRendererServiceType,
} from "@/plugins/thread-artifacts/mermaid-renderer/service";
import { isInContentScript } from "@/utils/misc/utils";
import { getDocumentAdapter } from "@/utils/wrappers/comctx/get-document-adapter";
import type { ComctxProxy } from "@/utils/wrappers/comctx/types";

let rootServiceInstance: MermaidRendererServiceType | undefined;
let proxyServiceInstance: MermaidRendererServiceType | undefined;

const [registerService, getService] = defineProxy(
  getMermaidRendererRootService,
  {
    namespace: mainWorldProxyServiceName,
    backup: false,
  },
);

function getMermaidRendererRootService(): MermaidRendererServiceType {
  invariant(
    isInContentScript() && isMainWorldContext(),
    "[MermaidRendererService] Invalid context",
  );

  rootServiceInstance ??= MermaidRendererServiceImpl.getInstance();

  return rootServiceInstance;
}

function getMermaidRendererProxyService(): ComctxProxy<MermaidRendererServiceType> {
  invariant(!isMainWorldContext(), "[MermaidRendererService] Invalid context");

  proxyServiceInstance ??= getService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  return proxyServiceInstance as unknown as ComctxProxy<MermaidRendererServiceType>;
}

export const MermaidRendererService = {
  get Root() {
    return getMermaidRendererRootService();
  },
  get Proxy() {
    return getMermaidRendererProxyService();
  },
  get Instance(): ComctxProxy<MermaidRendererServiceType> {
    return isMainWorldContext()
      ? (getMermaidRendererRootService() as unknown as ComctxProxy<MermaidRendererServiceType>)
      : getMermaidRendererProxyService();
  },
};

export default function registerProxyService() {
  registerService(
    getDocumentAdapter(`complexity:${mainWorldProxyServiceName}`),
  );

  MermaidRendererServiceImpl.getInstance().initialize();
}
