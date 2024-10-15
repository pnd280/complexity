import "@/assets/index.tw.css";
import "@/assets/overrides.css";
import "@/assets/components.css";
import "@/assets/canvas.css";

import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import WebpageMessageInterceptor from "@/content-script/main-world/WebpageMessageInterceptors";
import ReactRoot from "@/content-script/ReactRoot";
import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import UiTweaks from "@/utils/UiTweaks";
import {
  injectMainWorldScript,
  waitForHydration,
  whereAmI,
} from "@/utils/utils";
import UxTweaks from "@/utils/UxTweaks";
import packageData from "~/package.json";

import htmlCanvas from "@/content-script/main-world/canvas/html?script&module";
import mermaidCanvas from "@/content-script/main-world/canvas/mermaid?script&module";
import preBlockAttrs from "@/content-script/main-world/pre-block-attrs?script&module";
import shiki from "@/content-script/main-world/shiki?script&module";

$(async function main() {
  initConsoleMessage();

  await Promise.all([initCplxUserSettings(), waitForHydration()]);
  initUiUxTweaks();
  initTrafficInterceptors();
  await initMainWorldDeps();

  ReactRoot();
});

async function initCplxUserSettings() {
  await CplxUserSettings.init();
}

function initUiUxTweaks() {
  UiTweaks.injectCustomStyles();
  UiTweaks.forceUSInterface();
  UiTweaks.correctColorScheme();

  UxTweaks.restoreLogoContextMenu();

  const observe = (url: string) => {
    const location = whereAmI(url);

    UiTweaks.applySelectableAttrs(location);
    UiTweaks.applySettingsAsHTMLAttrs(location);

    UxTweaks.dropFileWithinThread(location);
  };

  observe(window.location.href);

  webpageMessenger.onMessage("routeChange", async ({ payload: { url } }) => {
    observe(url);
  });
}

async function initMainWorldDeps() {
  const { qolTweaks } = CplxUserSettings.get().generalSettings;

  await Promise.all([
    injectMainWorldScript({
      url: browser.runtime.getURL(preBlockAttrs),
    }),
    injectMainWorldScript({
      url: browser.runtime.getURL(shiki),
      inject: qolTweaks.customMarkdownBlock,
    }),
    injectMainWorldScript({
      url: browser.runtime.getURL(mermaidCanvas),
      inject: qolTweaks.customMarkdownBlock && qolTweaks.canvas.enabled,
    }),
    injectMainWorldScript({
      url: browser.runtime.getURL(htmlCanvas),
      inject: qolTweaks.customMarkdownBlock && qolTweaks.canvas.enabled,
    }),
  ]);
}

function initTrafficInterceptors() {
  WebpageMessageInterceptor.updateQueryLimits();
  WebpageMessageInterceptor.alterQueries();
  WebpageMessageInterceptor.blockTelemetry();
  WebpageMessageInterceptor.removeComplexityIdentifier();
}

function initConsoleMessage() {
  console.log(
    "%cCOMPLEXITY v" +
      packageData.version +
      "%c\n\n" +
      "Suggest new features/report issues by joining the Discord community:\n" +
      "%chttps://discord.gg/fxzqdkwmWx%c",
    "color: #72aefd; background-color: #191a1a; padding: 0.25rem 1rem; border-radius: 0.375rem; font-family: monospace; font-weight: bold; font-size: 16px; text-shadow: 1px 1px 0 #000;",
    "color: #ff9900; font-style: italic; font-size: 14px;",
    "font-size: 14px;",
    "font-weight: bold; font-size: 14px;",
  );
}
