import { Popover as ArkPopover, Portal } from "@ark-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { createContext, ElementRef, forwardRef, useContext } from "react";

import { cn } from "@/utils/cn";

type PopoverLocalContext = {
  portal: boolean;
};

const PopoverLocalContext = createContext<PopoverLocalContext>({
  portal: true,
});

const SelectLocalContextProvider = PopoverLocalContext.Provider;

const Popover = ({
  portal,
  ...props
}: ArkPopover.RootProps & {
  portal?: boolean;
}) => {
  return (
    <SelectLocalContextProvider
      value={{
        portal: portal ?? true,
      }}
    >
      <ArkPopover.Root unmountOnExit={true} lazyMount={true} {...props} />
    </SelectLocalContextProvider>
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
  const { portal } = useContext(PopoverLocalContext);

  if (typeof portal === "undefined") {
    throw new Error("PopoverContent must be a child of Popover");
  }

  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkPopover.Positioner>
        <ArkPopover.Content
          ref={ref}
          className={cn(
            "tw-z-50 tw-w-max tw-rounded-md tw-border tw-bg-popover tw-p-4 tw-text-popover-foreground tw-shadow-md focus-visible:tw-outline-none",
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
    </Comp>
  );
});

PopoverContent.displayName = "PopoverContent";

const PopoverContext = ArkPopover.Context;

export { Popover, PopoverTrigger, PopoverContent, PopoverContext };
