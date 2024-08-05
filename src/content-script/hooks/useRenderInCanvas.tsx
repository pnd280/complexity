import { useQuery } from "@tanstack/react-query";
import $ from "jquery";
import { useEffect } from "react";

import { useCanvasStore } from "@/content-script/session-store/canvas";
import MarkdownBlockUtils from "@/utils/MarkdownBlock";
import { queryClient } from "@/utils/ts-query-query-client";

type useRenderInCanvasProps = {
  preBlockId: string;
};

export default function useRenderInCanvas({
  preBlockId,
}: useRenderInCanvasProps) {
  const { metaData: canvasMetaData, setMetaData: setCanvasMetaData } =
    useCanvasStore();

  const { data: content, refetch: extractContent } = useQuery({
    queryKey: ["canvasCode", preBlockId],
    queryFn: () =>
      MarkdownBlockUtils.extractCodeFromPreReactNode($(`#${preBlockId}`)[0]),
    refetchOnWindowFocus: false,
  });

  const messageBlockIndex = +(
    $(`#${preBlockId}`).closest(".message-block").attr("data-index") || 0
  );

  const isActive =
    canvasMetaData?.content === (content ?? "") &&
    canvasMetaData.preBlockId === preBlockId;

  const handleRender = async () => {
    const { data: content } = await extractContent();

    if (
      !content ||
      $(`#${preBlockId}`)
        .closest(".message-block")
        .find(`.${preBlockId}-inflight-indicator`)
        .attr("data-inflight") !== "false"
    )
      return;

    if (isActive) return setCanvasMetaData();

    setCanvasMetaData({
      messageBlockIndex,
      preBlockId,
      content,
    });
  };

  useEffect(() => {
    return () =>
      queryClient.removeQueries({
        queryKey: ["canvasCode", preBlockId],
      });
  }, [preBlockId]);

  return {
    isActive,
    handleRender,
  };
}
