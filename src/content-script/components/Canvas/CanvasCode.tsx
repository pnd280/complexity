import { useQuery } from "@tanstack/react-query";
import $ from "jquery";
import { useEffect } from "react";
import { LuLoader2 as LoaderCircle } from "react-icons/lu";

import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import { useCanvasStore } from "@/content-script/session-store/canvas";
import MarkdownBlockUtils from "@/utils/MarkdownBlock";

export default function CanvasCode() {
  const { showCode, metaData } = useCanvasStore();

  const {
    data: highlightedCode,
    refetch,
    isFetching: isFetchingHighlightedCode,
  } = useQuery({
    queryKey: ["canvasHighlightedCode"],
    queryFn: async () => {
      const highligtedCode = await webpageMessenger.sendMessage({
        event: "getHighlightedCodeAsHtml",
        payload: {
          code: metaData!.content,
          lang: MarkdownBlockUtils.getLang($(`pre#${metaData!.preBlockId}`)),
        },
        timeout: 5000,
      });

      if (!highligtedCode) return;

      return highligtedCode;
    },
    enabled: !!metaData?.content,
    select(data) {
      if (!data) return;

      return $(data).find("code").html();
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [metaData, refetch]);

  if (!showCode || !metaData) return null;

  return (
    <div className="tw-absolute tw-inset-0 tw-size-full tw-overflow-auto tw-bg-secondary">
      {isFetchingHighlightedCode || !highlightedCode ? (
        <div className="tw-flex tw-size-full tw-items-center tw-justify-center">
          <LoaderCircle className="tw-size-8 tw-animate-spin" />
        </div>
      ) : (
        <pre className="line-numbers tw-p-4 tw-pt-[4rem] tw-font-mono">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode || "" }} />
        </pre>
      )}
    </div>
  );
}
