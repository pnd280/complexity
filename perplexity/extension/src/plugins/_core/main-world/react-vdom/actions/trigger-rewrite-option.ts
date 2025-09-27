import { DomSelectorsService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { findReactFiberNodeValue } from "@/plugins/_core/main-world/react-vdom/utils";
import { DomSelectorsServiceImpl } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import { getReactFiberKey } from "@/utils/dom-utils/generics";
import { errorWrapper } from "@/utils/wrappers/error-wrapper";

export async function triggerRewriteOption(params: {
  messageBlockIndex: number;
  optionIndex?: number;
}): Promise<boolean> {
  const domSelectors = await DomSelectorsService.Proxy.getCache();

  const { messageBlockIndex, optionIndex } = params;

  const selector = `${DomSelectorsServiceImpl.cplxAttribute(
    DomSelectorsServiceImpl.internalAttributes.THREAD.MESSAGE.BLOCK,
  )}[data-index="${messageBlockIndex}"] ${DomSelectorsServiceImpl.cplxAttribute(
    DomSelectorsServiceImpl.internalAttributes.THREAD.MESSAGE.FOOTER,
  )} ${domSelectors.THREAD.MESSAGE.FOOTER_CHILD.REWRITE_BUTTON}`;

  const $rewriteButtonWrapper = $(selector).parent().parent();

  if (!$rewriteButtonWrapper[0]) return false;

  const fiberNode = ($rewriteButtonWrapper[0] as any)[
    getReactFiberKey($rewriteButtonWrapper[0])
  ];

  if (fiberNode == null) return false;

  const [triggerRewriteOptionHandler, error] = errorWrapper(() =>
    findReactFiberNodeValue({
      fiberNode,
      condition: (node) => {
        const items = node.memoizedProps.children.props.items;
        const index = optionIndex ?? items.length - 3;
        return items[index].onClick != null;
      },
      select: (node) => {
        const items = node.memoizedProps.children.props.items;
        const index = optionIndex ?? items.length - 3;
        return items[index].onClick as () => void;
      },
    }),
  )();

  if (error || triggerRewriteOptionHandler == null) return false;

  triggerRewriteOptionHandler();

  return true;
}
