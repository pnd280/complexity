import $ from 'jquery';

import { useCanvasStore } from '@/content-script/session-store/canvas';
import MarkdownBlockUtils from '@/utils/MarkdownBlock';
import { useQuery } from '@tanstack/react-query';

type useRenderInCanvasProps = {
  preBlockId: string;
  preBlockIndex: number;
};

export default function useRenderInCanvas({
  preBlockId,
  preBlockIndex,
}: useRenderInCanvasProps) {
  const { metaData: canvasMetaData, setMetaData: setCanvasMetaData } =
    useCanvasStore();

  const { data: content, refetch: extractContent } = useQuery({
    queryKey: ['canvasCode'],
    queryFn: () =>
      MarkdownBlockUtils.extractCodeFromPreReactNode($(`#${preBlockId}`)[0]),
    refetchOnWindowFocus: false,
  });

  const messageBlockIndex = +(
    $(`#${preBlockId}`).closest('.message-block').attr('data-index') || 0
  );

  const isActive =
    canvasMetaData?.messageBlockIndex === messageBlockIndex &&
    canvasMetaData?.content === (content ?? '') &&
    canvasMetaData.preBlockIndex === preBlockIndex;

  const handleRender = async () => {
    const { data: content } = await extractContent();

    if (
      !content ||
      $(`#${preBlockId}`)
        .closest('.message-block')
        .find(`.${preBlockId}-inflight-indicator`)
        .attr('data-inflight') !== 'false'
    )
      return;

    if (
      canvasMetaData &&
      canvasMetaData.preBlockIndex === preBlockIndex &&
      canvasMetaData.content === content
    )
      return setCanvasMetaData();

    setCanvasMetaData({
      messageBlockIndex,
      preBlockIndex,
      preBlockId: preBlockId,
      content,
    });
  };

  return {
    isActive,
    handleRender,
  };
}
