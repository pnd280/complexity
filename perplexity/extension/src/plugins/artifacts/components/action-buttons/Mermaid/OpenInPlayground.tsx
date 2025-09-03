import { LuExternalLink } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { getMermaidRendererService } from "@/plugins/_core/main-world/mermaid-renderer/service/service-init";
import { useArtifactsStore } from "@/plugins/artifacts/store";

export default function MermaidOpenInPlayground() {
  const { selectedCodeBlockLocation } = useArtifactsStore();

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  if (!selectedCodeBlock) return null;

  return (
    <Tooltip content={t("plugin-artifacts.tooltip.openInMermaid")}>
      <Button
        variant="ghost"
        size="iconSm"
        onClick={async () => {
          if (!selectedCodeBlock.content.code) return;

          const url = await getMermaidRendererService().getPlaygroundUrl(
            selectedCodeBlock.content.code,
          );

          if (!url) {
            return toast({
              title: t("plugin-artifacts.error.previewUrl"),
            });
          }

          window.open(url, "_blank");
        }}
      >
        <LuExternalLink className="x:size-4" />
      </Button>
    </Tooltip>
  );
}
