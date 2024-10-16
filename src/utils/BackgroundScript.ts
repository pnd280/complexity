import appConfig from "@/app.config";

export type BackgroundActionSchema = {
  openExtensionPage: string;
  openChangelog: void;
  openCustomTheme: void;
  getTabId: void;
};

export type BackgroundScriptMessage = {
  [K in keyof BackgroundActionSchema]: BackgroundActionSchema[K] extends void
    ? { action: K }
    : {
        action: K;
        payload: BackgroundActionSchema[K];
      };
}[keyof BackgroundActionSchema];

export default class BackgroundScript {
  static async sendMessage(message: BackgroundScriptMessage) {
    return await browser.runtime.sendMessage(message);
  }

  static getOptionsPageUrl() {
    const prefix = appConfig.IS_DEV ? "src/options-page/" : "";

    return browser.runtime.getURL(`${prefix}options.html`);
  }
}
