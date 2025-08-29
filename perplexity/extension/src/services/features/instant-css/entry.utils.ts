import { getInstantCssInjectorService } from "@/services/features/instant-css/injector.proxy-service";
import { getInstantCssStorageService } from "@/services/features/instant-css/storage.proxy-service";
import type { InstantCss } from "@/services/features/instant-css/types";
import type { InstantCssSettings } from "@/services/features/instant-css/types";
import { invariant, isInContentScript } from "@/utils/utils";

export async function registerInstantCss(
  params: InstantCss & { id: keyof InstantCssSettings; tabId: number },
) {
  invariant(
    isInContentScript(),
    "This method can only be called in content script",
  );

  await Promise.all([
    getInstantCssStorageService().register({
      id: params.id,
      css: params.css,
      removeAfter: params.removeAfter,
      enabled: params.enabled,
    }),
    getInstantCssInjectorService().injectCss({
      id: params.id,
      tabId: params.tabId,
      css: params.css,
      removeAfter: params.removeAfter,
      enabled: params.enabled,
    }),
  ]);
}

export async function removeInstantCss(
  params: InstantCss & { id: keyof InstantCssSettings; tabId: number },
) {
  invariant(
    isInContentScript(),
    "This method can only be called in content script",
  );

  await Promise.all([
    getInstantCssStorageService().unregister(params.id),
    getInstantCssInjectorService().removeCss({
      tabId: params.tabId,
      css: params.css,
      removeAfter: params.removeAfter,
      enabled: params.enabled,
    }),
  ]);
}
