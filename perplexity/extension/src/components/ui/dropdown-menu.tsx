import { Menu } from "@ark-ui/react/menu";
import { Fragment, type HTMLAttributes } from "react";

import { Portal } from "@/components/ui/portal";

import TablerChevronRight from "~icons/tabler/chevron-right";

export const DropdownMenuRootProvider = Menu.RootProvider;

export function DropdownMenu({ ...props }: Menu.RootProps) {
  return <Menu.Root unmountOnExit={false} lazyMount={true} {...props} />;
}

export const DropdownMenuContext = Menu.Context;

export function DropdownMenuTrigger({
  className,
  ...props
}: Menu.TriggerProps) {
  return <Menu.Trigger className={cn(className)} {...props} />;
}

export function DropdownMenuContent({
  portal = true,
  className,
  ...props
}: Menu.ContentProps & { portal?: boolean }) {
  const Comp = portal ? Portal : Fragment;

  return (
    <Comp>
      <Menu.Positioner>
        <Menu.Content
          className={cn(
            "x:z-50 x:min-w-[8rem] x:overflow-hidden x:rounded-xl x:border x:border-border/50 x:bg-popover x:p-2 x:text-popover-foreground x:shadow-md x:focus-visible:outline-none",
            "x:data-[state=open]:animate-in x:data-[state=open]:fade-in x:data-[state=open]:zoom-in-95",
            "x:data-[state=closed]:animate-out x:data-[state=closed]:fade-out x:data-[state=closed]:zoom-out-95",
            "x:data-[placement^=bottom]:origin-top x:data-[placement^=left]:origin-right",
            "x:data-[placement^=right]:origin-left x:data-[placement^=top]:origin-bottom",
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Comp>
  );
}

export function DropdownMenuItem({
  className,
  inset,
  ...props
}: Menu.ItemProps & { inset?: boolean }) {
  return (
    <Menu.Item
      className={cn(
        "x:relative x:flex x:cursor-default x:items-center x:rounded-sm x:px-2 x:py-1.5 x:text-sm x:transition-colors x:outline-none x:select-none x:focus:bg-primary-foreground x:focus:text-primary x:data-[disabled]:pointer-events-none x:data-[disabled]:opacity-50 x:data-[highlighted]:bg-secondary",
        inset && "x:pl-8",
        className,
      )}
      {...props}
    />
  );
}

export const DropdownMenuGroup = Menu.ItemGroup;

export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: Menu.ItemGroupLabelProps & { inset?: boolean }) {
  return (
    <Menu.ItemGroupLabel
      className={cn(
        "x:px-2 x:py-1.5 x:text-xs x:text-muted-foreground",
        inset && "x:pl-8",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: Menu.SeparatorProps) {
  return (
    <Menu.Separator
      className={cn("x:-mx-1 x:my-1 x:h-px x:bg-muted", className)}
      {...props}
    />
  );
}

export function DropdownMenuSub({ ...props }: Menu.RootProps) {
  return (
    <Menu.Root
      unmountOnExit={false}
      lazyMount={true}
      positioning={{
        placement: "right-start",
        offset: {
          mainAxis: 15,
        },
      }}
      {...props}
    />
  );
}

export function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: Menu.TriggerItemProps) {
  return (
    <Menu.TriggerItem
      className={cn(
        "x:relative x:flex x:cursor-default x:items-center x:justify-between x:rounded-sm x:px-2 x:py-1.5 x:text-sm x:transition-colors x:outline-none x:select-none x:focus:bg-primary-foreground x:focus:text-primary x:data-[disabled]:pointer-events-none x:data-[disabled]:opacity-50 x:data-[highlighted]:bg-secondary x:data-[highlighted]:text-secondary-foreground",
        className,
      )}
      {...props}
    >
      <div className="x:mr-2 x:flex x:items-center">{children}</div>
      <TablerChevronRight className="x:size-4" />
    </Menu.TriggerItem>
  );
}

export function DropdownMenuShortcut({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  ref: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className={cn(
        "x:ml-auto x:inline x:text-xs x:tracking-widest x:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
