import { HoverCard as ArkHoverCard } from "@ark-ui/react/hover-card";
import { Slot } from "@radix-ui/react-slot";

import { Portal } from "@/components/ui/portal";

export const HoverCardRootProvider = ArkHoverCard.RootProvider;

type HoverCardLocalContext = {
  portal: boolean;
};

export const HoverCardLocalContext = createContext<HoverCardLocalContext>({
  portal: true,
});

export function HoverCard({
  portal,
  ...props
}: ArkHoverCard.RootProps & {
  portal?: boolean;
}) {
  return (
    <HoverCardLocalContext
      value={{
        portal: portal ?? true,
      }}
    >
      <ArkHoverCard.Root unmountOnExit={true} lazyMount={true} {...props} />
    </HoverCardLocalContext>
  );
}

export function HoverCardTrigger({ ...props }: ArkHoverCard.TriggerProps) {
  return <ArkHoverCard.Trigger {...props} />;
}

export function HoverCardContent({
  className,
  ...props
}: ArkHoverCard.ContentProps) {
  const { portal } = use(HoverCardLocalContext);

  if (typeof portal === "undefined") {
    throw new Error("HoverCardContent must be a child of HoverCard");
  }

  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkHoverCard.Positioner>
        <ArkHoverCard.Content
          className={cn(
            "x:bg-hoverCard x:z-50 x:w-max x:rounded-xl x:border x:border-border/50 x:bg-popover x:p-4 x:text-foreground x:shadow-md x:focus-visible:outline-none",
            "x:data-[state=closed]:animate-out x:data-[state=open]:animate-in",
            "x:data-[state=closed]:fade-out-0 x:data-[state=open]:fade-in-0",
            "x:data-[state=closed]:zoom-out-95 x:data-[state=open]:zoom-in-95",
            "x:data-[placement^=bottom]:origin-top x:data-[placement^=left]:origin-right",
            "x:data-[placement^=right]:origin-left x:data-[placement^=top]:origin-bottom",
            className,
          )}
          {...props}
        />
      </ArkHoverCard.Positioner>
    </Comp>
  );
}

export const HoverCardContext = ArkHoverCard.Context;
