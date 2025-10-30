import type {
  InstantCss,
  InstantCssSettings,
} from "@/services/features/instant-css/types";

export class InstantCssCoordinator {
  private injectedMap = new Map<number, string[]>();

  constructor() {
    this.injectedMap = new Map<number, string[]>();
  }

  isInjected(tabId: number, id: string): boolean {
    return this.injectedMap.get(tabId)?.includes(id) ?? false;
  }

  markAsInjected(tabId: number, id: string): void {
    this.injectedMap.set(tabId, [...(this.injectedMap.get(tabId) ?? []), id]);
  }

  resetTab(tabId: number): void {
    this.injectedMap.set(tabId, []);
  }

  removeTab(tabId: number): void {
    this.injectedMap.delete(tabId);
  }

  getInjectedIds = (tabId: number) => {
    return this.injectedMap.get(tabId) ?? [];
  };

  async injectCss(
    params: InstantCss & { id: keyof InstantCssSettings; tabId: number },
  ) {
    const { css, enabled, removeAfter, id, tabId } = params;

    if (this.isInjected(tabId, id)) {
      return;
    }

    this.markAsInjected(tabId, id);

    if (enabled === false) return;

    if (!params.css.length) return;

    void chrome.scripting.insertCSS({
      target: { tabId },
      css,
    });

    if (removeAfter != null && removeAfter > 0) {
      setTimeout(() => {
        void this.removeCss({
          tabId,
          css,
        });
      }, removeAfter);
    }
  }

  async removeCss(params: InstantCss & { tabId: number }) {
    const { tabId } = params;

    if (!params.css.length) return;

    void chrome.scripting.removeCSS({
      target: { tabId },
      css: params.css,
    });
  }

  async cleanupInvalidTabs(): Promise<void> {
    if (typeof chrome.tabs === "undefined") return;

    try {
      const tabs = await chrome.tabs.query({});
      const validTabIds = new Set(
        tabs.map((tab) => tab.id).filter(Boolean) as number[],
      );

      let removedCount = 0;
      this.injectedMap.forEach((_, tabId) => {
        if (!validTabIds.has(tabId)) {
          this.injectedMap.delete(tabId);
          removedCount++;
        }
      });

      if (removedCount > 0) {
        console.log(`Cleaned up CSS entries for ${removedCount} closed tabs`);
      }
    } catch (error) {
      console.error("Error during tab cleanup:", error);
    }
  }

  async forceCleanup(): Promise<void> {
    return this.cleanupInvalidTabs();
  }
}

export const instantCssCoordinator = new InstantCssCoordinator();
