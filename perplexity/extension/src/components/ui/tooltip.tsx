import { Portal } from "@ark-ui/react/portal";
import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";
import React, { type ComponentProps } from "react";

export function TooltipRoot({ ...props }: ArkTooltip.RootProps) {
  return <ArkTooltip.Root unmountOnExit={false} lazyMount={true} {...props} />;
}

export function TooltipTrigger({
  ...props
}: ComponentProps<typeof ArkTooltip.Trigger>) {
  return (
    <ArkTooltip.Context>
      {({ setOpen }) => (
        <ArkTooltip.Trigger onTouchStart={() => setOpen(true)} {...props} />
      )}
    </ArkTooltip.Context>
  );
}

export function TooltipContent({
  className,
  portal,
  ...props
}: ComponentProps<typeof ArkTooltip.Content> & {
  portal: boolean;
}) {
  const Comp = portal ? Portal : React.Fragment;

  return (
    <Comp>
      <ArkTooltip.Positioner>
        <ArkTooltip.Content
          className={cn(
            "x:z-50 x:max-w-[400px] x:overflow-hidden x:rounded-md x:border x:border-foreground-subtle x:bg-dark x:px-2 x:py-1 x:font-sans x:text-xs x:whitespace-pre-line x:text-popover x:shadow-md x:duration-150 x:dark:bg-background x:dark:text-popover-foreground",
            "x:data-[state=closed]:animate-out x:data-[state=open]:animate-in",
            "x:data-[state=closed]:fade-out-0 x:data-[state=open]:fade-in-0",
            "x:data-[state=closed]:zoom-out-95 x:data-[state=open]:zoom-in-95",
            "x:data-[state=open]:data-[placement^=bottom]:slide-in-from-top-2 x:data-[state=open]:data-[placement^=left]:slide-in-from-right-2",
            "x:data-[state=open]:data-[placement^=right]:slide-in-from-left-2 x:data-[state=open]:data-[placement^=top]:slide-in-from-bottom-2",
            "x:data-[placement^=bottom]:origin-top x:data-[placement^=left]:origin-right",
            "x:data-[placement^=right]:origin-left x:data-[placement^=top]:origin-bottom",
            className,
          )}
          {...props}
        />
      </ArkTooltip.Positioner>
    </Comp>
  );
}
