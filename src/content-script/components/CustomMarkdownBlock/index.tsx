import $ from "jquery";
import { useDeferredValue, useState } from "react";

import CanvasPlaceholder from "@/content-script/components/Canvas/CanvasPlaceholder";
import Toolbar from "@/content-script/components/CustomMarkdownBlock/Toolbar";
import useMarkdownBlockObserver from "@/content-script/hooks/useMarkdownBlockObserver";
import Portal from "@/shared/components/Portal";
import Canvas, { CanvasLang } from "@/utils/Canvas";

export type MarkdownBlockContainer = {
  wrapper: HTMLElement;
  header: HTMLElement;
  preElement: HTMLElement;
  lang: string;
  isNative: boolean;
};

export default function CustomMarkdownBlock() {
  const [containers, setContainers] = useState<MarkdownBlockContainer[]>([]);
  const deferredContainers = useDeferredValue(containers);

  useMarkdownBlockObserver({
    setContainers,
  });

  return deferredContainers.map((container, index) => {
    const id = `md-block-${index + 1}`;

    $(container.preElement).attr("id", id);

    const isMasked = $(container.preElement).attr("data-mask") === "true";
    const isCanvasLang = Canvas.isActiveCanvasLang(container.lang);

    if (!isMasked) {
      return (
        <Portal key={index} container={container.header}>
          <Toolbar lang={container.lang} preBlockId={id} />
        </Portal>
      );
    } else if (isMasked && isCanvasLang) {
      return (
        <Portal key={index} container={container.wrapper}>
          <CanvasPlaceholder
            preBlockId={id}
            lang={container.lang as CanvasLang}
          />
        </Portal>
      );
    }

    return null;
  });
}
