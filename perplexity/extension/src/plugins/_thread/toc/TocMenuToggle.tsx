import { useLocalStorage } from "@uidotdev/usehooks";
import { Activity } from "react";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import type manifest from "@/plugins/_thread/toc/index.manifest";
import { useThreadTocStore } from "@/plugins/_thread/toc/store";

import TablerAlignLeft from "~icons/tabler/align-left";

export function TocMenuToggle() {
  const isOpen = useThreadTocStore((store) => store.isOpen);
  const setIsOpen = useThreadTocStore((store) => store.setIsOpen);
  const panelPosition = useThreadTocStore((store) => store.panelPosition);
  const isFloating = panelPosition?.isOverflowing;

  const [newPosImpressionShowed, setNewPosImpressionShowed] = useLocalStorage(
    "cplx.plugin:thread:toc:newToggleImpressionShowed" satisfies `cplx.plugin:${typeof manifest.meta.id}:${string}`,
    false,
  );

  return (
    <Activity mode={isFloating ? "visible" : "hidden"}>
      <Tooltip
        content="Table of Contents"
        defaultOpen={!newPosImpressionShowed}
        onOpenChange={() => {
          setNewPosImpressionShowed(true);
        }}
      >
        <Button
          className={cn(isOpen && "x:text-primary")}
          variant={isOpen || !newPosImpressionShowed ? "default" : "ghost"}
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <TablerAlignLeft className="x:size-4" />
        </Button>
      </Tooltip>
    </Activity>
  );
}
