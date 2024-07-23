import { useDebounce, useToggle } from "@uidotdev/usehooks";
import $ from "jquery";
import { useCallback, useEffect } from "react";

import { useCanvasStore } from "@/content-script/session-store/canvas";
import MarkdownBlockUtils from "@/utils/MarkdownBlock";
import { scrollToElement } from "@/utils/utils";

export default function CanvasJumpToSource() {
  const [visible, setVisible] = useToggle(false);
  const { metaData } = useDebounce(useCanvasStore(), 200);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(true);
    };

    $(window).on("scroll", handleScroll);

    return () => {
      $(window).off("scroll", handleScroll);
    };
  }, [setVisible]);

  const handleOnJumpToSource = useCallback(() => {
    if (!metaData) return;

    const $preBlock = $(`#${metaData.preBlockId}`);

    if (
      !$preBlock ||
      MarkdownBlockUtils.extractCodeFromPreBlock($preBlock[0]) !==
        metaData.content
    ) {
      return;
    }

    scrollToElement($preBlock, -100, 200);

    setTimeout(() => {
      setVisible(false);
    }, 250);
  }, [metaData, setVisible]);

  if (!metaData || !visible) return null;

  return (
    <div
      className="tw-cursor-pointer tw-p-1 tw-font-sans tw-text-sm tw-text-muted-foreground tw-transition-all tw-duration-300 tw-animate-in tw-fade-in hover:tw-text-foreground active:tw-scale-95"
      onClick={handleOnJumpToSource}
    >
      Jump to source
    </div>
  );
}
