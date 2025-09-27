import { APP_CONFIG } from "@/app.config";
import { instantCssCoordinator } from "@/services/features/instant-css/coordinator";
import type {
  InstantCss,
  InstantCssSettings,
} from "@/services/features/instant-css/types";
import { getProcessedCssEntries } from "@/services/features/instant-css/utils";
import { hasPermissions } from "@/services/infra/extension-api-wrappers/extension-permissions/utils";
import { invariant, isBackgroundScript } from "@/utils/misc/utils";

export { backgroundProxyServiceName } from "@/services/features/instant-css/injector/constants";

export class InstantCssInjectorServiceImpl {
  private static async hasPermissions() {
    return (
      APP_CONFIG.BROWSER === "chrome" &&
      (await hasPermissions(["webNavigation"]))
    );
  }

  static async injectCssToTab(tabId: number) {
    instantCssCoordinator.resetTab(tabId);

    await instantCssCoordinator.forceCleanup().catch((error) => {
      console.error("Failed to clean up tabs during injection:", error);
    });

    try {
      const entries = await getProcessedCssEntries();

      for (const { id, css, removeAfter, enabled } of entries) {
        InstantCssInjectorServiceImpl.injectCss({
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

    await InstantCssInjectorServiceImpl.injectCssToTab(details.tabId);
  };

  static async forceInjectAllPplxTabs() {
    const tabs = await chrome.tabs.query({
      url: APP_CONFIG["perplexity-ai"].globalMatches,
    });

    for (const tab of tabs) {
      if (tab.id == null) continue;
      await InstantCssInjectorServiceImpl.injectCssToTab(tab.id);
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

    InstantCssInjectorServiceImpl.removeListeners();

    if (!(await InstantCssInjectorServiceImpl.hasPermissions())) return;

    chrome.webNavigation.onCommitted.addListener(
      InstantCssInjectorServiceImpl.autoInjector,
      {
        url: APP_CONFIG["perplexity-ai"].globalMatches.map((match) => ({
          urlMatches: match,
        })),
      },
    );

    chrome.tabs.onRemoved.addListener(
      InstantCssInjectorServiceImpl.tabRemovedHandler,
    );
  }

  static async removeListeners() {
    invariant(
      isBackgroundScript(),
      "This method is not allowed in content script",
    );

    if (!(await InstantCssInjectorServiceImpl.hasPermissions())) return;

    chrome.webNavigation.onCommitted.removeListener(
      InstantCssInjectorServiceImpl.autoInjector,
    );

    chrome.tabs.onRemoved.removeListener(
      InstantCssInjectorServiceImpl.tabRemovedHandler,
    );
  }
}

export type InstantCssInjectorService = typeof InstantCssInjectorServiceImpl;
