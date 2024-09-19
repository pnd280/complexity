import { canvasLangSettings } from "@/content-script/components/Canvas/langs";
import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import { isMainWorldContext } from "@/utils/utils";

export type CanvasLang = (typeof canvasLangSettings)[number]["trigger"];

export type CanvasLangSetting = {
  title: string;
  pplxSearch: string;
  trigger: string;
  description: string;
  actions?: {
    description: string;
    cta: string;
    action: () => Promise<void> | void;
  }[];
};

export default class Canvas {
  static isActiveCanvasLang(lang: string): lang is CanvasLang {
    if (isMainWorldContext())
      return document.body.classList.contains("cplx-canvas");

    if (!CplxUserSettings.get().generalSettings.qolTweaks.canvas.enabled)
      return false;

    return canvasLangSettings.some((supported) => supported.trigger === lang);
  }

  static isCanvasLang(lang: string): lang is CanvasLang {
    return canvasLangSettings.some((supported) => supported.trigger === lang);
  }

  static isMaskableLang(lang: string): boolean {
    if (!Canvas.isActiveCanvasLang(lang)) return false;

    if (isMainWorldContext()) {
      return !!document.body
        .getAttribute("data-maskable-md-blocks")
        ?.split(" ")
        .includes(lang);
    }

    return !!CplxUserSettings.get().generalSettings.qolTweaks.canvas.mask[lang];
  }
}

export const hasActions = (
  setting: CanvasLangSetting,
): setting is CanvasLangSetting & {
  actions: { name: string; action: () => void }[];
} => {
  return "actions" in setting;
};
