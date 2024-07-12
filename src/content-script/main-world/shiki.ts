import { ui } from '@/utils/ui';
import {
  injectMainWorldScriptBlock,
  isMainWorldContext,
  sleep,
} from '@/utils/utils';

import { webpageMessenger } from './messenger';

class ShikiHighlighter {
  private static instance: ShikiHighlighter;
  private importPromise: Promise<void> | null = null;

  // private supportedLangs = ['csharp', 'gdscript', 'blade'];

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
        import { codeToHtml } from 'https://esm.sh/shiki@1.10.3';
        window.shiki = { codeToHtml };
      `;

      this.importPromise = injectMainWorldScriptBlock({
        scriptContent,
        waitForExecution: true,
      }).catch((error) => {
        console.error('Failed to import Shiki:', error);
        throw error;
      });
    }

    return this.importPromise;
  }

  private setupCodeBlockHighlightListener(): void {
    webpageMessenger.onMessage(
      'isShikiHighlighterInitialized',
      async () => !!window.shiki
    );
    webpageMessenger.onMessage(
      'getHighlightedCodeAsHtml',
      this.handleHighlightRequest.bind(this)
    );
  }

  private async handleHighlightRequest({
    payload,
  }: {
    payload: { code: string; lang: string };
  }): Promise<string | null> {
    const { code, lang } = payload;

    if (!code) {
      console.warn('Received empty code for highlighting');
      return null;
    }

    try {
      await this.importShiki();
      const theme = ui.isDarkTheme() ? 'dark-plus' : 'light-plus';
      return await window.shiki.codeToHtml(code, { lang, theme });
    } catch (error) {
      console.error('Error highlighting code:', error);
      return null;
    }
  }
}

const waitForInitialization = (() => {
  let initializationPromise: Promise<void>;

  return (): Promise<void> => {
    if (isMainWorldContext()) return Promise.resolve();

    if (initializationPromise) return initializationPromise;

    const checkForInitialization = async (): Promise<void> => {
      const isInitialized = await webpageMessenger.sendMessage({
        event: 'isShikiHighlighterInitialized',
        timeout: 1000,
      });

      if (!isInitialized) {
        await sleep(100);
        return checkForInitialization();
      }
    };

    initializationPromise = checkForInitialization();
    return initializationPromise;
  };
})();

if (isMainWorldContext()) {
  ShikiHighlighter.getInstance().initialize();
}

export const shikiContentScript = {
  waitForInitialization,
};
