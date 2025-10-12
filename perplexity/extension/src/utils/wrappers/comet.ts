/* eslint-disable @typescript-eslint/no-explicit-any */

import { APP_CONFIG } from "@/app.config";
import { ContentScriptBgUtilsService } from "@/services/features/content-script-utils/service-init.bg-worker";
import { whereAmI } from "@/utils/misc/utils";
import { errorWrapper } from "@/utils/wrappers/error-wrapper";

export function isCometBrowserSync(): boolean {
  if (APP_CONFIG.BROWSER !== "chrome") return false;
  if ((globalThis as any).isCometBrowser != null)
    return (globalThis as any).isCometBrowser as boolean;
  return false;
}

export async function isCometBrowser(): Promise<boolean> {
  if (APP_CONFIG.BROWSER !== "chrome") return false;

  const currentTabId = (await chrome.tabs.getCurrent())?.id;

  if (currentTabId == null) return false;

  const sidecarTabId =
    await ContentScriptBgUtilsService.Instance.cometGetSidecarTabId({
      currentTabId,
    });

  return sidecarTabId != null;
}

export function isCsInjectableSync(): boolean | null {
  if ((globalThis as any).isCsInjectable != null)
    return (globalThis as any).isCsInjectable as boolean;
  return null;
}

export async function isCsInjectable(): Promise<boolean | null> {
  const tabs = await chrome.tabs.query({});

  for (const tab of tabs) {
    if (tab.id == null || tab.url == null || tab.url.length === 0) continue;

    if (whereAmI(tab.url) === "unknown") continue;

    const [, error] = await errorWrapper(
      async () =>
        await chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          func: () => {},
        }),
    )();

    if (error) {
      return false;
    }

    return true;
  }

  return null;
}
