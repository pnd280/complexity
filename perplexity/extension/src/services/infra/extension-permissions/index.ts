export const backgroundProxyServiceName = "extensionPermissionsService";

export class ExtensionPermissionsService {
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
