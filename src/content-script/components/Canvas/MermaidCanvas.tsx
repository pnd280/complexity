import $ from "jquery";
import { RefreshCcw } from "lucide-react";
import { useCallback, useEffect } from "react";

import { mermaidContentScript } from "@/content-script/main-world/canvas/mermaid";
import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import { useCanvasStore } from "@/content-script/session-store/canvas";
import KeyCombo from "@/shared/components/KeyCombo";
import Tooltip from "@/shared/components/Tooltip";
import useCtrlDown from "@/shared/hooks/useCtrlDown";
import { CanvasLang } from "@/utils/Canvas";
import MarkdownBlockUtils from "@/utils/MarkdownBlock";
import { sleep } from "@/utils/utils";

export default function MermaidCanvas() {
  const { metaData, toggleShowCode } = useCanvasStore();

  const isCtrlDown = useCtrlDown();

  const render = useCallback(async () => {
    if (!metaData) return;

    toggleShowCode(false);

    const { preBlockId } = metaData;

    await mermaidContentScript.waitForInitialization();

    const $pre = $(`pre#${preBlockId}`);

    if ((MarkdownBlockUtils.getLang($pre) as CanvasLang) !== "mermaid") return;

    const code = await MarkdownBlockUtils.extractCodeFromPreReactNode($pre[0]);

    if (!code) {
      return;
    }

    const $wrapper = $("<div>")
      .attr("id", "mermaid-wrapper")
      .addClass("tw-size-full tw-opacity-0")
      .text(code);

    $("#complexity-canvas").empty().append($wrapper);

    await sleep(200);

    const rendered = await webpageMessenger.sendMessage({
      event: "mermaidCanvasAction",
      payload: {
        action: "render",
        payload: "#complexity-canvas #mermaid-wrapper",
      },
      timeout: 5000,
    });

    if (rendered)
      $wrapper.removeClass("tw-opacity-0").addClass("tw-animate-in tw-fade-in");
  }, [metaData, toggleShowCode]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className="tw-absolute tw-bottom-2 tw-right-2">
      <Tooltip
        content={
          <div className="tw-flex tw-items-center tw-gap-1">
            Reset pan/zoom. Hold <KeyCombo keys={["Ctrl"]} /> to re-render.
          </div>
        }
        className="!tw-bg-background !tw-text-foreground"
        positioning={{
          placement: "left",
          gutter: 10,
        }}
      >
        <div
          className="tw-cursor-pointer tw-rounded-md tw-p-2 tw-transition-all tw-duration-300 hover:tw-bg-background active:tw-scale-95"
          onClick={async () => {
            if (isCtrlDown) {
              await render();
            } else {
              await webpageMessenger.sendMessage({
                event: "mermaidCanvasAction",
                payload: {
                  action: "resetZoomPan",
                  payload: "#complexity-canvas #mermaid-wrapper",
                },
                timeout: 5000,
              });
            }
          }}
        >
          <RefreshCcw className="tw-size-4" />
        </div>
      </Tooltip>
    </div>
  );
}
