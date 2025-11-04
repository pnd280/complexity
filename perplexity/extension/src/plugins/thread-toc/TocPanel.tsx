import { Activity } from "react";

import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { useThreadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";
import { threadTocCssResourceConfig } from "@/plugins/thread-toc/index.remote-resources";
import { useThreadTocStore } from "@/plugins/thread-toc/store";
import TocItem from "@/plugins/thread-toc/TocItem";
import { useHandleTouch } from "@/plugins/thread-toc/useHandleTouch";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";
import { scrollToElement } from "@/utils/dom-utils/generics";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/dom-utils/pplx-scrollbar-classes";

import TablerX from "~icons/tabler/x";

const threadTocCss = await getVersionedRemoteResource(
  threadTocCssResourceConfig,
  persistentQueryClient,
);

export function TocPanel() {
  const isOpen = useThreadTocStore((state) => state.isOpen);
  const setIsOpen = useThreadTocStore((state) => state.setIsOpen);
  const tocItems = useThreadTocStore((state) => state.tocItems);
  const panelPosition = useThreadTocStore((state) => state.panelPosition);

  const threadWrapper = useThreadDomObserverStore(
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

  if (!shouldShowToc || threadWrapper == null) return null;

  const isFloating = panelPosition.isOverflowing;
  const width = panelPosition.width;
  const left = panelPosition.position.left;

  return (
    <Activity mode={isFloating && !isOpen ? "hidden" : "visible"}>
      <Portal container={threadWrapper}>
        <div
          id="thread-toc-container"
          className={cn("x:absolute x:w-(--panel-width)", {
            "x:left-(--panel-left)": !isFloating,
            "x:right-4 x:rounded-md x:border x:border-border/50 x:bg-secondary x:shadow-lg x:md:right-8":
              isFloating,
          })}
          style={
            {
              ["--panel-width"]: `${width}px`,
              ["--panel-left"]: !isFloating && `${left}px`,
            } as React.CSSProperties
          }
        >
          {isFloating && (
            <div
              className="x:absolute x:top-2 x:right-2 x:cursor-pointer x:rounded-full x:p-1 x:text-muted-foreground x:transition-colors x:hover:text-foreground"
              onClick={() => setIsOpen(false)}
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
      </Portal>
    </Activity>
  );
}
