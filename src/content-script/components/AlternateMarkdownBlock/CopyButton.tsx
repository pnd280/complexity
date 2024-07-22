import { Check, Copy } from "lucide-react";

import useToggleButtonText from "@/shared/hooks/useToggleButtonText";
import { stripHtml } from "@/utils/utils";

export default function CopyButton({ $pre }: { $pre: JQuery<HTMLElement> }) {
  const [copyButtonText, setCopyButtonText] = useToggleButtonText({
    defaultText: <Copy className="tw-size-4" />,
  });

  return (
    <div
      className="tw-cursor-pointer tw-text-muted-foreground tw-transition-all hover:tw-text-foreground active:tw-scale-95"
      onClick={() => {
        if ($pre.parents().eq(1).attr("id") === "markdown-query-wrapper") {
          navigator.clipboard.writeText(stripHtml($pre.find("code").text()));
        } else {
          const $copyButton = $pre.parent().find("button");
          requestAnimationFrame(() => {
            $copyButton.addClass("!tw-hidden");
          });
          $copyButton.trigger("click");
        }

        setCopyButtonText(<Check className="tw-size-4" />);
      }}
    >
      {copyButtonText}
    </div>
  );
}
