import { APP_CONFIG } from "@/app.config";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { DomSelectorsServiceImpl } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import { findFiberNodes } from "@/utils/dom-utils/fiber-search";
import { walkFiberNode } from "@/utils/wrappers/react-fiber";

export async function triggerRewriteOption(params: {
  messageBlockIndex: number;
  fiberConfig: {
    name: string;
    dataNodePath: string[];
  };
}): Promise<boolean> {
  const domSelectors = await DomSelectorsService.Proxy.getCache();

  const { messageBlockIndex } = params;

  const selector = `${DomSelectorsServiceImpl.cplxAttribute(
    DomSelectorsServiceImpl.internalAttributes.THREAD.MESSAGE.BLOCK,
  )}[data-index="${messageBlockIndex}"] ${DomSelectorsServiceImpl.cplxAttribute(
    DomSelectorsServiceImpl.internalAttributes.THREAD.MESSAGE.FOOTER,
  )} ${domSelectors.THREAD.MESSAGE.FOOTER_CHILD.REWRITE_BUTTON_WRAPPER}`;

  const fiberNode = findFiberNodes(
    {
      name: params.fiberConfig.name,
    },
    {
      rootElementSelector: selector,
      exact: true,
      maxDepth: 100,
      cache: false,
      traverseDirection: "up",
    },
  );

  if (fiberNode == null) {
    if (APP_CONFIG.IS_DEV) {
      console.error("❌ [TriggerRewriteOption] No fiber node found");
    }

    return false;
  }

  const [triggerRewriteOptionHandler] = tryCatch(
    () =>
      walkFiberNode(fiberNode, params.fiberConfig.dataNodePath) as () => void,
  );

  if (triggerRewriteOptionHandler == null) return false;

  triggerRewriteOptionHandler();

  return true;
}
