import { useQuery } from "@tanstack/react-query";
import $ from "jquery";
import { Check, Download, LoaderCircle, Unlink } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaMarkdown } from "react-icons/fa";

import useWaitForElement from "@/content-script/hooks/useWaitForElement";
import PplxApi from "@/services/PplxApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/DropdownMenu";
import Portal from "@/shared/components/Portal";
import { Button } from "@/shared/components/shadcn/ui/button";
import { toast } from "@/shared/components/shadcn/ui/use-toast";
import useToggleButtonText from "@/shared/hooks/useToggleButtonText";
import ThreadExport from "@/utils/ThreadExport";
import UiUtils from "@/utils/UiUtils";
import { isDomNode } from "@/utils/utils";

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
      PplxApi.fetchThreadInfo(window.location.pathname.split("/").pop() || ""),
    enabled: false,
  });

  const [container, setContainer] = useState<HTMLElement>();

  const [saveButtonText, setSaveButtonText] = useToggleButtonText({
    defaultText: useMemo(
      () => (
        <>
          <Download className="tw-mr-1 tw-size-4" />
          <span className="tw-font-sans">Export</span>
        </>
      ),
      [],
    ),
  });

  const { element, isWaiting } = useWaitForElement({
    id: "threadExportButton",
    selector: () => UiUtils.getStickyNavbar()[0],
  });

  useEffect(() => {
    if (!isDomNode(element) || !$(element).length) return;

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
      const resp = await refetch();

      if (!resp || !resp.data) return;

      const output = ThreadExport.exportThread({
        threadJSON: resp.data,
        includeCitations: !!includeCitations,
      });

      try {
        await navigator.clipboard.writeText(output);

        setSaveButtonText(
          <>
            <Check className="tw-mr-1 tw-size-4" />
            <span>Copied</span>
          </>,
        );
      } catch (e) {
        toast({
          title: "⚠️ Error",
          description: "The document must be focused to copy the text.",
          timeout: 1000,
        });
      }
    },
    [refetch, setSaveButtonText],
  );

  if (!container) return null;

  return (
    <Portal container={container}>
      <DropdownMenu
        positioning={{
          placement: "top-end",
        }}
      >
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
              value={option.value}
              className="tw-flex tw-items-center tw-gap-2"
              onClick={() => {
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
      </DropdownMenu>
    </Portal>
  );
}
