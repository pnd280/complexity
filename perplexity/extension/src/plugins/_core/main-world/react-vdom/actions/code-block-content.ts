import { findReactFiberNodeValue } from "@/plugins/_core/main-world/react-vdom/utils";
import { DomSelectorsServiceImpl } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import { errorWrapper } from "@/utils/error-wrapper";
import { getReactFiberKey } from "@/utils/utils";

export type CodeBlockContentParams = {
  messageBlockIndex: number;
  codeBlockIndex: number;
};

export type CodeBlockContent = {
  code: string;
  language: string;
} | null;

export type CodeBlocksContentParams = {
  codeBlocks: CodeBlockContentParams[];
};

export function getCodeBlocksContent(
  params: CodeBlocksContentParams,
): CodeBlockContent[] {
  return params.codeBlocks.map(({ messageBlockIndex, codeBlockIndex }) =>
    getCodeBlockContent({ messageBlockIndex, codeBlockIndex }),
  );
}

export function getCodeBlockContent(
  params: CodeBlockContentParams,
): CodeBlockContent {
  const { messageBlockIndex, codeBlockIndex } = params;

  const selector = buildCodeBlockSelector(messageBlockIndex, codeBlockIndex);
  const $el = $(selector);

  if (!$el[0]) return null;

  const fiberNode = ($el[0] as any)[getReactFiberKey($el[0])];

  const [code, codeError] = extractCodeContent(fiberNode);
  if (codeError || code == null) return null;

  const [language, languageError] = extractLanguageInfo(fiberNode);

  return {
    code,
    language: languageError || language == null ? "text" : language,
  };
}

function buildCodeBlockSelector(
  messageBlockIndex: number,
  codeBlockIndex: number,
): string {
  return `${DomSelectorsServiceImpl.cplxAttribute(
    DomSelectorsServiceImpl.internalAttributes.THREAD.MESSAGE.BLOCK,
  )}[data-index="${messageBlockIndex}"] ${DomSelectorsServiceImpl.cplxAttribute(
    DomSelectorsServiceImpl.internalAttributes.THREAD.MESSAGE.CODE_BLOCK,
  )}[data-index="${codeBlockIndex}"] pre`;
}

function extractCodeContent(fiberNode: any): [string | null, Error | null] {
  return errorWrapper(() =>
    findReactFiberNodeValue({
      fiberNode,
      condition: (node) => node.memoizedProps.children.props.children != null,
      select: (node) => node.memoizedProps.children.props.children as string,
    }),
  )();
}

function extractLanguageInfo(fiberNode: any): [string | null, Error | null] {
  return errorWrapper(() =>
    findReactFiberNodeValue({
      fiberNode,
      condition: (node) => node.memoizedProps.children.props.className != null,
      select: (node) => {
        return node.memoizedProps.children.props.className.replace(
          /^language-/,
          "",
        );
      },
    }),
  )();
}
