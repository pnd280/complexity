import $ from 'jquery';
import {
  Check,
  Copy,
} from 'lucide-react';

import { stripHtml } from '@/utils/utils';

import useToggleButtonText from '../hooks/useToggleButtonText';

type MarkdownBlockToolbarProps = {
  lang: string;
  preElementId: string;
};

export default (function MarkdownBlockToolbar({
  lang,
  preElementId,
}: MarkdownBlockToolbarProps) {
  const [copyButtonText, setCopyButtonText] = useToggleButtonText({
    defaultText: <Copy className="tw-w-4 tw-h-4" />,
  });

  return (
    <div className="tw-p-2 tw-px-3 tw-flex tw-items-center tw-bg-secondary tw-font-sans tw-border-b !tw-border-foreground-darker dark:!tw-border-muted tw-border-b-px">
      <div className="tw-text-foreground tw-font-mono tw-font-medium tw-text-sm">
        {lang || 'text'}
      </div>
      <div className="tw-ml-auto tw-flex tw-gap-3">

        <div
          className="tw-cursor-pointer tw-text-muted-foreground hover:tw-text-foreground tw-transition-all active:tw-scale-95"
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
