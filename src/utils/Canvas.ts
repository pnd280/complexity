import { canvasLangs } from "@/content-script/components/Canvas/langs";
import CplxUserSettings from "@/lib/CplxUserSettings";
import { isMainWorldContext } from "@/utils/utils";

export type CanvasLang = (typeof canvasLangs)[number]["trigger"];

export default class Canvas {
  static isActiveCanvasLang(lang: string): lang is CanvasLang {
    if (isMainWorldContext())
      return document.body.classList.contains("cplx-canvas");

    if (!CplxUserSettings.get().popupSettings.qolTweaks.canvas.enabled)
      return false;

    return canvasLangs.some((supported) => supported.trigger === lang);
  }

  static isCanvasLang(lang: string): lang is CanvasLang {
    return canvasLangs.some((supported) => supported.trigger === lang);
  }

  static isMaskableLang(lang: string): boolean {
    if (!Canvas.isActiveCanvasLang(lang)) return false;

    if (isMainWorldContext()) {
      return !!document.body
        .getAttribute("data-maskable-md-blocks")
        ?.split(" ")
        .includes(lang);
    }

    return !!CplxUserSettings.get().popupSettings.qolTweaks.canvas.mask[lang];
  }
}
