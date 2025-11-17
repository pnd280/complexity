import { APP_CONFIG } from "@/app.config";
import {
  hasPermissions,
  hasPermissionsSync,
} from "@/entrypoints/services/extension-api-wrappers/permissions/utils";
import { InstantCssInjectorService } from "@/entrypoints/services/features/instant-css/injector/service-init.bg-worker";
import { InstantCssStorageService } from "@/entrypoints/services/features/instant-css/storage/service-init.bg-worker";
import type {
  InstantCss,
  InstantCssSettings,
} from "@/entrypoints/services/features/instant-css/types";
import { Logger } from "@/utils/misc/context-logger";
import { invariant, isInContentScript } from "@/utils/misc/utils";

export class InstantCssService {
  static logger = new Logger("InstantCssService");

  static async hasPermissions() {
    return (
      APP_CONFIG.BROWSER === "chrome" &&
      (await hasPermissions(["webNavigation"]))
    );
  }

  static hasPermissionsSync({
    grantedPermissions,
  }: {
    grantedPermissions: chrome.runtime.ManifestPermission[];
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
      InstantCssStorageService.Instance.register({
        id: params.id,
        css: params.css,
        removeAfter: params.removeAfter,
        enabled: params.enabled,
      }),
      InstantCssInjectorService.Instance.injectCss({
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
      InstantCssStorageService.Instance.unregister(params.id),
      InstantCssInjectorService.Instance.removeCss({
        tabId: params.tabId,
        css: params.css,
        removeAfter: params.removeAfter,
        enabled: params.enabled,
      }),
    ]);
  }
}
