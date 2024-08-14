import $ from "jquery";

import CplxUserSettings from "@/lib/CplxUserSettings";
import UiUtils from "@/utils/UiUtils";
import { jsonUtils, whereAmI } from "@/utils/utils";

export default class UiTweaks {
  static injectCustomStyles() {
    $(document.body).addClass("!tw-mr-0");

    const { customCSS, accentColor, monoFont, uiFont } =
      CplxUserSettings.get().customTheme;

    if ($("#complexity-custom-styles").length) {
      $("#complexity-custom-styles").text(jsonUtils.safeParse(customCSS || ""));
      return;
    }

    $("<style>")
      .attr({
        id: "complexity-custom-styles",
      })
      .text(jsonUtils.safeParse(customCSS || ""))
      .appendTo("head");

    type CustomTheme = {
      "--ui-font"?: string;
      "--mono-font"?: string;
      "--accent-foreground"?: string;
      "--accent-foreground-darker"?: string;
      "--ring"?: string;
      "--ring-darker"?: string;
      "--selection"?: string;
    };

    const css: CustomTheme = {
      "--ui-font": uiFont,
      "--mono-font": monoFont,
      "--accent-foreground": accentColor,
      "--accent-foreground-darker": `${accentColor}80`,
      "--ring": accentColor,
      "--ring-darker": `${accentColor}80`,
      "--selection": `${accentColor}60`,
    };

    if (!uiFont) delete css["--ui-font"];
    if (!monoFont) delete css["--mono-font"];
    if (!accentColor) {
      delete css["--accent-foreground"];
      delete css["--accent-foreground-darker"];
      delete css["--ring"];
      delete css["--ring-darker"];
      delete css["--selection"];
    }

    $(document.body).css(css);
  }

  static correctColorScheme() {
    $(() => {
      // cloudflare
      if (document.title === "Just a moment...") {
        $("html").addClass("dark tw-dark");
      }

      const darkTheme = UiUtils.isDarkTheme();

      if (darkTheme) $("html").addClass("dark tw-dark");

      // downtime page
      if (document.title === "We'll be right back") {
        $("html").addClass("dark tw-dark");
        $("h1").addClass("!tw-text-[4rem]");
        $("p.message").addClass("tw-font-sans");
      }
    });
  }

  static async applySettingsAsHTMLAttrs(location: ReturnType<typeof whereAmI>) {
    const settings = CplxUserSettings.get().popupSettings;

    $(document.body)
      .toggleClass(
        "alter-attach-button",
        settings.queryBoxSelectors.focus ||
          settings.queryBoxSelectors.collection,
      )
      .toggleClass(
        "collapse-empty-thread-visual-columns",
        settings.visualTweaks.collapseEmptyThreadVisualColumns &&
          location === "thread",
      )
      .toggleClass(
        "alternate-markdown-block",
        settings.qolTweaks.alternateMarkdownBlock && location === "thread",
      )
      .toggleClass(
        "thread-message-sticky-toolbar",
        settings.qolTweaks.threadMessageStickyToolbar && location === "thread",
      )
      .toggleClass(
        "cplx-canvas",
        settings.qolTweaks.alternateMarkdownBlock &&
          settings.qolTweaks.canvas.enabled,
      );

    (function setMaskableMarkdownBlocks() {
      if ($(document.body).attr("data-maskable-md-blocks")) return;

      const maskableLangs = settings.qolTweaks.canvas.mask;

      const dataString = Object.entries(maskableLangs)
        .filter(([, maskable]) => maskable)
        .map(([lang]) => lang)
        .join(" ");

      if (dataString) {
        $(document.body).attr(`data-maskable-md-blocks`, dataString);
      }
    })();
  }

  static async applySelectableAttrs(location: ReturnType<typeof whereAmI>) {
    if (location !== "thread") return;

    UiUtils.getMessageBlocks();
  }
}
