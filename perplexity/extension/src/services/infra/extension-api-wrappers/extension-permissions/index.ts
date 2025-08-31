export const backgroundProxyServiceName = "extensionPermissionsService";

export class ExtensionPermissionsService {
  static async getAll() {
    return chrome.permissions.getAll();
  }

  static async request(permissions: chrome.runtime.ManifestPermissions[]) {
    return chrome.permissions.request({ permissions });
  }

  static async remove(permissions: chrome.runtime.ManifestPermissions[]) {
    return chrome.permissions.remove({ permissions });
  }
}
