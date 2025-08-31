import { LuDownload } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { getMarkmapRendererService } from "@/plugins/_core/main-world/markmap-renderer/service/get-service";
import { useArtifactsStore } from "@/plugins/artifacts/store";
import {
  formatArtifactTitle,
  getArtifactTitle,
} from "@/plugins/artifacts/utils";

export default function DownloadAsInteractiveHtml() {
  const { selectedCodeBlockLocation } = useArtifactsStore();

  const selectedCodeBlock = useThreadCodeBlock({
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
  });

  return (
    <Tooltip content={t("plugin-artifacts.tooltip.downloadAsInteractiveHtml")}>
      <Button
        variant="ghost"
        size="iconSm"
        onClick={async () => {
          if (
            !selectedCodeBlock?.content.code ||
            !selectedCodeBlock.content.language
          )
            return;

          const title =
            formatArtifactTitle(
              getArtifactTitle(selectedCodeBlock.content.language),
            ) || "mindmap";

          await getMarkmapRendererService().downloadAsInteractiveHtml({
            content: selectedCodeBlock.content.code,
            title,
          });
        }}
      >
        <LuDownload className="x:size-4" />
      </Button>
    </Tooltip>
  );
}
