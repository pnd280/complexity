export type BackgroundAction =
  | "openExtensionPage"
  | "openChangelog"
  | "openCustomTheme"
  | "getTabId";

export default class BackgroundScript {
  static async sendMessage<T>({
    action,
    payload,
  }: {
    action: BackgroundAction;
    payload?: T;
  }) {
    return await chrome.runtime.sendMessage({ action, payload });
  }
}
