import { HoverCard as ArkHoverCard, Portal } from "@ark-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { createContext, ElementRef, forwardRef, useContext } from "react";

import { cn } from "@/utils/cn";

type HoverCardLocalContext = {
  portal: boolean;
};

const HoverCardLocalContext = createContext<HoverCardLocalContext>({
  portal: true,
});

const SelectLocalContextProvider = HoverCardLocalContext.Provider;

const HoverCard = ({
  portal,
  ...props
}: ArkHoverCard.RootProps & {
  portal?: boolean;
}) => {
  return (
    <SelectLocalContextProvider
      value={{
        portal: portal ?? true,
      }}
    >
      <ArkHoverCard.Root unmountOnExit={true} lazyMount={true} {...props} />
    </SelectLocalContextProvider>
  );
};

HoverCard.displayName = "HoverCard";

const HoverCardTrigger = forwardRef<
  ElementRef<typeof ArkHoverCard.Trigger>,
  ArkHoverCard.TriggerProps
>(({ ...props }, ref) => {
  return <ArkHoverCard.Trigger ref={ref} {...props} />;
});

HoverCardTrigger.displayName = "HoverCardTrigger";

const HoverCardContent = forwardRef<
  ElementRef<typeof ArkHoverCard.Content>,
  ArkHoverCard.ContentProps
>(({ className, ...props }, ref) => {
  const { portal } = useContext(HoverCardLocalContext);

  if (typeof portal === "undefined") {
    throw new Error("HoverCardContent must be a child of HoverCard");
  }

  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkHoverCard.Positioner>
        <ArkHoverCard.Content
          ref={ref}
          className={cn(
            "tw-bg-hoverCard tw-text-hoverCard-foreground tw-z-50 tw-w-max tw-rounded-md tw-border tw-bg-popover tw-p-4 tw-shadow-md focus-visible:tw-outline-none",
            "data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out",
            "data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0",
            "data-[state=closed]:tw-zoom-out-95 data-[state=open]:tw-zoom-in-95",
            "data-[side=bottom]:tw-slide-in-from-top-2 data-[side=left]:tw-slide-in-from-right-2",
            "data-[side=right]:tw-slide-in-from-left-2 data-[side=top]:tw-slide-in-from-bottom-2",
            className,
          )}
          {...props}
        />
      </ArkHoverCard.Positioner>
    </Comp>
  );
});

HoverCardContent.displayName = "HoverCardContent";

const HoverCardContext = ArkHoverCard.Context;

export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardContext };
