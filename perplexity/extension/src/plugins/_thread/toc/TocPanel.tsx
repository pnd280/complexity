import { Activity } from "react";

import { Portal } from "@/components/ui/portal";
import { useThreadDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/store";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";
import { useInsertCss } from "@/hooks/useInsertCss";
import { threadTocCssResourceConfig } from "@/plugins/_thread/toc/index.remote-resources";
import { useThreadTocStore } from "@/plugins/_thread/toc/store";
import TocItem from "@/plugins/_thread/toc/TocItem";
import { useHandleTouch } from "@/plugins/_thread/toc/useHandleTouch";
import { scrollToElement } from "@/utils/dom-utils/generics";

import TablerX from "~icons/tabler/x";

const threadTocCss = await getVersionedRemoteResource(
  threadTocCssResourceConfig,
  persistentQueryClient,
);

export function TocPanel() {
  const isOpen = useThreadTocStore((store) => store.isOpen);
  const setIsOpen = useThreadTocStore((store) => store.setIsOpen);
  const tocItems = useThreadTocStore((store) => store.tocItems);
  const panelPosition = useThreadTocStore((store) => store.panelPosition);

  const portalContainer = useThreadDomObserverStore(
    (store) => store.$wrapper?.[0],
    deepEqual,
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  useInsertCss({
    id: "thread-toc",
    css: threadTocCss,
  });

  useHandleTouch({
    containerRef,
    isOpen,
    setIsOpen,
  });

  const shouldShowToc = tocItems.length > 1 && panelPosition != null;

  if (!shouldShowToc || portalContainer == null) return null;

  const isFloating = panelPosition.isOverflowing;
  const width = panelPosition.width;
  const left = panelPosition.position.left;

  return (
    <Activity mode={isFloating && !isOpen ? "hidden" : "visible"}>
      <Portal container={portalContainer}>
        <div
          id="thread-toc-container"
          className={cn("x:absolute x:z-10 x:w-(--panel-width)", {
            "x:left-(--panel-left)": !isFloating,
            "x:right-4 x:rounded-xl x:border x:border-border/50 x:bg-secondary x:shadow-lg x:md:right-8":
              isFloating,
          })}
          style={
            {
              ["--panel-width"]: `${width}px`,
              ["--panel-left"]: !isFloating && `${left}px`,
            } as React.CSSProperties
          }
        >
          <div
            className={cn(
              "custom-scrollbar",
              "x:flex x:h-full x:flex-col x:gap-2 x:overflow-y-auto",
              {
                "x:max-h-[60vh] x:p-4 x:pr-10": isFloating,
                "x:max-h-[80vh]": !isFloating,
              },
            )}
          >
            {isFloating && (
              <div
                className="x:absolute x:top-2 x:right-2 x:cursor-pointer x:rounded-full x:p-1 x:text-muted-foreground x:transition-colors x:hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <TablerX className="x:size-4" />
              </div>
            )}
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
      </Portal>
    </Activity>
  );
}
