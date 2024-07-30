import { Menu, Portal } from "@ark-ui/react";
import { ChevronRight } from "lucide-react";
import { forwardRef } from "react";
import type { ElementRef } from "react";

import { cn } from "@/utils/cn";

function DropdownMenu({ ...props }: Menu.RootProps) {
  return <Menu.Root unmountOnExit={false} lazyMount={true} {...props} />;
}

const DropdownMenuTrigger = forwardRef<
  ElementRef<typeof Menu.Trigger>,
  Menu.TriggerProps
>(({ className, ...props }, ref) => (
  <Menu.Trigger
    ref={ref}
    className={cn(
      "tw-inline-flex tw-items-center tw-justify-center",
      className,
    )}
    {...props}
  />
));

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = forwardRef<
  ElementRef<typeof Menu.Content>,
  Menu.ContentProps
>(({ className, ...props }, ref) => (
  <Portal>
    <Menu.Positioner>
      <Menu.Content
        ref={ref}
        className={cn(
          "tw-z-50 tw-min-w-[8rem] tw-overflow-hidden tw-rounded-md tw-border tw-bg-popover tw-p-1 tw-text-popover-foreground tw-shadow-md focus-visible:tw-outline-none",
          "data-[state=open]:tw-animate-in data-[state=open]:tw-fade-in data-[state=open]:tw-zoom-in-95",
          "data-[state=closed]:tw-animate-out data-[state=closed]:tw-fade-out data-[state=closed]:tw-zoom-out-95",
          "data-[placement^=top]:tw-slide-in-from-bottom-2",
          "data-[placement^=bottom]:tw-slide-in-from-top-2",
          "data-[placement^=left]:tw-slide-in-from-right-2",
          "data-[placement^=right]:tw-slide-in-from-left-2",
          className,
        )}
        {...props}
      />
    </Menu.Positioner>
  </Portal>
));

DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = forwardRef<
  ElementRef<typeof Menu.Item>,
  Menu.ItemProps & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <Menu.Item
    ref={ref}
    className={cn(
      "tw-relative tw-flex tw-cursor-default tw-select-none tw-items-center tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-sm tw-outline-none tw-transition-colors focus:tw-bg-accent focus:tw-text-accent-foreground data-[disabled]:tw-pointer-events-none data-[highlighted]:tw-bg-accent data-[highlighted]:tw-text-accent-foreground data-[disabled]:tw-opacity-50",
      inset && "tw-pl-8",
      className,
    )}
    {...props}
  />
));

DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuGroup = Menu.ItemGroup;

const DropdownMenuLabel = forwardRef<
  ElementRef<typeof Menu.ItemGroupLabel>,
  Menu.ItemGroupLabelProps & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <Menu.ItemGroupLabel
    ref={ref}
    className={cn(
      "tw-px-2 tw-py-1.5 tw-text-sm tw-text-muted-foreground",
      inset && "tw-pl-8",
      className,
    )}
    {...props}
  />
));

DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof Menu.Separator>,
  Menu.SeparatorProps
>(({ className, ...props }, ref) => (
  <Menu.Separator
    ref={ref}
    className={cn("tw--mx-1 tw-my-1 tw-h-px tw-bg-muted", className)}
    {...props}
  />
));

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

function DropdownMenuSub({ ...props }: Menu.RootProps) {
  return (
    <Menu.Root
      unmountOnExit={false}
      lazyMount={true}
      positioning={{
        placement: "right-start",
      }}
      {...props}
    />
  );
}

const DropdownMenuSubTrigger = forwardRef<
  ElementRef<typeof Menu.TriggerItem>,
  Menu.TriggerItemProps & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <Menu.TriggerItem
    ref={ref}
    className={cn(
      "tw-flex tw-cursor-default tw-select-none tw-items-center tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-sm tw-outline-none focus:tw-bg-accent data-[highlighted]:tw-bg-accent data-[state=open]:tw-bg-accent",
      inset && "tw-pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="tw-ml-auto tw-h-4 tw-w-4" />
  </Menu.TriggerItem>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
};
