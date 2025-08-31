export const mainWorldProxyServiceName = "spaRouterService";

export class SpaRouterService {
  static push(url: string) {
    window.history.pushState({}, "", url);
  }

  static replace(url: string) {
    window.history.replaceState({}, "", url);
  }

  static openInNewTab(url: string) {
    window.open(url, "_blank");
  }
}
