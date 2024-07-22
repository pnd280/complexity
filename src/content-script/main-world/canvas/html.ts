import $ from "jquery";

import { mainWorldExec } from "@/utils/hof";
import UIUtils from "@/utils/UI";

import { webpageMessenger } from "../webpage-messenger";

type RenderAction = {
  action: "render";
  payload: string;
};

type PopoutAction = {
  action: "popOut";
  payload: "_blank" | "PopupWindow";
};

export type HTMLCanvasAction = RenderAction | PopoutAction;

class HTMLCanvas {
  private static instance: HTMLCanvas;

  blobUrl: string | null = null;

  $lastFocusedElement: JQuery<Element> | null = null;

  private constructor() {}

  static getInstance() {
    if (!HTMLCanvas.instance) {
      HTMLCanvas.instance = new HTMLCanvas();
    }
    return HTMLCanvas.instance;
  }

  initialize() {
    this.setupContentScriptRequestListeners();
  }

  private setupContentScriptRequestListeners() {
    webpageMessenger.onMessage(
      "htmlCanvasAction",
      async ({ payload: { action, payload } }) => {
        switch (action) {
          case "render":
            return this.handleRenderAction(payload);
          case "popOut":
            if (!this.blobUrl) return false;
            window.open(
              this.blobUrl,
              payload,
              payload === "PopupWindow" ? "width=600,height=600" : "",
            );
            return true;
          default:
            console.log("Unknown action:", action);
            return false;
        }
      },
    );
  }

  private async handleRenderAction(rawHTML: string) {
    try {
      return await new Promise<boolean>((resolve) => {
        const blob = new Blob([rawHTML], { type: "text/html" });
        this.blobUrl = URL.createObjectURL(blob);

        const $iframe = $("<iframe>")
          .attr({ id: "html-wrapper", src: this.blobUrl })
          .addClass("tw-size-full tw-animate-in tw-fade-in");

        $iframe
          .on("mouseenter", () => {
            if (document.activeElement)
              this.$lastFocusedElement = $(document.activeElement);

            UIUtils.getActiveQueryBoxTextarea({ type: "follow-up" }).prop(
              "disabled",
              true,
            );

            $("#canvas-panel").addClass("tw-ring tw-ring-accent-foreground");
          })
          .on("mouseleave", () => {
            UIUtils.getActiveQueryBoxTextarea({ type: "follow-up" }).prop(
              "disabled",
              false,
            );

            $("#canvas-panel").removeClass("tw-ring tw-ring-accent-foreground");

            if (this.$lastFocusedElement) {
              this.$lastFocusedElement.trigger("focus");
              this.$lastFocusedElement = null;
            }
          });

        $("#complexity-canvas").empty().append($iframe);

        resolve(true);
      });
    } catch (error) {
      console.error("Error rendering HTML canvas:", error);
      return false;
    }
  }
}

mainWorldExec(() =>
  $(() => {
    HTMLCanvas.getInstance().initialize();
  }),
)();
