import showdown from "showdown";

import { useCanvasStore } from "@/content-script/session-store/canvas";
import { CanvasLang } from "@/utils/Canvas";
import MarkdownBlockUtils from "@/utils/MarkdownBlock";

export default function MarkdownCanvas() {
  const { metaData, toggleShowCode } = useCanvasStore();

  const render = useCallback(async () => {
    if (!metaData) return;

    toggleShowCode(false);

    const { preBlockId } = metaData;

    const $pre = $(`#${preBlockId}`);

    if ((MarkdownBlockUtils.getLang($pre) as CanvasLang) !== "scratchpad")
      return;

    const code = await MarkdownBlockUtils.extractCodeFromPreReactNode($pre[0]);

    if (!code) return;

    const $wrapper = $("<div>")
      .attr("id", "markdown-wrapper")
      .addClass(
        "tw-prose tw-w-full tw-mx-8 tw-mt-16 tw-mb-8 tw-whitespace-normal tw-break-words",
      )
      .text(code);

    $("#complexity-canvas").empty().append($wrapper);

    const converter = new showdown.Converter();

    converter.setOption("simpleLineBreaks", true);

    const html = converter.makeHtml(code);

    $wrapper.html(html);
  }, [metaData, toggleShowCode]);

  useEffect(() => {
    render();
  }, [render]);

  return null;
}
