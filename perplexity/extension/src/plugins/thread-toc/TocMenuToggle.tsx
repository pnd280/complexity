import React, { Activity } from "react";

import TablerMenu from "~icons/tabler/menu-2";

type TocMenuToggleProps = {
  top: number;
  isOpen: boolean;
  isFloating: boolean;
  onToggleOpen: () => void;
};

export function TocMenuToggle({
  top,
  isOpen,
  isFloating,
  onToggleOpen,
}: TocMenuToggleProps) {
  return (
    <Activity mode={isFloating && !isOpen ? "visible" : "hidden"}>
      <div
        role="button"
        id="thread-toc-menu-toggle"
        className={cn(
          "x:fixed x:top-(--panel-top) x:-right-3 x:z-20 x:flex x:h-16 x:w-8 x:items-center x:justify-center x:rounded-md x:border x:border-border/50 x:bg-secondary x:text-muted-foreground x:shadow-lg x:transition-colors x:animate-in x:fade-in x:hover:text-foreground",
        )}
        style={
          {
            ["--panel-top"]: `${top}px`,
          } as React.CSSProperties
        }
        onClick={onToggleOpen}
      >
        <TablerMenu className="x:size-4" />
      </div>
    </Activity>
  );
}
