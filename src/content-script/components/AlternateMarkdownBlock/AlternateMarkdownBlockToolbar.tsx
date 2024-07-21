import $ from 'jquery';
import { LoaderCircle } from 'lucide-react';

import Canvas from '@/utils/Canvas';

import CanvasRenderButton from './CanvasRenderButton';
import CopyButton from './CopyButton';

type MarkdownBlockToolbarProps = {
  lang: string;
  preBlockId: string;
};

export default function AlternateMarkdownBlockToolbar({
  lang,
  preBlockId,
}: MarkdownBlockToolbarProps) {
  const $pre = $(`pre#${preBlockId}`);

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
            <CanvasRenderButton preBlockId={preBlockId} />
          </div>
        )}

        <CopyButton $pre={$pre} />
      </div>
    </div>
  );
}
