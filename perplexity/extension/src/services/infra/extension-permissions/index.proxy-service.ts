import { defineProxyService } from "@webext-core/proxy-service";

export class ExtensionPermissions {
  static getAll() {
    return chrome.permissions.getAll();
  }

  static request(permissions: chrome.runtime.ManifestPermissions[]) {
    return chrome.permissions.request({ permissions });
  }

  static remove(permissions: chrome.runtime.ManifestPermissions[]) {
    return chrome.permissions.remove({ permissions });
  }
}

export const [registerService, getExtensionPermissionsService] =
  defineProxyService("ExtensionPermissionsService", () => ExtensionPermissions);
