import { useQuery } from "@tanstack/react-query";
import $ from "jquery";
import { Check, Download, LoaderCircle, Unlink } from "lucide-react";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { FaMarkdown } from "react-icons/fa";

import PPLXApi from "@/services/PPLXApi";
import { Button } from "@/shared/components/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/shadcn/ui/dropdown-menu";
import { toast } from "@/shared/components/shadcn/ui/use-toast";
import UIUtils from "@/utils/UI";
import { isDOMNode, jsonUtils } from "@/utils/utils";

import useWaitForElement from "../hooks/useWaitForElement";

import { languageModels } from "./QueryBox";

const exportOptions = [
  {
    label: "Default",
    value: "citations",
    icon: <FaMarkdown className="tw-size-4" />,
  },
  {
    label: "Without citations",
    value: "no-citations",
    icon: <Unlink className="tw-size-4" />,
  },
] as const;

export default function ThreadExportButton() {
  const { refetch, isFetching: isFetchingCurrentThreadInfo } = useQuery({
    queryKey: ["currentThreadInfo"],
    queryFn: () =>
      PPLXApi.fetchThreadInfo(window.location.pathname.split("/").pop() || ""),
    enabled: false,
  });

  const [container, setContainer] = React.useState<Element>();

  const idleSaveButtonText = useMemo(
    () => (
      <>
        <Download className="tw-mr-1 tw-size-4" />
        <span className="tw-font-sans">Export</span>
      </>
    ),
    [],
  );

  const [saveButtonText, setSaveButtonText] =
    useState<ReactNode>(idleSaveButtonText);

  const { element, isWaiting } = useWaitForElement({
    id: "threadExportButton",
    selector: () => UIUtils.getStickyNavbar()[0],
  });

  useEffect(() => {
    if (!isDOMNode(element) || !$(element).length) return;

    requestIdleCallback(() => {
      const $stickyHeader = $(element);

      if ($stickyHeader.find("#thread-export-button").length) return;

      const container = $("<div>").attr("id", "thread-export-button");

      $stickyHeader.find(">div>div:last>div:last").before(container);

      setContainer(container[0]);
    });
  }, [element, isWaiting]);

  const handleExportThread = useCallback(
    async ({ includeCitations }: { includeCitations?: boolean }) => {
      const outputText = await processMessages();

      try {
        await navigator.clipboard.writeText(outputText);

        setSaveButtonText(
          <>
            <Check className="tw-mr-1 tw-size-4" />
            <span>Copied</span>
          </>,
        );

        setTimeout(() => {
          setSaveButtonText(idleSaveButtonText);
        }, 2000);
      } catch (e) {
        toast({
          title: "⚠️ Error",
          description: "The document must be focused to copy the text.",
          timeout: 1000,
        });
      }

      async function processMessages(): Promise<string> {
        const result = await refetch();

        if (!result.data) return "";

        let outputText = "";

        result.data?.map((message) => {
          outputText += `**Question**:  \n${message.query_str}\n\n`;

          const messageText = jsonUtils.safeParse(message.text);
          const isProSearch = Array.isArray(messageText);

          let answer =
            jsonUtils.safeParse(message.text)?.answer ||
            jsonUtils.safeParse(
              jsonUtils.safeParse(message.text)?.[messageText.length - 1]
                .content.answer,
            )?.answer;

          let webResults = "";

          const extractedWebResults = isProSearch
            ? messageText.find((x) => x.step_type === "SEARCH_RESULTS")?.content
                ?.web_results
            : jsonUtils.safeParse(message.text)?.web_results;

          extractedWebResults?.map(
            (
              webResult: {
                name: string;
                url: string;
              },
              index: number,
            ) => {
              if (includeCitations) {
                webResults += `[${index + 1}] [${webResult.name}](${webResult.url})  \n`;
              } else {
                const findText = `\\[${index + 1}\\]`;
                answer = answer.replace(new RegExp(findText, "g"), "");
              }
            },
          );

          const modelName =
            languageModels.find((model) => model.code === message.display_model)
              ?.label || message.display_model;

          outputText += `**Answer** (${modelName}):  \n${answer}\n\n`;

          if (includeCitations && webResults) {
            outputText += `**Web Results**:  \n${webResults}\n\n`;
          }

          outputText += "\n---\n\n\n";
        });

        return outputText;
      }
    },
    [refetch, idleSaveButtonText],
  );

  if (!container) return null;

  return ReactDOM.createPortal(
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="tw-flex tw-h-[2rem] tw-items-center tw-rounded-sm !tw-p-2 tw-text-muted-foreground tw-transition-all hover:tw-text-foreground"
          disabled={isFetchingCurrentThreadInfo}
        >
          {isFetchingCurrentThreadInfo ? (
            <LoaderCircle className="tw-size-4 tw-animate-spin" />
          ) : (
            saveButtonText
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {exportOptions.map((option, index) => (
          <DropdownMenuItem
            key={index}
            className="tw-flex tw-items-center tw-gap-2"
            onSelect={() => {
              handleExportThread({
                includeCitations: option.value === "citations",
              });
            }}
          >
            {option.icon}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>,
    container,
  );
}
