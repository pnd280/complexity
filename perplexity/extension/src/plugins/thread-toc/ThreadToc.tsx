import React from "react";
import { LuX } from "react-icons/lu";

import { useEvent } from "@/hooks/useEvent";
import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { useThreadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import FloatingToggle from "@/plugins/thread-toc/FloatingToggle";
import TocItem from "@/plugins/thread-toc/TocItem";
import { useHandleTouch } from "@/plugins/thread-toc/useHandleTouch";
import {
  PANEL_WIDTH,
  usePanelPosition,
} from "@/plugins/thread-toc/usePanelPosition";
import { useThreadTocItems } from "@/plugins/thread-toc/useThreadTocItems";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/pplx-scrollbar-classes";
import { scrollToElement } from "@/utils/utils";

export function ThreadToc() {
  const tocItems = useThreadTocItems();

  const threadWrapper = useThreadDomObserverStore(
    (store) => store.$wrapper?.[0],
    deepEqual,
  );

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useHandleTouch({
    containerRef,
    isOpen,
    setIsOpen,
  });

  const { position, isOverflowing } = usePanelPosition() ?? {};
  const { top, left } = position ?? {};

  const handleToggleOpen = useEvent(() => setIsOpen(true));
  const handleToggleClose = useEvent(() => setIsOpen(false));

  const shouldShowToc = tocItems.length > 1 && !!position;

  const isFloating = useMemo(() => {
    if (isOverflowing) return true;

    const activeTopMostId = tocItems.findIndex((item) => item.isActiveTopMost);
    const tabState = new URLSearchParams(window.location.search).get(
      activeTopMostId.toString(),
    );
    return tabState != null && !["d", "r", "t"].includes(tabState);
  }, [isOverflowing, tocItems]);

  if (!shouldShowToc || threadWrapper == null) return null;

  return (
    <>
      {isFloating && (
        <FloatingToggle isOpen={isOpen} onClick={handleToggleOpen} />
      )}
      <div
        ref={containerRef}
        id="thread-toc-container"
        className={cn("x:fixed x:top-(--panel-top)", "x:w-(--panel-width)", {
          "x:left-(--panel-left)": !isFloating,
          "x:right-3 x:rounded-md x:border x:border-border/50 x:bg-secondary x:shadow-lg x:md:right-8":
            isFloating,
          "x:hidden": isFloating && !isOpen,
        })}
        style={
          {
            ["--panel-width"]: `${PANEL_WIDTH}px`,
            ["--panel-top"]: top != null ? `${top}px` : undefined,
            ["--panel-left"]:
              !isFloating && left != null ? `${left}px` : undefined,
          } as React.CSSProperties
        }
      >
        {isFloating && (
          <div
            className="x:absolute x:top-2 x:right-2 x:cursor-pointer x:rounded-full x:p-1 x:text-muted-foreground x:transition-colors x:hover:text-foreground"
            onClick={handleToggleClose}
          >
            <LuX className="x:size-4" />
          </div>
        )}
        <div
          className={cn(
            PPLX_SCROLLBAR_CLASSES,
            "x:flex x:h-full x:flex-col x:gap-2 x:overflow-y-auto",
            {
              "x:max-h-[60vh] x:p-4": isFloating,
              "x:max-h-[80vh]": !isFloating,
            },
          )}
        >
          {tocItems.map((item, idx) => (
            <TocItem
              key={idx}
              item={item}
              onClick={() => {
                const $element = $(
                  `${getDomSelectorsRootService().cplxAttribute(
                    getDomSelectorsRootService().internalAttributes.THREAD
                      .MESSAGE.BLOCK,
                  )}[data-index="${item.id}"]`,
                );
                if ($element.length)
                  scrollToElement($element, 0, tocItems.length < 10 ? 300 : 0);
              }}
              onContextMenu={() => {
                const $element = $(
                  `${getDomSelectorsRootService().cplxAttribute(
                    getDomSelectorsRootService().internalAttributes.THREAD
                      .MESSAGE.BLOCK,
                  )}[data-index="${item.id}"]`,
                );
                if ($element.length && $element.height() != null)
                  scrollToElement(
                    $element,
                    $element.height()! - window.innerHeight / 2,
                    tocItems.length < 10 ? 300 : 0,
                  );
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
