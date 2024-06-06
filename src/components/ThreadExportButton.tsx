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
} from 'lucide-react';

import { ThreadMessageAPIResponse } from '@/types/PPLXApi';
import { ui } from '@/utils/ui';
import {
  jsonUtils,
  whereAmI,
} from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';

import useElementObserver from './hooks/useElementObserver';
import { Button } from './ui/button';

export default function ThreadExportButton() {
  const { refetch, isFetching: isFetchingCurrentThreadInfo } = useQuery<
    ThreadMessageAPIResponse[]
  >({
    queryKey: ['currentThreadInfo'],
    enabled: false,
  });

  const [container, setContainer] = React.useState<Element>();

  const idleSaveButtonText = useMemo(
    () => (
      <>
        <Download className="tw-mr-2 tw-w-4 tw-h-4" />
        <span>Export</span>
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

  const handleExportThread = useCallback(async () => {
    const result = await refetch();

    if (!result.data) return;

    let outputText = '';

    result.data?.map((message) => {
      outputText += `**Question**:  \n${message.query_str}\n\n`;

      const answer =
        jsonUtils.safeParse(message.text)?.answer ||
        jsonUtils.safeParse(
          jsonUtils.safeParse(message.text)?.[4].content.answer
        )?.answer;

      outputText += `**Answer** (${message.display_model.toUpperCase()}):  \n${answer}\n\n`;

      const proSearchWebResults = jsonUtils.safeParse(message.text)?.[2]
        ?.content.web_results;
      const normalSearchWebResults = jsonUtils.safeParse(
        message.text
      ).web_results;

      (proSearchWebResults || normalSearchWebResults).map(
        (
          webResult: {
            name: string;
            url: string;
          },
          index: number
        ) => {
          outputText += `[${index + 1}] [${webResult.name}](${webResult.url})  \n`;
        }
      );

      outputText += '\n---\n\n';
    });

    navigator.clipboard.writeText(outputText);

    setSaveButtonText(
      <>
        <Check className="tw-mr-2 tw-w-4 tw-h-4" />
        <span>Copied</span>
      </>
    );

    setTimeout(() => {
      setSaveButtonText(idleSaveButtonText);
    }, 2000);
  }, [refetch, idleSaveButtonText]);

  if (whereAmI() !== 'thread' || !container) return null;

  return ReactDOM.createPortal(
    <Button
      className="tw-h-[2rem] tw-text-muted-foreground hover:tw-text-foreground !tw-p-2"
      variant="outline"
      onClick={() => handleExportThread()}
      disabled={isFetchingCurrentThreadInfo}
    >
      {isFetchingCurrentThreadInfo ? (
        <LoaderCircle className="tw-w-4 tw-h-4 tw-animate-spin" />
      ) : (
        saveButtonText
      )}
    </Button>,
    container
  );
}
