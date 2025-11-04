import { Activity } from "react";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { useThreadTocStore } from "@/plugins/thread-toc/store";

import TablerMenu2 from "~icons/tabler/menu-2";

export function TocMenuToggle() {
  const isOpen = useThreadTocStore((state) => state.isOpen);
  const setIsOpen = useThreadTocStore((state) => state.setIsOpen);
  const panelPosition = useThreadTocStore((state) => state.panelPosition);
  const isFloating = panelPosition?.isOverflowing;

  return (
    <Activity mode={isFloating ? "visible" : "hidden"}>
      <Tooltip content="Table of Contents">
        <Button
          className={cn(isOpen && "x:text-primary")}
          variant={isOpen ? "default" : "ghost"}
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <TablerMenu2 className="x:size-4" />
        </Button>
      </Tooltip>
    </Activity>
  );
}
