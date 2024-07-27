export type BackgroundAction = "openChangelog" | "openCustomTheme" | "getTabId";

export default class BackgroundScript {
  static async sendMessage({
    action,
    payload,
  }: {
    action: BackgroundAction;
    payload?: any;
  }) {
    return await chrome.runtime.sendMessage({ action, payload });
  }
}
