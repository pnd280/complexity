import { APP_CONFIG } from "@/app.config";
import { InstantCssService } from "@/services/features/instant-css";
import { instantCssCoordinator } from "@/services/features/instant-css/coordinator";
import type {
  InstantCss,
  InstantCssSettings,
} from "@/services/features/instant-css/types";
import { getProcessedCssEntries } from "@/services/features/instant-css/utils";
import { invariant, isBackgroundScript } from "@/utils/utils";

export { backgroundProxyServiceName } from "@/services/features/instant-css/injector/constants";

export class InstantCssInjectorService {
  static async injectCssToTab(tabId: number) {
    instantCssCoordinator.resetTab(tabId);

    await instantCssCoordinator.forceCleanup().catch((error) => {
      console.error("Failed to clean up tabs during injection:", error);
    });

    try {
      const entries = await getProcessedCssEntries();

      for (const { id, css, removeAfter, enabled } of entries) {
        InstantCssInjectorService.injectCss({
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

    await InstantCssInjectorService.injectCssToTab(details.tabId);
  };

  static async forceInjectAllPplxTabs() {
    const tabs = await chrome.tabs.query({
      url: APP_CONFIG["perplexity-ai"].globalMatches,
    });

    for (const tab of tabs) {
      if (tab.id == null) continue;
      await InstantCssInjectorService.injectCssToTab(tab.id);
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

    InstantCssInjectorService.removeListeners();

    if (!(await InstantCssService.hasPermissions())) return;

    chrome.webNavigation.onCommitted.addListener(
      InstantCssInjectorService.autoInjector,
      {
        url: APP_CONFIG["perplexity-ai"].globalMatches.map((match) => ({
          urlMatches: match,
        })),
      },
    );

    chrome.tabs.onRemoved.addListener(
      InstantCssInjectorService.tabRemovedHandler,
    );
  }

  static async removeListeners() {
    invariant(
      isBackgroundScript(),
      "This method is not allowed in content script",
    );

    if (!(await InstantCssService.hasPermissions())) return;

    chrome.webNavigation.onCommitted.removeListener(
      InstantCssInjectorService.autoInjector,
    );

    chrome.tabs.onRemoved.removeListener(
      InstantCssInjectorService.tabRemovedHandler,
    );
  }
}
