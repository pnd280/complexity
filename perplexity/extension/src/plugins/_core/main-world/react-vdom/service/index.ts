import {
  getCodeBlockContent,
  getCodeBlocksContent,
  type CodeBlockContent,
  type CodeBlockContentParams,
  type CodeBlocksContentParams,
} from "@/plugins/_core/main-world/react-vdom/actions/get-code-block-content";
import {
  getMessages,
  type MessageBlockFiberData,
} from "@/plugins/_core/main-world/react-vdom/actions/get-messages";
import {
  getLexicalEditorJsonContent,
  setLexicalEditorContent,
} from "@/plugins/_core/main-world/react-vdom/actions/lexical";
import { triggerRewriteOption } from "@/plugins/_core/main-world/react-vdom/actions/trigger-rewrite-option";

export const mainWorldProxyServiceName = "reactVdomService";

export class ReactVdomService {
  static isInitialized(): boolean {
    return true;
  }

  static async getMessages(
    remoteFiberNodePath?: string[],
  ): Promise<MessageBlockFiberData[] | null> {
    return getMessages({ remoteFiberNodePath });
  }

  static async getCodeBlocksContent(
    params: CodeBlocksContentParams,
  ): Promise<CodeBlockContent[]> {
    return getCodeBlocksContent(params);
  }

  static async getCodeBlockContent(
    params: CodeBlockContentParams,
  ): Promise<CodeBlockContent | null> {
    return getCodeBlockContent(params);
  }

  static async triggerRewriteOption(params: {
    messageBlockIndex: number;
    optionIndex?: number;
  }): Promise<boolean> {
    return triggerRewriteOption(params);
  }

  static async setLexicalEditorContent(params: {
    content: string;
  }): Promise<void> {
    return setLexicalEditorContent(params);
  }

  static async getLexicalEditorJsonContent(): Promise<string | undefined> {
    return getLexicalEditorJsonContent();
  }
}
