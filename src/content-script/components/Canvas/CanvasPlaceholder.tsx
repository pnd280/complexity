import { LoaderCircle } from "lucide-react";

import useRenderInCanvas from "@/content-script/hooks/useRenderInCanvas";
import { CanvasLang } from "@/utils/Canvas";
import { cn } from "@/utils/cn";

import { canvasPlaceholders } from "./";

type CanvasPlaceholderProps = React.HTMLAttributes<HTMLDivElement> & {
  preBlockId: string;
  lang: CanvasLang;
};

export default function CanvasPlaceholder({
  preBlockId,
  lang,
  className,
  ...props
}: CanvasPlaceholderProps) {
  const { title, description, icon } = canvasPlaceholders[lang];

  const { isActive, handleRender } = useRenderInCanvas({
    preBlockId,
  });

  return (
    <div
      className={cn(
        `canvas-placeholder tw-absolute tw-inset-0 tw-z-10 tw-flex tw-size-full tw-w-[300px] tw-cursor-pointer tw-select-none tw-items-center tw-overflow-hidden tw-rounded-md tw-border tw-transition-all tw-duration-300 tw-animate-in tw-fade-in-50 active:tw-scale-95 ${preBlockId}-inflight-indicator tw-group`,
        {
          "!tw-border-accent-foreground": isActive,
          "hover:!tw-border-foreground-darker": !isActive,
        },
        className,
      )}
      onClick={handleRender}
      {...props}
    >
      <div className="tw-flex tw-aspect-square tw-h-full tw-items-center tw-justify-center tw-border-r tw-bg-secondary">
        <div
          className={cn('tw-hidden group-data-[inflight="false"]:tw-block', {
            "[&>*]:tw-text-accent-foreground": isActive,
          })}
        >
          {icon}
        </div>
        <div className='group-data-[inflight="false"]:tw-hidden'>
          <LoaderCircle className="tw-size-4 tw-animate-spin tw-text-accent-foreground" />
        </div>
      </div>
      <div className="tw-ml-4 tw-flex tw-flex-col">
        <div
          className={cn("tw-text-base tw-font-medium tw-transition-colors", {
            "tw-text-accent-foreground": isActive,
            "tw-text-foreground": !isActive,
          })}
        >
          {title}
        </div>
        <div className='tw-hidden tw-font-sans tw-text-[.8rem] tw-text-muted-foreground group-data-[inflight="false"]:tw-block'>
          {description}
        </div>
        <div className='tw-animate-pulse tw-font-sans tw-text-[.8rem] tw-text-muted-foreground group-data-[inflight="false"]:tw-hidden'>
          Generating...
        </div>
      </div>
    </div>
  );
}
