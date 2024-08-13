import $ from "jquery";
import { Text } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FaMarkdown } from "react-icons/fa";
import { Updater } from "use-immer";

import {
  Container,
  ContainerStates,
} from "@/content-script/components/ThreadMessageStickyToolbar";
import Tooltip from "@/shared/components/Tooltip";
import { scrollToElement, stripHtml } from "@/utils/utils";

type FormatSwitchProps = {
  $messageEditButton: JQuery<HTMLElement>;
  containers: Container[];
  containerIndex: number;
  setContainersStates: Updater<ContainerStates[]>;
  containersStates: ContainerStates[];
};

export default function FormatSwitch({
  containers,
  containerIndex,
  containersStates,
  setContainersStates,
  $messageEditButton,
}: FormatSwitchProps) {
  const [markdownVisualDiff, setMarkdownVisualDiff] = useState(false);

  const handleVisualDiff = useCallback(() => {
    const markdownText = stripHtml(
      $(containers[containerIndex].query)
        .find(">#markdown-query-wrapper")
        .html(),
    );

    const originalText = stripHtml(
      $(containers[containerIndex].query)
        .find(">*:not(#markdown-query-wrapper)")
        .html(),
    );

    setMarkdownVisualDiff(
      !!markdownText.length &&
        !!originalText.length &&
        markdownText !== originalText,
    );
  }, [containerIndex, containers]);

  useEffect(() => {
    handleVisualDiff();
  }, [containersStates, handleVisualDiff]);

  return (
    !containersStates[containerIndex].isHidden &&
    !containersStates[containerIndex].isQueryOutOfViewport &&
    markdownVisualDiff && (
      <Tooltip
        content={
          containersStates[containerIndex].isMarkdown
            ? "Convert Query to Plain Text"
            : "Convert Query to Markdown"
        }
        positioning={{
          gutter: 15,
        }}
        className="tw-w-max"
      >
        <div
          className="tw-cursor-pointer tw-text-secondary-foreground tw-opacity-10 tw-transition-all tw-animate-in tw-fade-in tw-slide-in-from-top hover:tw-opacity-100 active:tw-scale-95"
          onClick={() => {
            if ($(containers[containerIndex].query).find("textarea").length) {
              $messageEditButton.trigger("click");
            }

            setContainersStates((draft) => {
              $(containers[containerIndex].query)
                .find(".whitespace-pre-line.break-words")
                .toggleClass("!tw-hidden", !draft[containerIndex].isMarkdown);
              $(containers[containerIndex].query)
                .find("#markdown-query-wrapper")
                .toggleClass("!tw-hidden", draft[containerIndex].isMarkdown);
              draft[containerIndex].isMarkdown =
                !draft[containerIndex].isMarkdown;
              scrollToElement(
                $(containers[containerIndex].query as unknown as Element),
                -60,
              );
            });
          }}
        >
          {containersStates[containerIndex].isMarkdown ? (
            <FaMarkdown className="tw-size-4" />
          ) : (
            <Text className="tw-size-4" />
          )}
        </div>
      </Tooltip>
    )
  );
}
