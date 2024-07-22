import $ from "jquery";

import { extensionOnly, mainWorldExec } from "@/utils/hoc";
import UIUtils from "@/utils/UI";
import { injectMainWorldScriptBlock, sleep } from "@/utils/utils";

import { webpageMessenger } from "./webpage-messenger";

class ShikiHighlighter {
  private static instance: ShikiHighlighter;
  private importPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): ShikiHighlighter {
    if (!ShikiHighlighter.instance) {
      ShikiHighlighter.instance = new ShikiHighlighter();
    }
    return ShikiHighlighter.instance;
  }

  async initialize(): Promise<void> {
    this.setupCodeBlockHighlightListener();
    this.importShiki();
  }

  private async importShiki(): Promise<void> {
    if (window.shiki) return;

    if (!this.importPromise) {
      const scriptContent = `
        import * as shiki from 'https://esm.sh/shiki@1.10.3';
        window.shiki = shiki;
      `;

      this.importPromise = injectMainWorldScriptBlock({
        scriptContent,
        waitForExecution: true,
      }).catch((error) => {
        console.error("Failed to import Shiki:", error);
        throw error;
      });
    }

    return this.importPromise;
  }

  private setupCodeBlockHighlightListener(): void {
    webpageMessenger.onMessage(
      "isShikiHighlighterInitialized",
      async () => !!window.shiki,
    );
    webpageMessenger.onMessage(
      "getHighlightedCodeAsHtml",
      this.handleHighlightRequest.bind(this),
    );
  }

  private async handleHighlightRequest({
    payload,
  }: {
    payload: { code: string; lang: string };
  }): Promise<string | null> {
    const { code, lang } = payload;

    if (!code) {
      throw new Error("Received empty code for highlighting");
    }

    try {
      await this.importShiki();
      const theme = UIUtils.isDarkTheme() ? "dark-plus" : "light-plus";

      if (!(lang in window.shiki!.bundledLanguages)) return null;

      return await window.shiki!.codeToHtml(code, {
        lang,
        theme,
      });
    } catch (error) {
      console.error("Error highlighting code:", error);
      return null;
    }
  }
}

const waitForInitialization = () => {
  let initializationPromise: Promise<void>;

  return extensionOnly((): Promise<void> => {
    if (initializationPromise) return initializationPromise;

    const checkForInitialization = async (): Promise<void> => {
      const isInitialized = await webpageMessenger.sendMessage({
        event: "isShikiHighlighterInitialized",
        timeout: 1000,
        suppressTimeoutError: true,
      });

      if (!isInitialized) {
        await sleep(100);
        return checkForInitialization();
      }
    };

    initializationPromise = checkForInitialization();
    return initializationPromise;
  })();
};

mainWorldExec(() =>
  $(() => {
    ShikiHighlighter.getInstance().initialize();
  }),
)();

export const shikiContentScript = {
  waitForInitialization,
};
