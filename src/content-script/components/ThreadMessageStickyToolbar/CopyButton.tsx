import { useQuery } from "@tanstack/react-query";
import $ from "jquery";
import { Check, Copy, LoaderCircle, Unlink } from "lucide-react";
import { useCallback } from "react";
import { FaMarkdown } from "react-icons/fa";

import PPLXApi from "@/services/PPLXApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/shadcn/ui/dropdown-menu";
import { toast } from "@/shared/components/shadcn/ui/use-toast";
import Tooltip from "@/shared/components/Tooltip";
import useCtrlDown from "@/shared/hooks/useCtrlDown";
import useToggleButtonText from "@/shared/hooks/useToggleButtonText";
import { jsonUtils } from "@/utils/utils";

import { Container } from "./ThreadMessageStickyToolbar";

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
      PPLXApi.fetchThreadInfo(window.location.pathname.split("/").pop() || ""),
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
      ".mt-sm.flex.items-center.justify-between",
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

  const handleCopyStrippedMessage = useCallback(async () => {
    const answer = await processMessage(containerIndex);

    try {
      await navigator.clipboard.writeText(answer);

      setCopyButtonText(<Check className="tw-size-4" />);
    } catch (e) {
      toast({
        title: "⚠️ Error",
        description: "The document must be focused to copy the text.",
        timeout: 1000,
      });
    }

    async function processMessage(containerIndex: number): Promise<string> {
      const result = await refetch();

      if (!result.data || !result.data[containerIndex]) return "";

      const message = result.data[containerIndex];
      const messageText = jsonUtils.safeParse(message.text);
      const isProSearch = Array.isArray(messageText);

      let answer =
        messageText?.answer ||
        jsonUtils.safeParse(
          messageText?.[messageText.length - 1]?.content?.answer,
        )?.answer;

      const webResults = isProSearch
        ? messageText.find((x) => x.step_type === "SEARCH_RESULTS")?.content
            ?.web_results
        : jsonUtils.safeParse(message.text)?.web_results;

      webResults?.forEach((_: unknown, index: number) => {
        const findText = `\\[${index + 1}\\]`;
        answer = answer.replace(new RegExp(findText, "g"), "");
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
          className="tw-flex tw-items-center tw-gap-2"
          onSelect={() => {
            handleCopyMessage();
          }}
        >
          <FaMarkdown className="tw-size-4" />
          Default
        </DropdownMenuItem>
        <DropdownMenuItem
          className="tw-flex tw-items-center tw-gap-2"
          onSelect={() => {
            handleCopyStrippedMessage();
          }}
        >
          <Unlink className="tw-size-4" />
          Without citations
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
