import $ from "jquery";

import WebpageMessageListeners from "@/content-script/main-world/listeners";
import WebpageMessageInterceptor from "@/content-script/main-world/WebpageMessageInterceptors";
import DOMObserver from "@/utils/DOMObserver";
import UITweaks from "@/utils/UITweaks";
import {
  getPPLXBuildId,
  injectMainWorldScript,
  waitForNextjsHydration,
  whereAmI,
} from "@/utils/utils";

import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import ReactRoot from "@/content-script/ReactRoot";

import wsHook from "@/content-script/main-world/ws-hook?script&module";
import nextRouter from "@/content-script/main-world/next-router?script&module";
import preBlockAttrs from "@/content-script/main-world/pre-block-attrs?script&module";
import reactNode from "@/content-script/main-world/react-node?script&module";
import shiki from "@/content-script/main-world/shiki?script&module";
import mermaidCanvas from "@/content-script/main-world/canvas/mermaid?script&module";
import htmlCanvas from "@/content-script/main-world/canvas/html?script&module";
import { popupSettingsStore } from "./session-store/popup-settings";

import packageData from "../../package.json";

$(async function main() {
  initConsoleMessage();

  initUITweaks();

  await waitForNextjsHydration();

  await initDependencies();

  initTrafficInterceptors();

  ReactRoot();

  if (import.meta.env.DEV) {
    $(document).on("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "Q") {
        DOMObserver.destroyAll();
        alert("All observers destroyed!");
      }
    });
  }
});

async function initUITweaks() {
  UITweaks.correctColorScheme();
  UITweaks.injectCustomStyles();

  const observe = async (url: string) => {
    const location = whereAmI(url);

    UITweaks.applySelectableAttrs(location);
    UITweaks.applySettingsAsHTMLAttrs(location);
  };

  observe(window.location.href);

  webpageMessenger.onMessage(
    "routeChange",
    async ({ payload: { url, trigger } }) => {
      if (trigger !== "routeChangeComplete") return;
      observe(url);
    },
  );
}

async function initDependencies() {
  const settings = popupSettingsStore.getState();

  await Promise.all([
    injectMainWorldScript(chrome.runtime.getURL(wsHook)),
    injectMainWorldScript(chrome.runtime.getURL(nextRouter)),
    injectMainWorldScript(chrome.runtime.getURL(preBlockAttrs)),
    injectMainWorldScript(chrome.runtime.getURL(reactNode)),
    injectMainWorldScript(
      chrome.runtime.getURL(shiki),
      settings.qolTweaks.alternateMarkdownBlock,
    ),
    injectMainWorldScript(
      chrome.runtime.getURL(mermaidCanvas),
      settings.qolTweaks.alternateMarkdownBlock &&
        settings.qolTweaks.canvas.enabled,
    ),
    injectMainWorldScript(
      chrome.runtime.getURL(htmlCanvas),
      settings.qolTweaks.alternateMarkdownBlock &&
        settings.qolTweaks.canvas.enabled,
    ),
  ]);
}

function initTrafficInterceptors() {
  WebpageMessageListeners.onWebSocketCaptured();

  WebpageMessageInterceptor.updateQueryLimits();
  WebpageMessageInterceptor.alterQueries();
  WebpageMessageInterceptor.blockTelemetry();
  WebpageMessageInterceptor.removeComplexityIdentifier();
}

async function initConsoleMessage() {
  const pplxBuildId = await getPPLXBuildId();

  console.log(
    "%cCOMPLEXITY v" +
      packageData.version +
      "%c\n\n" +
      "Suggest new features/report issues by joining the Discord community:\n" +
      "%chttps://discord.gg/fxzqdkwmWx%c\n\n" +
      "PPLX_BUILD_ID: " +
      pplxBuildId,
    "color: #72aefd; background-color: #191a1a; padding: 0.25rem 1rem; border-radius: 0.375rem; font-family: monospace; font-weight: bold; font-size: 16px; text-shadow: 1px 1px 0 #000;",
    "color: #ff9900; font-style: italic; font-size: 14px;",
    "font-size: 14px;",
    "font-weight: bold; font-size: 14px;",
  );
}
