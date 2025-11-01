import type React from "react";
import { Activity } from "react";

import { Portal } from "@/components/ui/portal";
import { useThreadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";
import TocItem from "@/plugins/thread-toc/TocItem";
import { PANEL_WIDTH } from "@/plugins/thread-toc/usePanelPosition";
import type { TocItem as TocItemType } from "@/plugins/thread-toc/useThreadTocItems";
import { scrollToElement } from "@/utils/dom-utils/generics";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/dom-utils/pplx-scrollbar-classes";

import TablerX from "~icons/tabler/x";

type TocPanelProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  left: number;
  isOpen: boolean;
  isFloating: boolean;
  tocItems: TocItemType[];
  onToggleClosed: () => void;
};

export function TocPanel({
  containerRef,
  left,
  isOpen,
  isFloating,
  tocItems,
  onToggleClosed,
}: TocPanelProps) {
  const threadWrapper = useThreadDomObserverStore(
    (store) => store.$wrapper?.[0],
    deepEqual,
  );

  return (
    <Portal container={threadWrapper}>
      <Activity mode={isFloating && !isOpen ? "hidden" : "visible"}>
        <div
          ref={containerRef}
          id="thread-toc-container"
          className={cn("x:absolute x:w-(--panel-width)", {
            "x:left-(--panel-left)": !isFloating,
            "x:right-4 x:rounded-md x:border x:border-border/50 x:bg-secondary x:shadow-lg x:md:right-8":
              isFloating,
          })}
          style={
            {
              ["--panel-width"]: `${PANEL_WIDTH}px`,
              ["--panel-left"]: !isFloating && `${left}px`,
            } as React.CSSProperties
          }
        >
          {isFloating && (
            <div
              className="x:absolute x:top-2 x:right-2 x:cursor-pointer x:rounded-full x:p-1 x:text-muted-foreground x:transition-colors x:hover:text-foreground"
              onClick={onToggleClosed}
            >
              <TablerX className="x:size-4" />
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
                    `${DomSelectorsService.Root.cplxAttribute(
                      DomSelectorsService.Root.internalAttributes.THREAD.MESSAGE
                        .BLOCK,
                    )}[data-index="${item.id}"]`,
                  );
                  if ($element.length) scrollToElement($element, 0, 300);
                }}
                onContextMenu={() => {
                  const $element = $(
                    `${DomSelectorsService.Root.cplxAttribute(
                      DomSelectorsService.Root.internalAttributes.THREAD.MESSAGE
                        .BLOCK,
                    )}[data-index="${item.id}"]`,
                  );
                  if ($element.length && $element.height() != null)
                    scrollToElement(
                      $element,
                      $element.height()! - window.innerHeight / 2,
                      300,
                    );
                }}
              />
            ))}
          </div>
        </div>
      </Activity>
    </Portal>
  );
}
