import FiberSearchService from "@/plugins/__core__/_main-world/fiber-search";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";
import { DomSelectorsServiceImpl } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import { errorWrapper } from "@/utils/wrappers/error-wrapper";
import { walkFiberNode } from "@/utils/wrappers/react-fiber";

export async function triggerRewriteOption(params: {
  messageBlockIndex: number;
  optionIndex?: number;
  fiberConfig: {
    name: string;
    dataNodePath: string[];
  };
}): Promise<boolean> {
  const domSelectors = await DomSelectorsService.Proxy.getCache();

  const { messageBlockIndex, optionIndex } = params;

  const selector = `${DomSelectorsServiceImpl.cplxAttribute(
    DomSelectorsServiceImpl.internalAttributes.THREAD.MESSAGE.BLOCK,
  )}[data-index="${messageBlockIndex}"] ${DomSelectorsServiceImpl.cplxAttribute(
    DomSelectorsServiceImpl.internalAttributes.THREAD.MESSAGE.FOOTER,
  )} ${domSelectors.THREAD.MESSAGE.FOOTER_CHILD.REWRITE_BUTTON_WRAPPER}`;

  const fiberNode = FiberSearchService.findFiberNodes(
    {
      name: params.fiberConfig.name,
    },
    {
      rootElementSelector: selector,
      exact: true,
      maxDepth: 100,
      cache: false,
    },
  ) as any;

  if (fiberNode == null) return false;

  const [triggerRewriteOptionHandler] = errorWrapper<() => void>(() => {
    const node = walkFiberNode(fiberNode, params.fiberConfig.dataNodePath);
    return node[optionIndex ?? node.length - 1].onClick;
  })();

  if (triggerRewriteOptionHandler == null) return false;

  triggerRewriteOptionHandler();

  return true;
}
