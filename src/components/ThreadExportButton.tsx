import React, {
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
import {
  Check,
  Download,
  LoaderCircle,
  Unlink,
} from 'lucide-react';
import { FaMarkdown } from 'react-icons/fa';

import { languageModels } from '@/consts/model-selector';
import pplxApi from '@/utils/pplx-api';
import { ui } from '@/utils/ui';
import {
  jsonUtils,
  whereAmI,
} from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';

import useElementObserver from './hooks/useElementObserver';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from './ui/use-toast';

const exportOptions = [
  {
    label: 'Default',
    value: 'citations',
    icon: <FaMarkdown className="tw-w-4 tw-h-4" />,
  },
  {
    label: 'Without citations',
    value: 'no-citations',
    icon: <Unlink className="tw-w-4 tw-h-4" />,
  },
] as const;

export default function ThreadExportButton() {
  const { refetch, isFetching: isFetchingCurrentThreadInfo } = useQuery({
    queryKey: ['currentThreadInfo'],
    queryFn: () =>
      pplxApi.fetchThreadInfo(window.location.pathname.split('/').pop() || ''),
    enabled: false,
  });

  const [container, setContainer] = React.useState<Element>();

  const idleSaveButtonText = useMemo(
    () => (
      <>
        <Download className="tw-mr-1 tw-w-4 tw-h-4" />
        <span className="tw-font-sans">Export</span>
      </>
    ),
    []
  );

  const [saveButtonText, setSaveButtonText] =
    useState<ReactNode>(idleSaveButtonText);

  useElementObserver({
    selector: () => [ui.getStickyHeader()[0]],
    callback: ({ element }) => {
      const myContainer = $('<div>');

      $(element).find('>div>div:last>div:last').before(myContainer);

      setContainer(myContainer[0]);
    },
    observedIdentifier: 'thread-export-button',
  });

  const handleExportThread = useCallback(
    async ({ includeCitations }: { includeCitations?: boolean }) => {
      const outputText = await processMessages();

      try {
        await navigator.clipboard.writeText(outputText);

        setSaveButtonText(
          <>
            <Check className="tw-mr-1 tw-w-4 tw-h-4" />
            <span>Copied</span>
          </>
        );

        setTimeout(() => {
          setSaveButtonText(idleSaveButtonText);
        }, 2000);
      } catch (e) {
        toast({
          title: '⚠️ Error',
          description: 'The document must be focused to copy the text.',
          timeout: 1000,
        });
      }

      async function processMessages(): Promise<string> {
        const result = await refetch();

        if (!result.data) return '';

        let outputText = '';

        result.data?.map((message) => {
          outputText += `**Question**:  \n${message.query_str}\n\n`;

          const messageText = jsonUtils.safeParse(message.text);
          const isProSearch = Array.isArray(messageText);

          let answer =
            jsonUtils.safeParse(message.text)?.answer ||
            jsonUtils.safeParse(
              jsonUtils.safeParse(message.text)?.[messageText.length - 1]
                .content.answer
            )?.answer;

          let webResults = '';

          const extractedWebResults = isProSearch
            ? messageText.find((x) => x.step_type === 'SEARCH_RESULTS')?.content
                ?.web_results
            : jsonUtils.safeParse(message.text)?.web_results;

          extractedWebResults?.map(
            (
              webResult: {
                name: string;
                url: string;
              },
              index: number
            ) => {
              if (includeCitations) {
                webResults += `[${index + 1}] [${webResult.name}](${webResult.url})  \n`;
              } else {
                const findText = `\\[${index + 1}\\]`;
                answer = answer.replace(new RegExp(findText, 'g'), '');
              }
            }
          );

          const modelName =
            languageModels.find((model) => model.code === message.display_model)
              ?.label || message.display_model;

          outputText += `**Answer** (${modelName}):  \n${answer}\n\n`;

          if (includeCitations && webResults) {
            outputText += `**Web Results**:  \n${webResults}\n\n`;
          }

          outputText += '\n---\n\n\n';
        });

        return outputText;
      }
    },
    [refetch, idleSaveButtonText]
  );

  if (whereAmI() !== 'thread' || !container) return null;

  return ReactDOM.createPortal(
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="!tw-p-2 tw-h-[2rem] tw-rounded-sm tw-text-muted-foreground hover:tw-text-foreground tw-flex tw-items-center tw-transition-all"
          disabled={isFetchingCurrentThreadInfo}
        >
          {isFetchingCurrentThreadInfo ? (
            <LoaderCircle className="tw-w-4 tw-h-4 tw-animate-spin" />
          ) : (
            saveButtonText
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {exportOptions.map((option, index) => (
          <DropdownMenuItem
            key={index}
            onSelect={() => {
              handleExportThread({
                includeCitations: option.value === 'citations',
              });
            }}
            className="tw-flex tw-gap-2 tw-items-center"
          >
            {option.icon}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>,
    container
  );
}
