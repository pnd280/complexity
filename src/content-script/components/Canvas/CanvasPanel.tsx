import { useMediaQuery } from "@uidotdev/usehooks";
import $ from "jquery";
import { ReactNode, useCallback, useEffect, useState } from "react";
import ReactDom from "react-dom";

import { canvasComponents } from "@/content-script/components/Canvas/";
import CloseButton from "@/content-script/components/Canvas/CanvasCloseButton";
import CanvasCode from "@/content-script/components/Canvas/CanvasCode";
import CanvasJumpToSource from "@/content-script/components/Canvas/CanvasJumpToSource";
import CanvasViewTabToggle from "@/content-script/components/Canvas/CanvasViewTabToggle";
import useWaitForElement from "@/content-script/hooks/useWaitForElement";
import { useCanvasStore } from "@/content-script/session-store/canvas";
import Canvas from "@/utils/Canvas";
import { cn } from "@/utils/cn";
import MarkdownBlockUtils from "@/utils/MarkdownBlock";
import UiUtils from "@/utils/UiUtils";

export default function CanvasPanel() {
  const { isOpen, toggleOpen, metaData, setMetaData } = useCanvasStore();

  const [canvasComponent, setCanvasComponent] = useState<ReactNode>();

  const isFloat = useMediaQuery("(max-width: 1500px)");

  const { element: threadWrapper, isWaiting } = useWaitForElement({
    id: "thread-wrapper",
    selector: () => UiUtils.getThreadWrapper()[0],
    timeout: 5000,
  });

  const checkIfCanvasIsOpen = useCallback(() => {
    const { preBlockId } = metaData || {};

    if (!preBlockId) return false;

    const $pre = $(`#${preBlockId}`);
    const lang = MarkdownBlockUtils.getLang($pre);
    if (!Canvas.isActiveCanvasLang(lang)) return false;

    const code = MarkdownBlockUtils.extractCodeFromPreBlock($pre[0]);
    if (!code) return false;

    setCanvasComponent(canvasComponents[lang]);
    return true;
  }, [metaData]);

  const updateThreadWrapperClasses = useCallback(
    (isOpen: boolean) => {
      if (!threadWrapper) return;

      requestAnimationFrame(() => {
        $(threadWrapper)
          .children()
          .first()
          .children()
          .first()
          .toggleClass("max-w-threadWidth tw-mx-auto", isOpen);

        $(threadWrapper!).attr({
          "data-canvas-panel-state": isOpen ? "open" : "closed",
        });

        $(threadWrapper).toggleClass(
          "tw-grid !tw-max-w-[2500px] tw-grid-cols-2 tw-gap-8",
          isOpen && !isFloat,
        );
      });
    },
    [isFloat, threadWrapper],
  );

  useEffect(() => {
    if (!threadWrapper || isWaiting) return;
    const localIsOpen = checkIfCanvasIsOpen();
    updateThreadWrapperClasses(localIsOpen);
    toggleOpen(localIsOpen);
  }, [
    checkIfCanvasIsOpen,
    isWaiting,
    threadWrapper,
    toggleOpen,
    updateThreadWrapperClasses,
  ]);

  useEffect(() => {
    return () => {
      setMetaData();
    };
  }, [setMetaData]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      toggleOpen(false);
    }
  };

  if (!threadWrapper || !isOpen) return null;

  return ReactDom.createPortal(
    <div
      id="canvas-panel"
      className={cn(
        "tw-top-[5rem] tw-flex tw-flex-col tw-overflow-hidden tw-rounded-md tw-border tw-bg-accent tw-transition-all",
        "tw-animate-in tw-fade-in tw-slide-in-from-right",
        {
          "tw-sticky": !isFloat,
          "tw-fixed tw-right-8 tw-z-[20] tw-w-[80%] tw-shadow-lg": isFloat,
        },
      )}
      style={{
        height: `calc(100vh - ${UiUtils.getStickyNavbar().outerHeight()}px - 3rem)`,
      }}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="tw-relative tw-size-full">
        <div className="tw-absolute tw-inset-2 tw-z-10 tw-size-max">
          <CanvasViewTabToggle />
        </div>
        <div className="tw-absolute tw-left-1/2 tw-top-2 tw-z-10 tw-size-max -tw-translate-x-1/2">
          <CanvasJumpToSource key={metaData?.preBlockId} />
        </div>
        <div className="tw-absolute tw-right-2 tw-top-2 tw-z-10 tw-size-max">
          <CloseButton />
        </div>
        <div id="complexity-canvas" className="tw-size-full" />
        {canvasComponent}
        <CanvasCode />
      </div>
    </div>,
    threadWrapper,
  );
}
