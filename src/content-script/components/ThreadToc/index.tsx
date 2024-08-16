import { useToggle } from "@uidotdev/usehooks";
import $ from "jquery";
import { useEffect, useState } from "react";

import FloatingTrigger from "@/content-script/components/ThreadToc/FloatingToggle";
import Panel from "@/content-script/components/ThreadToc/Panel";
import useThreadTocObserver from "@/content-script/hooks/useThreadTocObserver";
import { useCanvasStore } from "@/content-script/session-store/canvas";
import { cn } from "@/utils/cn";
import UiUtils from "@/utils/UiUtils";

export type AnchorProps = {
  title: string;
  onClick: () => void;
  onContextMenu: () => void;
};

export default function ThreadToc() {
  const { isOpen: isCanvasOpen } = useCanvasStore();

  const { visibleMessageIndex, anchorsProps, wrapperPos } =
    useThreadTocObserver();

  const [visible, toggleVisibility] = useToggle(true);

  const [wrapperWidth, setWrapperWidth] = useState<number>(
    $("#thread-toc")?.outerWidth() ?? 0,
  );

  const isFloat =
    isCanvasOpen ||
    (wrapperPos
      ? wrapperPos.left + wrapperWidth + 50 > window.innerWidth
      : false);

  useEffect(() => {
    isCanvasOpen && toggleVisibility(false);
  }, [isCanvasOpen, toggleVisibility]);

  useEffect(() => {
    requestAnimationFrame(() => {
      setWrapperWidth($("#thread-toc")?.outerWidth() ?? 0);
    });
  });

  if (!anchorsProps || anchorsProps.length < 2 || !wrapperPos) return null;

  return (
    <div
      className="tw-fixed tw-right-0 tw-top-0 tw-z-20 tw-w-max tw-transition-all"
      style={{
        top: `${(UiUtils.getThreadWrapper().offset()?.top ?? 70) + (isFloat ? 60 : 30)}px`,
        [!isFloat ? "left" : "right"]: !isFloat
          ? `${wrapperPos.left + 20}px`
          : "2rem",
      }}
    >
      <Panel
        className={cn(
          "tw-font-sans tw-transition-all tw-animate-in tw-slide-in-from-right",
          {
            "tw-relative tw-rounded-md tw-border tw-border-border tw-bg-background tw-p-3 tw-shadow-lg":
              isFloat,
            "tw-hidden": !visible && isFloat,
          },
        )}
        id="thread-toc"
        anchorsProps={anchorsProps}
        visible={visible}
        isFloat={isFloat}
        toggleVisibility={toggleVisibility}
        visibleMessageIndex={visibleMessageIndex}
      />
      <FloatingTrigger
        className={cn(
          "tw-absolute -tw-right-10 -tw-top-2 tw-h-20 tw-cursor-pointer tw-rounded-full tw-border tw-border-border tw-bg-secondary tw-shadow-lg tw-transition-all tw-animate-in tw-slide-in-from-left active:tw-scale-95",
          "tw-flex tw-items-center hover:-tw-right-8",
          {
            "tw-hidden": !isFloat || visible,
          },
        )}
        onClick={() => {
          toggleVisibility(true);
        }}
      />
    </div>
  );
}
