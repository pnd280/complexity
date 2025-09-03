export const mainWorldProxyServiceName = "spaRouterService";

export class SpaRouterServiceImpl {
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

export type SpaRouterService = typeof SpaRouterServiceImpl;
