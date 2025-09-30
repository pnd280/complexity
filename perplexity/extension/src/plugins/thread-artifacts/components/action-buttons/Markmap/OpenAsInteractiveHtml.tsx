import { LuExternalLink } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { MarkmapRendererService } from "@/plugins/thread-artifacts/markmap-renderer/service/service-init";
import { useArtifactsStore } from "@/plugins/thread-artifacts/store";

export default function OpenAsInteractiveHtml() {
  const { selectedCodeBlockLocation } = useArtifactsStore();

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  if (!selectedCodeBlock) return null;

  return (
    <Tooltip content={t("plugin-artifacts.tooltip.viewAsInteractiveHtml")}>
      <Button
        variant="ghost"
        size="iconSm"
        onClick={async () => {
          if (!selectedCodeBlock.content.code) return;

          await MarkmapRendererService.Instance.openAsInteractiveHtml({
            content: selectedCodeBlock.content.code,
          });
        }}
      >
        <LuExternalLink className="x:size-4" />
      </Button>
    </Tooltip>
  );
}
