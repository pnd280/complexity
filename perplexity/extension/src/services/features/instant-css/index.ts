import { APP_CONFIG } from "@/app.config";
import {
  hasPermissions,
  hasPermissionsSync,
} from "@/services/infra/extension-permissions/utils";

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
}
