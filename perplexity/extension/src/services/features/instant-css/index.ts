import { APP_CONFIG } from "@/app.config";
import { getInstantCssInjectorProxyService } from "@/services/features/instant-css/injector/proxy";
import { getInstantCssStorageProxyService } from "@/services/features/instant-css/storage/proxy";
import type {
  InstantCss,
  InstantCssSettings,
} from "@/services/features/instant-css/types";
import {
  hasPermissions,
  hasPermissionsSync,
} from "@/services/infra/extension-permissions/utils";
import { invariant, isInContentScript } from "@/utils/utils";

export class InstantCssService {
  static async hasPermissions() {
    return (
      APP_CONFIG.BROWSER === "chrome" &&
      (await hasPermissions(["webNavigation"]))
    );
  }

  static hasPermissionsSync({
    grantedPermissions,
  }: {
    grantedPermissions: chrome.runtime.ManifestPermissions[];
  }) {
    return (
      APP_CONFIG.BROWSER === "chrome" &&
      hasPermissionsSync({
        requiredPermissions: ["webNavigation"],
        grantedPermissions,
      })
    );
  }

  static async registerInstantCss(
    params: InstantCss & { id: keyof InstantCssSettings; tabId: number },
  ) {
    invariant(
      isInContentScript(),
      "This method can only be called in content script",
    );

    await Promise.all([
      getInstantCssStorageProxyService().register({
        id: params.id,
        css: params.css,
        removeAfter: params.removeAfter,
        enabled: params.enabled,
      }),
      getInstantCssInjectorProxyService().injectCss({
        id: params.id,
        tabId: params.tabId,
        css: params.css,
        removeAfter: params.removeAfter,
        enabled: params.enabled,
      }),
    ]);
  }

  static async removeInstantCss(
    params: InstantCss & { id: keyof InstantCssSettings; tabId: number },
  ) {
    invariant(
      isInContentScript(),
      "This method can only be called in content script",
    );

    await Promise.all([
      getInstantCssStorageProxyService().unregister(params.id),
      getInstantCssInjectorProxyService().removeCss({
        tabId: params.tabId,
        css: params.css,
        removeAfter: params.removeAfter,
        enabled: params.enabled,
      }),
    ]);
  }
}
