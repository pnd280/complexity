import { X } from "lucide-react";
import { HTMLAttributes } from "react";

import { AnchorProps } from "@/content-script/components/ThreadToc";
import { cn } from "@/utils/cn";

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  anchorsProps: AnchorProps[];
  visible: boolean;
  isFloat: boolean;
  visibleMessageIndex: number;
  toggleVisibility: (visible: boolean) => void;
};

export default function Panel({
  anchorsProps,
  isFloat,
  visible,
  visibleMessageIndex,
  toggleVisibility,
  ...props
}: PanelProps) {
  return (
    <div {...props}>
      <div className="custom-scrollbar tw-flex tw-max-h-[50dvh] tw-min-w-[150px] tw-max-w-[250px] tw-flex-col tw-gap-1 tw-overflow-auto">
        {anchorsProps?.map((anchorProps, index) => (
          <div
            key={index}
            className={cn(
              "tw-group tw-flex tw-cursor-pointer tw-items-center tw-space-x-2 tw-text-sm",
              {
                "tw-mr-6": visible && isFloat && index === 0,
              },
            )}
            onClick={anchorProps.onClick}
            onContextMenu={(e) => {
              e.preventDefault();
              anchorProps.onContextMenu();
            }}
          >
            <div
              className={cn(
                "tw-h-5 tw-w-[.1rem] tw-rounded-md tw-bg-muted tw-transition-colors tw-duration-300 tw-ease-in-out",
                {
                  "!tw-bg-accent-foreground": index === visibleMessageIndex,
                },
              )}
            />
            <div
              className={cn(
                "tw-w-full tw-cursor-pointer tw-select-none tw-truncate tw-text-foreground-darker tw-transition-colors tw-duration-300 tw-ease-in-out group-hover:tw-text-muted-foreground",
                {
                  "!tw-text-foreground": index === visibleMessageIndex,
                },
              )}
            >
              {anchorProps.title}
            </div>
          </div>
        ))}
      </div>
      {isFloat && visible && (
        <div
          className={cn(
            "tw-absolute tw-right-1 tw-top-1 tw-transition-colors tw-duration-300 active:tw-scale-95",
          )}
          onClick={() => {
            toggleVisibility(false);
          }}
        >
          <X className="tw-h-5 tw-w-5 tw-cursor-pointer tw-text-muted-foreground tw-transition-colors hover:!tw-text-foreground" />
        </div>
      )}
    </div>
  );
}
