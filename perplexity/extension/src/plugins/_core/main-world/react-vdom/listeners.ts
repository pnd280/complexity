import { onMessage } from "webext-bridge/window";

import {
  getCodeBlockContent,
  getCodeBlocksContent,
  type CodeBlockContent,
  type CodeBlockContentParams,
  type CodeBlocksContentParams,
} from "@/plugins/_core/main-world/react-vdom/actions/get-code-block-content";
import type { MessageBlockFiberData } from "@/plugins/_core/main-world/react-vdom/actions/get-messages";
import { getMessages } from "@/plugins/_core/main-world/react-vdom/actions/get-messages";
import {
  getLexicalEditorJsonContent,
  setLexicalEditorContent,
} from "@/plugins/_core/main-world/react-vdom/actions/lexical";
import { triggerRewriteOption } from "@/plugins/_core/main-world/react-vdom/actions/trigger-rewrite-option";

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "reactVdom:isInitialized": () => true;
    "reactVdom:getMessages": (params: {
      remoteFiberNodePath?: string[];
    }) => MessageBlockFiberData[] | null;
    "reactVdom:getCodeBlocksContent": (
      params: CodeBlocksContentParams,
    ) => CodeBlockContent[];
    "reactVdom:getCodeBlockContent": (
      params: CodeBlockContentParams,
    ) => CodeBlockContent | null;
    "reactVdom:triggerRewriteOption": (params: {
      messageBlockIndex: number;
      optionIndex?: number;
    }) => boolean;
    "reactVdom:setLexicalEditorContent": (params: { content: string }) => void;
    "reactVdom:getLexicalEditorJsonContent": () => string | undefined;
  }
}

export async function setupReactVdomListeners() {
  onMessage("reactVdom:getMessages", ({ data }) => getMessages(data));

  onMessage("reactVdom:getCodeBlocksContent", ({ data }) =>
    getCodeBlocksContent(data),
  );

  onMessage("reactVdom:getCodeBlockContent", ({ data }) =>
    getCodeBlockContent(data),
  );

  onMessage("reactVdom:triggerRewriteOption", ({ data }) =>
    triggerRewriteOption(data),
  );

  onMessage("reactVdom:setLexicalEditorContent", ({ data }) => {
    setLexicalEditorContent(data);
  });

  onMessage("reactVdom:getLexicalEditorJsonContent", () => {
    return getLexicalEditorJsonContent();
  });

  onMessage("reactVdom:isInitialized", () => {
    return true;
  });
}
