import { useQuery } from "@tanstack/react-query";
import $ from "jquery";
import { Check, Copy, LoaderCircle, Unlink } from "lucide-react";
import { useCallback } from "react";
import { FaMarkdown } from "react-icons/fa";

import { Container } from "@/content-script/components/ThreadMessageStickyToolbar";
import PplxApi from "@/services/PplxApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/DropdownMenu";
import Tooltip from "@/shared/components/Tooltip";
import useCtrlDown from "@/shared/hooks/useCtrlDown";
import useToggleButtonText from "@/shared/hooks/useToggleButtonText";
import { toast } from "@/shared/toast";
import { DomSelectors } from "@/utils/DomSelectors";
import ThreadExport from "@/utils/ThreadExport";

type CopyButtonProps = {
  container: Container;
  containerIndex: number;
};

export default function CopyButton({
  container,
  containerIndex,
}: CopyButtonProps) {
  const { refetch, isFetching: isFetchingCurrentThreadInfo } = useQuery({
    queryKey: ["currentThreadInfo"],
    queryFn: () =>
      PplxApi.fetchThreadInfo(window.location.pathname.split("/").pop() || ""),
    enabled: false,
  });

  const ctrlDown = useCtrlDown();

  const [copyButtonText, setCopyButtonText] = useToggleButtonText({
    defaultText: (
      <Copy className="tw-size-4 tw-text-muted-foreground tw-transition-all group-hover:tw-text-foreground" />
    ),
  });

  const handleCopyMessage = useCallback(() => {
    const $buttonBar = $(container.messageBlock).find(
      DomSelectors.THREAD.MESSAGE.BOTTOM_BAR,
    );

    const $button = $buttonBar
      .children()
      .last()
      .children()
      .find('div:has([data-icon="clipboard"])');

    if (!$button.length) return;

    $button.trigger("click");

    setCopyButtonText(<Check className="tw-size-4" />);
  }, [container.messageBlock, setCopyButtonText]);

  const handleCopyMessageWithoutCitations = useCallback(async () => {
    const resp = await refetch();

    if (resp == null || !resp.data) return;

    const threadJSON = resp.data;

    const output = ThreadExport.exportThread({
      threadJSON,
      includeCitations: false,
      messageIndex: containerIndex,
    });

    try {
      await navigator.clipboard.writeText(output);

      setCopyButtonText(<Check className="tw-size-4" />);
    } catch (e) {
      toast({
        title: "⚠️ Error",
        description: "The document must be focused to copy the text.",
        timeout: 1000,
      });
    }
  }, [containerIndex, refetch, setCopyButtonText]);

  return (
    <DropdownMenu
      positioning={{
        placement: "bottom",
      }}
    >
      <DropdownMenuTrigger
        onClick={(e) => {
          if (ctrlDown) {
            e.preventDefault();
            handleCopyMessage();
          }
        }}
      >
        <Tooltip content="Copy Message">
          <div className="tw-group tw-cursor-pointer tw-rounded-md tw-p-1 tw-text-secondary-foreground tw-transition-all tw-animate-in tw-fade-in hover:tw-bg-secondary active:tw-scale-95">
            {isFetchingCurrentThreadInfo ? (
              <LoaderCircle className="tw-size-4 tw-animate-spin" />
            ) : (
              copyButtonText
            )}
          </div>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          value="default"
          className="tw-flex tw-items-center tw-gap-2"
          onClick={() => {
            handleCopyMessage();
          }}
        >
          <FaMarkdown className="tw-size-4" />
          Default
        </DropdownMenuItem>
        <DropdownMenuItem
          value="without-citations"
          className="tw-flex tw-items-center tw-gap-2"
          onClick={() => {
            handleCopyMessageWithoutCitations();
          }}
        >
          <Unlink className="tw-size-4" />
          Without citations
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
