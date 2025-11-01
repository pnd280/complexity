import { Activity } from "react";

import { Portal } from "@/components/ui/portal";
import { useThreadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";

import TablerMenuDeep from "~icons/tabler/menu-deep";

type TocMenuToggleProps = {
  isOpen: boolean;
  isFloating: boolean;
  onToggleOpen: () => void;
};

export function TocMenuToggle({
  isOpen,
  isFloating,
  onToggleOpen,
}: TocMenuToggleProps) {
  const threadWrapper = useThreadDomObserverStore(
    (store) => store.$wrapper?.[0],
    deepEqual,
  );

  return (
    <Portal container={threadWrapper}>
      <Activity mode={isFloating && !isOpen ? "visible" : "hidden"}>
        <div
          role="button"
          id="thread-toc-menu-toggle"
          className={cn(
            "x:absolute x:right-0 x:z-20 x:flex x:text-muted-foreground x:opacity-30 x:transition-colors x:animate-in x:fade-in x:hover:text-foreground x:hover:opacity-100 x:md:right-4",
          )}
          onClick={onToggleOpen}
        >
          <TablerMenuDeep className="x:size-8" />
        </div>
      </Activity>
    </Portal>
  );
}
