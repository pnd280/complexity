import { Slot } from "@radix-ui/react-slot";
import { Command as CommandPrimitive } from "cmdk";
import type { ComponentProps } from "react";
import * as React from "react";

import type { DialogProps } from "@/components/ui/dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import TablerSearch from "~icons/tabler/search";

export function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn(
        "x:flex x:h-full x:w-full x:flex-col x:overflow-hidden x:rounded-lg x:bg-popover x:text-popover-foreground",
        className,
      )}
      {...props}
    />
  );
}

type CommandDialogProps = DialogProps & {
  commandProps?: React.ComponentProps<typeof CommandPrimitive>;
  dialogContentProps?: React.ComponentProps<typeof DialogContent>;
};

export function CommandDialog({
  children,
  commandProps,
  dialogContentProps,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog lazyMount unmountOnExit closeOnInteractOutside {...props}>
      <DialogContent
        closeButton={false}
        {...dialogContentProps}
        className={cn(
          "x:overflow-hidden x:p-0 x:shadow-lg",
          dialogContentProps?.className,
        )}
      >
        <Command
          filter={(value, search, keywords) => {
            const extendValue = value + " " + (keywords?.join(" ") || "");
            if (extendValue.includes(search)) return 1;
            return 0;
          }}
          {...commandProps}
          className={cn(
            "x:[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 x:[&_[cmdk-input-wrapper]_svg]:h-4 x:[&_[cmdk-input-wrapper]_svg]:w-4 x:[&_[cmdk-item]_svg]:h-4 x:[&_[cmdk-item]_svg]:w-4 x:**:[[cmdk-group-heading]]:px-2 x:**:[[cmdk-group-heading]]:font-medium x:**:[[cmdk-group-heading]]:text-muted-foreground x:**:[[cmdk-group]]:px-2 x:**:[[cmdk-input]]:h-12",
            commandProps?.className,
          )}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function CommandInput({
  className,
  inputClassName,
  searchIcon = true,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input> & {
  inputClassName?: string;
  searchIcon?: boolean | React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "x:flex x:items-center x:border-b x:border-border/50 x:px-3",
        className,
      )}
      // eslint-disable-next-line react/no-unknown-property
      cmdk-input-wrapper=""
    >
      <CommandPrimitive.Input
        className={cn(
          "x:flex x:h-11 x:w-full x:rounded-lg x:bg-transparent x:py-3 x:text-sm x:outline-none x:placeholder:text-muted-foreground x:disabled:cursor-not-allowed x:disabled:opacity-50",
          inputClassName,
        )}
        {...props}
      />
      {typeof searchIcon === "boolean" && searchIcon && (
        <TablerSearch className="x:mr-2 x:h-4 x:w-4 x:shrink-0 x:opacity-50" />
      )}
      {React.isValidElement(searchIcon) && searchIcon}
    </div>
  );
}

export function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn(
        "custom-scrollbar",
        "x:scroll-pt-2 x:scroll-pb-2 x:overflow-x-hidden x:overflow-y-auto",
        className,
      )}
      {...props}
    />
  );
}

export function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      className={cn("x:py-6 x:text-center x:text-sm", className)}
      {...props}
    />
  );
}

export function CommandGroup({
  className,
  heading,
  rightAttributes,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group> & {
  rightAttributes?: React.ReactNode;
}) {
  return (
    <CommandPrimitive.Group
      className={cn(
        "x:overflow-hidden x:p-1 x:text-foreground x:[&:has([cmdk-group-items]:empty)]:hidden x:**:[[cmdk-group-heading]]:px-2 x:**:[[cmdk-group-heading]]:py-1.5 x:**:[[cmdk-group-heading]]:text-xs x:**:[[cmdk-group-heading]]:font-medium x:**:[[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
      heading={
        heading != null && (
          <div className="x:flex x:items-center x:justify-between x:font-medium x:text-muted-foreground">
            {typeof heading === "string" ? (
              <div className="x:text-xs">{heading}</div>
            ) : (
              heading
            )}
            {rightAttributes}
          </div>
        )
      }
      {...props}
    />
  );
}

export function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      className={cn("x:-mx-1 x:h-px x:bg-border", className)}
      {...props}
    />
  );
}

export function CommandItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "x:group x:relative x:flex x:cursor-pointer x:items-center x:rounded-lg x:px-2 x:py-2 x:text-sm x:text-foreground x:outline-none x:select-none x:aria-selected:bg-foreground-subtle x:aria-selected:text-foreground x:data-[disabled=true]:pointer-events-none x:data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </CommandPrimitive.Item>
  );
}

export function CommandItemIcon({
  className,
  asChild,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "div";

  return <Comp className={cn("x:mr-2 x:size-4", className)} {...props} />;
}

export function CommandItemTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  if (typeof children === "string") {
    return (
      <span className={cn("x:truncate", className)} {...props}>
        {children}
      </span>
    );
  }

  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function CommandItemRightAttributes({
  className,
  asChild,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-right-attributes
      className={cn(
        "x:ml-auto x:group-has-data-alt-right-attributes:group-aria-selected:hidden",
        className,
      )}
      {...props}
    />
  );
}

export function CommandItemAlternateRightAttributes({
  className,
  asChild,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-alt-right-attributes
      className={cn(
        "x:ml-auto x:hidden x:group-aria-selected:block",
        className,
      )}
      {...props}
    />
  );
}

export function CommandShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "x:ml-auto x:text-xs x:tracking-widest x:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function CommandItemSkeleton({
  count,
  className,
  ...props
}: ComponentProps<"div"> & {
  count: number;
}) {
  return (
    <div className="x:flex x:flex-col x:gap-3 x:px-3 x:py-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "x:h-8 x:w-full x:animate-pulse x:rounded-lg x:bg-muted",
            className,
          )}
          {...props}
        />
      ))}
    </div>
  );
}
