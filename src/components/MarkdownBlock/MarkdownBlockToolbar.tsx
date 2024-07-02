import $ from 'jquery';
import {
  Check,
  Copy,
  GitCompare,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { stripHtml } from '@/utils/utils';

import useToggleButtonText from '../hooks/useToggleButtonText';
import TooltipWrapper from '../Tooltip';

type MarkdownBlockToolbarProps = {
  lang: string;
  preElementId: string;
  index: number;
  isSelectedForComparison: boolean;
  handleSelectForCompare: (index: number) => void;
};

export default (function MarkdownBlockToolbar({
  lang,
  preElementId,
  index,
  isSelectedForComparison,
  handleSelectForCompare,
}: MarkdownBlockToolbarProps) {
  const [copyButtonText, setCopyButtonText] = useToggleButtonText({
    defaultText: <Copy className="tw-w-4 tw-h-4" />,
  });

  return (
    <div className="tw-p-2 tw-px-3 tw-flex tw-items-center tw-bg-[#1d1f21] tw-font-sans">
      <div className="tw-text-background dark:tw-text-foreground">
        {lang || 'plain-text'}
      </div>
      <div className="tw-ml-auto tw-flex tw-gap-3">
        <TooltipWrapper content="Select for Compare">
          <div
            className={cn(
              'tw-cursor-pointer tw-text-muted-foreground hover:tw-text-background dark:hover:tw-text-foreground tw-transition-all active:tw-scale-95',
              {
                '!tw-text-background dark:!tw-text-accent-foreground':
                  isSelectedForComparison,
              }
            )}
            onClick={() => {
              handleSelectForCompare(index);
            }}
          >
            <GitCompare className="tw-w-4 tw-h-4" />
          </div>
        </TooltipWrapper>

        <div
          className="tw-cursor-pointer tw-text-muted-foreground hover:tw-text-background dark:hover:tw-text-foreground tw-transition-all active:tw-scale-95"
          onClick={() => {
            const $preElement = $(`pre#${preElementId}`);

            if (
              $preElement.parents().eq(1).attr('id') ===
              'markdown-query-wrapper'
            ) {
              navigator.clipboard.writeText(
                stripHtml($preElement.find('code:first').text())
              );
            } else {
              const $copyButton = $preElement.parent().find('button');

              requestAnimationFrame(() => {
                $copyButton.addClass('!tw-hidden');
              });

              $copyButton.trigger('click');
            }

            setCopyButtonText(<Check className="tw-w-4 tw-h-4" />);
          }}
        >
          {copyButtonText}
        </div>
      </div>
    </div>
  );
});
