import { DomSelectorsServiceImpl } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import { getReactFiberKey } from "@/utils/wrappers/react-fiber";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fiberNode = ($el[0] as any)[getReactFiberKey($el[0])];

  const [code] = extractCodeContent(fiberNode);
  if (code == null) return null;

  const [language] = extractLanguageInfo(fiberNode);

  return {
    code,
    language: language == null ? "text" : language,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractCodeContent(fiberNode: any): [string | null, Error | null] {
  return tryCatch(
    () =>
      (fiberNode.alternate != null ? fiberNode.alternate : fiberNode)
        .memoizedProps.children.props.children,
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractLanguageInfo(fiberNode: any): [string | null, Error | null] {
  return tryCatch(() =>
    (fiberNode.alternate != null
      ? fiberNode.alternate
      : fiberNode
    ).memoizedProps.children.props.className.replace(/^language-/, ""),
  );
}
