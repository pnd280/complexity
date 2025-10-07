import { Dialog as ArkDialog } from "@ark-ui/react";
import { type HTMLAttributes } from "react";
import React from "react";

import { Portal } from "@/components/ui/portal";

import TablerX from "~icons/tabler/x";

export type DialogProps = ArkDialog.RootProps;

export const Dialog = ArkDialog.Root;

export const DialogTrigger = ArkDialog.Trigger;

export const DialogClose = ArkDialog.CloseTrigger;

export function DialogOverlay({
  className,
  ...props
}: ArkDialog.BackdropProps) {
  return (
    <ArkDialog.Backdrop
      className={cn(
        "x:fixed x:inset-0 x:z-50 x:bg-black/60",
        "x:data-[state=closed]:animate-out x:data-[state=open]:animate-in",
        "x:data-[state=closed]:fade-out-0 x:data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

export function DialogContent({
  children,
  portal = true,
  className,
  closeButton = true,
  overlayProps,
  ...props
}: ArkDialog.ContentProps & {
  portal?: boolean;
  closeButton?: boolean;
  overlayProps?: ArkDialog.BackdropProps;
}) {
  const Comp = portal ? Portal : React.Fragment;

  return (
    <Comp>
      <DialogOverlay {...overlayProps} />
      <ArkDialog.Positioner>
        <ArkDialog.Content
          className={cn(
            "custom-scrollbar x:fixed x:top-[50%] x:left-[50%] x:z-50 x:flex x:max-h-[95vh] x:w-full x:max-w-lg x:flex-col x:overflow-y-auto x:fill-mode-forwards",
            "x:translate-x-[-50%] x:translate-y-[-50%] x:gap-4 x:border x:border-border/50 x:bg-background x:p-6 x:shadow-lg x:duration-200",
            "x:max-h-[95vh] x:data-[state=closed]:hidden x:data-[state=closed]:animate-out x:data-[state=open]:fade-in-0",
            "x:sm:rounded-xl",
            className,
          )}
          {...props}
        >
          {children}
          {closeButton && (
            <DialogClose className="x:absolute x:top-4 x:right-4 x:rounded-xl x:opacity-70 x:ring-offset-background x:transition-opacity x:hover:opacity-100 x:focus:ring-2 x:focus:ring-ring x:focus:ring-offset-2 x:focus:outline-none x:disabled:pointer-events-none x:data-[state=open]:bg-primary-foreground x:data-[state=open]:text-muted-foreground">
              <TablerX className="x:h-4 x:w-4" />
              <span className="x:sr-only">Close</span>
            </DialogClose>
          )}
        </ArkDialog.Content>
      </ArkDialog.Positioner>
    </Comp>
  );
}

export function DialogHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("x:flex x:flex-col x:space-y-1.5", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "x:flex x:flex-col-reverse x:gap-2 x:sm:flex-row x:sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: ArkDialog.TitleProps) {
  return (
    <ArkDialog.Title
      className={cn(
        "x:text-lg x:leading-none x:font-semibold x:tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ArkDialog.DescriptionProps) {
  return (
    <ArkDialog.Description
      className={cn("x:text-sm x:text-muted-foreground", className)}
      {...props}
    />
  );
}
