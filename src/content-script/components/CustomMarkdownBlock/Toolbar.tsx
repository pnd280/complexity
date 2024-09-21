
import { LuLoader2 as LoaderCircle } from "react-icons/lu";

import CanvasRenderButton from "@/content-script/components/CustomMarkdownBlock/CanvasRenderButton";
import CopyButton from "@/shared/components/CopyButton";
import Tooltip from "@/shared/components/Tooltip";
import Canvas from "@/utils/Canvas";
import { stripHtml } from "@/utils/utils";

type ToolbarProps = {
  lang: string;
  preBlockId: string;
};

export default function Toolbar({ lang, preBlockId }: ToolbarProps) {
  const $pre = $(`pre#${preBlockId}`);

  return (
    <div
      className={`tw-flex tw-items-center tw-border-b !tw-border-border tw-bg-secondary tw-p-2 tw-px-3 tw-font-sans ${preBlockId}-inflight-indicator tw-group`}
    >
      <div className="tw-font-mono tw-text-sm tw-font-medium tw-text-foreground">
        {lang || "text"}
      </div>
      <div className="tw-ml-auto tw-flex tw-gap-3">
        <div
          className={`tw-text-muted-foreground group-data-[inflight=false]:tw-hidden`}
        >
          <LoaderCircle className="tw-size-4 tw-animate-spin" />
        </div>

        {Canvas.isActiveCanvasLang(lang) && (
          <div className="tw-hidden group-data-[inflight=false]:tw-block">
            <Tooltip content="Render in canvas">
              <CanvasRenderButton preBlockId={preBlockId} />
            </Tooltip>
          </div>
        )}

        <CopyButton
          onCopy={() => {
            if ($pre.parents().eq(1).attr("id") === "markdown-query-wrapper") {
              navigator.clipboard.writeText(
                stripHtml($pre.find("code").text()),
              );
            } else {
              const $copyButton = $pre.parent().find("button");
              requestAnimationFrame(() => {
                $copyButton.addClass("!tw-hidden");
              });
              $copyButton.trigger("click");
            }
          }}
        />
      </div>
    </div>
  );
}
