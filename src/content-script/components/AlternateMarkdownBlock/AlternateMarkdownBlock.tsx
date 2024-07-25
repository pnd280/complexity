import { useDebounce } from "@uidotdev/usehooks";
import $ from "jquery";
import { Fragment, useState } from "react";
import ReactDOM from "react-dom";

import useMarkdownBlockObserver from "@/content-script/hooks/useMarkdownBlockObserver";
import Canvas, { CanvasLang } from "@/utils/Canvas";

import CanvasPlaceholder from "../Canvas/CanvasPlaceholder";

import AlternateMarkdownBlockToolbar from "./AlternateMarkdownBlockToolbar";

export type MarkdownBlockContainer = {
  wrapper: Element;
  header: Element;
  preElement: Element;
  lang: string;
  isNative: boolean;
};

export default function AlternateMarkdownBlock() {
  const [containers, setContainers] = useState<MarkdownBlockContainer[]>([]);
  const debouncedContainers = useDebounce(containers, 200);

  useMarkdownBlockObserver({
    setContainers,
  });

  return debouncedContainers.map((container, index) => {
    const id = `md-block-${index + 1}`;

    $(container.preElement).attr("id", id);

    const isMasked = $(container.preElement).attr("data-mask") === "true";
    const isCanvasLang = Canvas.isActiveCanvasLang(container.lang);

    if (!isMasked) {
      return (
        <Fragment key={index}>
          {ReactDOM.createPortal(
            <AlternateMarkdownBlockToolbar
              lang={container.lang}
              preBlockId={id}
            />,
            container.header,
          )}
        </Fragment>
      );
    } else if (isMasked && isCanvasLang) {
      return ReactDOM.createPortal(
        <CanvasPlaceholder
          preBlockId={id}
          lang={container.lang as CanvasLang}
        />,
        container.wrapper,
      );
    }

    return null;
  });
}
