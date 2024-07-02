import { useCallback } from 'react';

import $ from 'jquery';
import {
  Check,
  Copy,
  LoaderCircle,
  Unlink,
} from 'lucide-react';
import { FaMarkdown } from 'react-icons/fa';

import pplxApi from '@/utils/pplx-api';
import { jsonUtils } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';

import useCtrlDown from '../hooks/useCtrlDown';
import useToggleButtonText from '../hooks/useToggleButtonText';
import TooltipWrapper from '../Tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from '../ui/use-toast';
import { Container } from './ThreadMessageStickyHeader';

type CopyButtonProps = {
  container: Container;
  containerIndex: number;
};

export default function CopyButton({
  container,
  containerIndex,
}: CopyButtonProps) {
  // TODO: move this up to parent component
  const { refetch, isFetching: isFetchingCurrentThreadInfo } = useQuery({
    queryKey: ['currentThreadInfo'],
    queryFn: () =>
      pplxApi.fetchThreadInfo(window.location.pathname.split('/').pop() || ''),
    enabled: false,
  });

  const ctrlDown = useCtrlDown();

  const [copyButtonText, setCopyButtonText] = useToggleButtonText({
    defaultText: (
      <Copy className="tw-w-4 tw-h-4 tw-text-muted-foreground group-hover:tw-text-foreground tw-transition-all" />
    ),
  });

  const handleCopyMessage = useCallback(() => {
    const $buttonBar = $(container.messageBlock).find(
      '.mt-sm.flex.items-center.justify-between'
    );

    const $button = $buttonBar
      .children()
      .last()
      .children()
      .find('div:has([data-icon="clipboard"])');

    if (!$button.length) return;

    $button.trigger('click');

    setCopyButtonText(<Check className="tw-w-4 tw-h-4" />);
  }, [container.messageBlock, setCopyButtonText]);

  const handleCopyStrippedMessage = useCallback(async () => {
    const answer = await processMessage(containerIndex);

    try {
      await navigator.clipboard.writeText(answer);

      setCopyButtonText(<Check className="tw-w-4 tw-h-4" />);
    } catch (e) {
      toast({
        title: '⚠️ Error',
        description: 'The document must be focused to copy the text.',
        timeout: 1000,
      });
    }

    async function processMessage(containerIndex: number): Promise<string> {
      const result = await refetch();

      if (!result.data || !result.data[containerIndex]) return '';

      const message = result.data[containerIndex];
      const messageText = jsonUtils.safeParse(message.text);
      const isProSearch = Array.isArray(messageText);

      let answer =
        messageText?.answer ||
        jsonUtils.safeParse(
          messageText?.[messageText.length - 1]?.content?.answer
        )?.answer;

      const webResults = isProSearch
        ? messageText.find((x) => x.step_type === 'SEARCH_RESULTS')?.content
            ?.web_results
        : jsonUtils.safeParse(message.text)?.web_results;

      webResults?.forEach((_: unknown, index: number) => {
        const findText = `\\[${index + 1}\\]`;
        answer = answer.replace(new RegExp(findText, 'g'), '');
      });

      return answer;
    }
  }, [containerIndex, refetch, setCopyButtonText]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        onClick={(e) => {
          if (ctrlDown) {
            e.preventDefault();
            handleCopyMessage();
          }
        }}
      >
        <TooltipWrapper content="Copy Message">
          <div className="tw-text-secondary-foreground tw-cursor-pointer tw-transition-all tw-animate-in tw-fade-in active:tw-scale-95 hover:tw-bg-secondary tw-rounded-md tw-p-1 tw-group">
            {isFetchingCurrentThreadInfo ? (
              <LoaderCircle className="tw-w-4 tw-h-4 tw-animate-spin" />
            ) : (
              copyButtonText
            )}
          </div>
        </TooltipWrapper>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={() => {
            handleCopyMessage();
          }}
          className="tw-flex tw-gap-2 tw-items-center"
        >
          <FaMarkdown className="tw-w-4 tw-h-4" />
          Default
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            handleCopyStrippedMessage();
          }}
          className="tw-flex tw-gap-2 tw-items-center"
        >
          <Unlink className="tw-w-4 tw-h-4" />
          Without citations
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
