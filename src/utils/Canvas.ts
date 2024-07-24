import { canvasLangs } from "@/content-script/components/Canvas/langs";
import CPLXUserSettings from "@/lib/CPLXUserSettings";

import { isMainWorldContext } from "./utils";

export type CanvasLang = (typeof canvasLangs)[number]["trigger"];

export default class Canvas {
  static isCanvasLang(lang: string): lang is CanvasLang {
    if (isMainWorldContext())
      return document.body.classList.contains("cplx-canvas");

    if (!CPLXUserSettings.get().popupSettings.qolTweaks.canvas.enabled)
      return false;

    return canvasLangs.some((supported) => supported.trigger === lang);
  }

  static isMaskableLang(lang: string): boolean {
    if (!Canvas.isCanvasLang(lang)) return false;

    if (isMainWorldContext()) {
      return !!document.body
        .getAttribute("data-maskable-md-blocks")
        ?.split(" ")
        .includes(lang);
    }

    return !!CPLXUserSettings.get().popupSettings.qolTweaks.canvas.mask[lang];
  }
}
