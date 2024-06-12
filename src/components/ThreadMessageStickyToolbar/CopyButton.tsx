import {
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

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
import TooltipWrapper from '../TooltipWrapper';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from '../ui/use-toast';
import { Container } from './';

type CopyButtonProps = {
  container: Container;
  containerIndex: number;
};

export default function CopyButton({
  container,
  containerIndex,
}: CopyButtonProps) {
  const { refetch, isFetching: isFetchingCurrentThreadInfo } = useQuery({
    queryKey: ['currentThreadInfo'],
    queryFn: () =>
      pplxApi.fetchThreadInfo(window.location.pathname.split('/').pop() || ''),
    enabled: false,
  });

  const ctrlDown = useCtrlDown();

  const idleSaveButtonText = useMemo(
    () => (
      <>
        <Copy className="tw-w-4 tw-h-4 tw-text-muted-foreground group-hover:tw-text-foreground tw-transition-all" />
      </>
    ),
    []
  );

  const [copyButtonText, setCopyButtonText] =
    useState<ReactNode>(idleSaveButtonText);

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

    setTimeout(() => {
      setCopyButtonText(idleSaveButtonText);
    }, 2000);
  }, [container.messageBlock, idleSaveButtonText, setCopyButtonText]);

  const handleCopyStrippedMessage = useCallback(async () => {
    const result = await refetch();

    if (!result.data) return;

    if (!result.data?.[containerIndex]) return;

    const message = result.data[containerIndex];

    let answer =
      jsonUtils.safeParse(message.text)?.answer ||
      jsonUtils.safeParse(jsonUtils.safeParse(message.text)?.[4].content.answer)
        ?.answer;

    const proSearchWebResults = jsonUtils.safeParse(message.text)?.[2]?.content
      .web_results;
    const normalSearchWebResults = jsonUtils.safeParse(
      message.text
    ).web_results;

    (proSearchWebResults || normalSearchWebResults).forEach(
      (_: unknown, index: number) => {
        const findText = `\\[${index + 1}\\]`;
        answer = answer.replace(new RegExp(findText, 'g'), '');
      }
    );

    try {
      await navigator.clipboard.writeText(answer);

      setCopyButtonText(<Check className="tw-w-4 tw-h-4" />);

      setTimeout(() => {
        setCopyButtonText(idleSaveButtonText);
      }, 2000);
    } catch (e) {
      toast({
        title: '⚠️ Error',
        description: 'The document must be focused to copy the text.',
        timeout: 1000,
      });
    }
  }, [containerIndex, idleSaveButtonText, refetch, setCopyButtonText]);

  return (
    <DropdownMenu>
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
