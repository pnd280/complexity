import $ from 'jquery';
import { LoaderCircle } from 'lucide-react';
import ReactDOM from 'react-dom';

import CanvasPlaceholder from '@/content-script/components/Canvas/CanvasPlaceholder';
import Canvas, { CanvasLang } from '@/utils/Canvas';

import CanvasRenderButton from './CanvasRenderButton';
import CopyButton from './CopyButton';

type MarkdownBlockToolbarProps = {
  preBlockIndex: number;
  lang: string;
  preBlockId: string;
};

export default (function AlternateMarkdownBlockToolbar({
  preBlockIndex,
  lang,
  preBlockId,
}: MarkdownBlockToolbarProps) {
  const $pre = $(`pre#${preBlockId}`);

  if ($pre.attr('data-mask') === 'true') {
    if (!Canvas.isCanvasLang(lang)) return null;
    
    const portalInsertionNode = $pre[0]?.closest('div.w-full.max-w-\\[90vw\\]');

    if (!portalInsertionNode) return null;

    return ReactDOM.createPortal(
      <CanvasPlaceholder
        preBlockId={preBlockId}
        preBlockIndex={preBlockIndex}
        lang={lang as CanvasLang}
      />,
      portalInsertionNode
    );
  }

  return (
    <div
      className={`tw-p-2 tw-px-3 tw-flex tw-items-center tw-bg-secondary tw-font-sans tw-border-b !tw-border-border ${preBlockId}-inflight-indicator tw-group`}
    >
      <div className="tw-text-foreground tw-font-mono tw-font-medium tw-text-sm">
        {lang || 'text'}
      </div>
      <div className="tw-ml-auto tw-flex tw-gap-3">
        <div
          className={`tw-text-muted-foreground group-data-[inflight=false]:tw-hidden`}
        >
          <LoaderCircle className="tw-size-4 tw-animate-spin" />
        </div>

        {Canvas.isCanvasLang(lang) && (
          <div className="tw-hidden group-data-[inflight=false]:tw-block">
            <CanvasRenderButton
              preBlockId={preBlockId}
              preBlockIndex={preBlockIndex}
            />
          </div>
        )}

        <CopyButton $pre={$pre} />
      </div>
    </div>
  );
});
