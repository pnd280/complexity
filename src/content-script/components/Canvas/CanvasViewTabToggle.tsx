import { Check, CodeXml, Copy } from "lucide-react";

import { useCanvasStore } from "@/content-script/session-store/canvas";
import useToggleButtonText from "@/shared/hooks/useToggleButtonText";
import { cn } from "@/utils/cn";

export default function CanvasViewTabToggle() {
  const { metaData, showCode, toggleShowCode } = useCanvasStore(
    (state) => state,
  );

  const [copyButtonText, setCopyButtonText] = useToggleButtonText({
    defaultText: <Copy className="tw-size-4" />,
  });

  if (!metaData) return null;

  return (
    <div className="tw-flex tw-items-center tw-opacity-50 tw-transition-opacity hover:tw-opacity-100">
      <div className="tw-m-2 tw-flex tw-rounded-lg tw-bg-background tw-p-1 tw-font-sans tw-text-xs">
        <div
          className={cn(
            "tw-cursor-pointer tw-select-none tw-rounded-md tw-p-1 tw-px-2 tw-transition-all",
            {
              "tw-bg-accent": !showCode,
            },
          )}
          onClick={() => toggleShowCode()}
        >
          Preview
        </div>
        <div
          className={cn(
            "tw-flex tw-cursor-pointer tw-select-none tw-items-center tw-gap-1 tw-rounded-md tw-p-1 tw-px-2 tw-transition-all",
            {
              "tw-bg-accent": showCode,
            },
          )}
          onClick={() => toggleShowCode()}
        >
          <CodeXml className="tw-size-3" />
          <span className="tw-leading-none">Code</span>
        </div>
      </div>
      {showCode && (
        <div
          className="tw-h-fit tw-cursor-pointer tw-rounded-md tw-p-2 tw-transition-all tw-animate-in tw-fade-in hover:tw-bg-background active:tw-scale-95"
          onClick={() => {
            navigator.clipboard.writeText(metaData.content);

            setCopyButtonText(<Check className="tw-size-4" />);
          }}
        >
          {copyButtonText}
        </div>
      )}
    </div>
  );
}
