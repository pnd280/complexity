import { Button } from "@/components/ui/button";
import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useArtifactsStore } from "@/plugins/thread-artifacts/store";
import { generatePlantUMLUrl } from "@/plugins/thread-artifacts/utils/plant-uml";

import TablerExternalLink from "~icons/tabler/external-link";

export default function PlantUmlArtifactsActionButtonsWrapper() {
  const selectedCodeBlockLocation = useArtifactsStore(
    (store) => store.selection.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  if (!selectedCodeBlock) return null;

  return (
    <Button
      variant="ghost"
      size="iconSm"
      onClick={() => {
        const code = selectedCodeBlock.content.code;
        if (!code) return;
        const url = generatePlantUMLUrl(code);
        if (!url) return;
        window.open(url, "_blank");
      }}
    >
      <TablerExternalLink className="x:size-4" />
    </Button>
  );
}
