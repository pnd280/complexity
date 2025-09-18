import type { InternalSearchStatesObserverStoreType } from "@/plugins/_core/dom-observers/internal-search-states/store";
import {
  getCodeBlockContent,
  getCodeBlocksContent,
  type CodeBlockContent,
  type CodeBlockContentParams,
  type CodeBlocksContentParams,
} from "@/plugins/_core/main-world/react-vdom/actions/code-block-content";
import {
  getInternalSearchStates,
  setInternalSearchStates,
} from "@/plugins/_core/main-world/react-vdom/actions/internal-search-states";
import {
  getLexicalEditorJsonContent,
  setLexicalEditorContent,
} from "@/plugins/_core/main-world/react-vdom/actions/lexical";
import {
  getThreadMessages,
  type MessageBlockFiberData,
} from "@/plugins/_core/main-world/react-vdom/actions/thread-messages";
import { triggerRewriteOption } from "@/plugins/_core/main-world/react-vdom/actions/trigger-rewrite-option";

export const mainWorldProxyServiceName = "reactVdomService";

export class ReactVdomServiceImpl {
  static isInitialized(): boolean {
    return true;
  }

  static async getThreadMessages(
    remoteFiberNodePath?: string[],
  ): Promise<MessageBlockFiberData[] | null> {
    return getThreadMessages({ remoteFiberNodePath });
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

  static async getInternalSearchStates({
    remoteValidationFiberPath,
    remoteStatesFiberPath,
  }: {
    remoteValidationFiberPath?: string[];
    remoteStatesFiberPath?: string[];
  }): Promise<InternalSearchStatesObserverStoreType> {
    return getInternalSearchStates({
      remoteValidationFiberPath,
      remoteStatesFiberPath,
    });
  }

  static async setInternalSearchStates(
    states: Partial<InternalSearchStatesObserverStoreType>,
    {
      remoteValidationFiberPath,
      remoteStatesFiberPath,
    }: {
      remoteValidationFiberPath?: string[];
      remoteStatesFiberPath?: string[];
    } = {},
  ): Promise<void> {
    return setInternalSearchStates({
      states,
      remoteValidationFiberPath,
      remoteStatesFiberPath,
    });
  }
}

export type ReactVdomService = typeof ReactVdomServiceImpl;
