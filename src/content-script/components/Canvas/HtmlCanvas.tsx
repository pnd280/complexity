import $ from "jquery";
import { ExternalLink } from "lucide-react";
import { useCallback, useEffect } from "react";

import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import { useCanvasStore } from "@/content-script/session-store/canvas";
import KeyCombo from "@/shared/components/KeyCombo";
import Tooltip from "@/shared/components/Tooltip";
import useCtrlDown from "@/shared/hooks/useCtrlDown";
import { CanvasLang } from "@/utils/Canvas";
import MarkdownBlockUtils from "@/utils/MarkdownBlock";

export default function HtmlCanvas() {
  const { metaData, toggleShowCode } = useCanvasStore();

  const isCtrlDown = useCtrlDown();

  const render = useCallback(async () => {
    if (!metaData) return;

    toggleShowCode(false);

    const { preBlockId } = metaData;

    const $pre = $(`#${preBlockId}`);

    if ((MarkdownBlockUtils.getLang($pre) as CanvasLang) !== "html") return;

    const code = await MarkdownBlockUtils.extractCodeFromPreReactNode($pre[0]);

    if (!code) return;

    webpageMessenger.sendMessage({
      event: "htmlCanvasAction",
      payload: {
        action: "render",
        payload: code,
      },
    });
  }, [metaData, toggleShowCode]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className="tw-absolute tw-bottom-2 tw-right-2">
      <Tooltip
        content={
          <div className="tw-flex tw-items-center tw-gap-1">
            Open in new tab. Hold <KeyCombo keys={["Ctrl"]} /> to open in a
            popup.
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
          onClick={() => {
            webpageMessenger.sendMessage({
              event: "htmlCanvasAction",
              payload: {
                action: "popOut",
                payload: isCtrlDown ? "PopupWindow" : "_blank",
              },
            });
          }}
        >
          <ExternalLink className="tw-size-4" />
        </div>
      </Tooltip>
    </div>
  );
}
