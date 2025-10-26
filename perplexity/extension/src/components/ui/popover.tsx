import { Popover as ArkPopover } from "@ark-ui/react/popover";
import { Slot } from "@radix-ui/react-slot";
import type { RefObject } from "react";

import { Portal } from "@/components/ui/portal";
import { untrapWheel } from "@/utils/dom-utils/generics";

export const PopoverRootProvider = ArkPopover.RootProvider;

export function Popover({ ...props }: ArkPopover.RootProps) {
  return <ArkPopover.Root unmountOnExit={true} lazyMount={true} {...props} />;
}

export function PopoverTrigger({ ...props }: ArkPopover.TriggerProps) {
  return <ArkPopover.Trigger {...props} />;
}

export function PopoverContent({
  className,
  portal = true,
  ref,
  ...props
}: ArkPopover.ContentProps & {
  ref?: RefObject<HTMLDivElement | null>;
  portal?: boolean;
}) {
  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkPopover.Positioner>
        <ArkPopover.Content
          ref={ref}
          className={cn(
            "x:z-10 x:w-max x:rounded-xl x:border x:border-border/50 x:bg-popover x:p-4 x:text-popover-foreground x:shadow-md x:focus-visible:outline-none",
            "x:data-[state=closed]:animate-out x:data-[state=open]:animate-in",
            "x:data-[state=closed]:fade-out-0 x:data-[state=open]:fade-in-0",
            "x:data-[state=closed]:zoom-out-95 x:data-[state=open]:zoom-in-95",
            "x:data-[placement^=bottom]:origin-top x:data-[placement^=left]:origin-right",
            "x:data-[placement^=right]:origin-left x:data-[placement^=top]:origin-bottom",
            className,
          )}
          onWheel={untrapWheel}
          {...props}
        />
      </ArkPopover.Positioner>
    </Comp>
  );
}
