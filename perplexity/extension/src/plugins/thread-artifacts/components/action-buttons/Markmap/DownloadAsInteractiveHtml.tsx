import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { MarkmapRendererService } from "@/plugins/thread-artifacts/markmap-renderer/service/service-init";
import { useArtifactsStore } from "@/plugins/thread-artifacts/store";
import {
  formatArtifactTitle,
  getArtifactTitle,
} from "@/plugins/thread-artifacts/utils";

import TablerDownload from "~icons/tabler/download";

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

          await MarkmapRendererService.Instance.downloadAsInteractiveHtml({
            content: selectedCodeBlock.content.code,
            title,
          });
        }}
      >
        <TablerDownload className="x:size-4" />
      </Button>
    </Tooltip>
  );
}
