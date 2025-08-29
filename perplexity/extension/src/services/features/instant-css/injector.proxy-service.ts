import { defineProxyService } from "@webext-core/proxy-service";

import { APP_CONFIG } from "@/app.config";
import { InstantCssService } from "@/services/features/instant-css";
import { instantCssCoordinator } from "@/services/features/instant-css/coordinator";
import type {
  InstantCss,
  InstantCssSettings,
} from "@/services/features/instant-css/types";
import { getProcessedCssEntries } from "@/services/features/instant-css/utils";
import { invariant, isBackgroundScript } from "@/utils/utils";

export class InstantCssInjector {
  static async injectCssToTab(tabId: number) {
    instantCssCoordinator.resetTab(tabId);

    await instantCssCoordinator.forceCleanup().catch((error) => {
      console.error("Failed to clean up tabs during injection:", error);
    });

    try {
      const entries = await getProcessedCssEntries();

      for (const { id, css, removeAfter, enabled } of entries) {
        InstantCssInjector.injectCss({
          id: id as keyof InstantCssSettings,
          tabId,
          css,
          removeAfter,
          enabled,
        });
      }
    } catch (error) {
      console.error("Failed to apply instant css:", error);
    }
  }

  private static autoInjector = async (
    details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
  ) => {
    if (details.frameId !== 0) return;

    if (!details.url) return;

    await InstantCssInjector.injectCssToTab(details.tabId);
  };

  static async forceInjectAllPplxTabs() {
    const tabs = await chrome.tabs.query({
      url: APP_CONFIG["perplexity-ai"].globalMatches,
    });

    for (const tab of tabs) {
      if (tab.id == null) continue;
      await InstantCssInjector.injectCssToTab(tab.id);
    }
  }

  private static tabRemovedHandler = (tabId: number) => {
    instantCssCoordinator.removeTab(tabId);
  };

  static async injectCss(
    params: InstantCss & { id: keyof InstantCssSettings; tabId: number },
  ) {
    await instantCssCoordinator.injectCss(params);
  }

  static async removeCss(params: InstantCss & { tabId: number }) {
    await instantCssCoordinator.removeCss(params);
  }

  static async registerListeners() {
    invariant(
      isBackgroundScript(),
      "This method is not allowed in content script",
    );

    InstantCssInjector.removeListeners();

    if (!(await InstantCssService.hasPermissions())) return;

    chrome.webNavigation.onCommitted.addListener(
      InstantCssInjector.autoInjector,
      {
        url: APP_CONFIG["perplexity-ai"].globalMatches.map((match) => ({
          urlMatches: match,
        })),
      },
    );

    chrome.tabs.onRemoved.addListener(InstantCssInjector.tabRemovedHandler);
  }

  static async removeListeners() {
    invariant(
      isBackgroundScript(),
      "This method is not allowed in content script",
    );

    if (!(await InstantCssService.hasPermissions())) return;

    chrome.webNavigation.onCommitted.removeListener(
      InstantCssInjector.autoInjector,
    );

    chrome.tabs.onRemoved.removeListener(InstantCssInjector.tabRemovedHandler);
  }
}

export const [registerService, getInstantCssInjectorService] =
  defineProxyService("InstantCssInjector", () => InstantCssInjector);
