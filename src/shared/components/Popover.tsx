import { Popover as ArkPopover } from "@ark-ui/react";
import { ElementRef, forwardRef } from "react";

import { cn } from "@/utils/cn";

const Popover = ({ ...props }: ArkPopover.RootProps) => {
  return (
    <ArkPopover.Root
      unmountOnExit={false}
      lazyMount={true}
      {...props}
    />
  );
};

Popover.displayName = "Popover";

const PopoverTrigger = forwardRef<
  ElementRef<typeof ArkPopover.Trigger>,
  ArkPopover.TriggerProps
>(({ ...props }, ref) => {
  return <ArkPopover.Trigger ref={ref} {...props} />;
});

PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = forwardRef<
  ElementRef<typeof ArkPopover.Content>,
  ArkPopover.ContentProps
>(({ className, ...props }, ref) => {
  return (
    <ArkPopover.Positioner>
      <ArkPopover.Content
        ref={ref}
        className={cn(
          "tw-z-50 tw-w-72 tw-rounded-md tw-border tw-bg-popover tw-p-4 tw-text-popover-foreground tw-shadow-md focus-visible:tw-outline-none",
          "data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out",
          "data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0",
          "data-[state=closed]:tw-zoom-out-95 data-[state=open]:tw-zoom-in-95",
          "data-[side=bottom]:tw-slide-in-from-top-2 data-[side=left]:tw-slide-in-from-right-2",
          "data-[side=right]:tw-slide-in-from-left-2 data-[side=top]:tw-slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </ArkPopover.Positioner>
  );
});

PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
