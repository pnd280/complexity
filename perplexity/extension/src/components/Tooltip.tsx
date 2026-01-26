import type { Tooltip as ArkTooltip } from "@ark-ui/react";
import type { ReactNode, RefObject } from "react";

import {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export type TooltipProps = {
  children: ReactNode;
  disabled?: boolean;
  content: ReactNode;
  className?: string;
  positioning?: ArkTooltip.RootProps["positioning"];
  defaultOpen?: boolean;
  portal?: boolean;
  ref?: RefObject<HTMLSpanElement>;
  onOpenChange?: (open: boolean) => void;
};

export default function Tooltip({
  children,
  disabled,
  content,
  className,
  positioning,
  defaultOpen,
  portal = true,
  ref,
  onOpenChange,
}: TooltipProps) {
  return (
    <TooltipRoot
      lazyMount={true}
      openDelay={0}
      closeDelay={0}
      positioning={{
        placement: "top",
        ...positioning,
      }}
      disabled={disabled}
      defaultOpen={defaultOpen}
      onOpenChange={(details) => onOpenChange?.(details.open)}
    >
      <TooltipTrigger asChild>
        <span ref={ref} className={className}>
          {children}
        </span>
      </TooltipTrigger>
      {!(typeof content === "string" && content.length === 0) && (
        <TooltipContent asChild portal={portal}>
          <div className="x:font-medium">{content}</div>
        </TooltipContent>
      )}
    </TooltipRoot>
  );
}
