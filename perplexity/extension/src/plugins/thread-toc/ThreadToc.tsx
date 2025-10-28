import React from "react";

import { useThreadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import { TocMenuToggle } from "@/plugins/thread-toc/TocMenuToggle";
import { TocPanel } from "@/plugins/thread-toc/TocPanel";
import { useHandleTouch } from "@/plugins/thread-toc/useHandleTouch";
import { usePanelPosition } from "@/plugins/thread-toc/usePanelPosition";
import { useThreadTocItems } from "@/plugins/thread-toc/useThreadTocItems";

export function ThreadToc() {
  const [isOpen, setIsOpen] = useState(false);

  const threadWrapper = useThreadDomObserverStore(
    (store) => store.$wrapper?.[0],
    deepEqual,
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  const tocItems = useThreadTocItems();

  const panelPosition = usePanelPosition({
    tocItems,
  });

  useHandleTouch({
    containerRef,
    isOpen,
    setIsOpen,
  });

  const shouldShowToc = tocItems.length > 1 && panelPosition != null;

  if (!shouldShowToc || threadWrapper == null) return null;

  return (
    <>
      <TocMenuToggle
        top={panelPosition.position.top}
        isOpen={isOpen}
        isFloating={panelPosition.isOverflowing}
        onToggleOpen={() => setIsOpen(true)}
      />
      <TocPanel
        containerRef={containerRef}
        top={panelPosition.position.top}
        left={panelPosition.position.left}
        isOpen={isOpen}
        isFloating={panelPosition.isOverflowing}
        tocItems={tocItems}
        onToggleClosed={() => setIsOpen(false)}
      />
    </>
  );
}
