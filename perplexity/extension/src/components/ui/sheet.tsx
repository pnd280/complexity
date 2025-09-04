import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
import { LuX } from "react-icons/lu";

import { Portal } from "@/components/ui/portal";

export const Sheet = ArkDialog.Root;
export const SheetTrigger = ArkDialog.Trigger;
export const SheetClose = ArkDialog.CloseTrigger;
export const SheetPortal = Portal;

export function SheetOverlay({ className, ...props }: ArkDialog.BackdropProps) {
  return (
    <ArkDialog.Backdrop
      className={cn(
        "x:fixed x:inset-0 x:z-50 x:bg-black/80",
        "x:data-[state=closed]:animate-out x:data-[state=open]:animate-in",
        "x:data-[state=closed]:fade-out-0 x:data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

const sheetVariants = cva(
  "x:fixed x:z-50 x:bg-background x:shadow-lg x:transition x:ease-in-out",
  {
    variants: {
      side: {
        top: "x:inset-x-0 x:top-0 x:overflow-y-auto x:border-b",
        bottom: "x:inset-x-0 x:bottom-0 x:overflow-y-auto x:border-t",
        left: "x:inset-y-0 x:left-0 x:h-full x:w-3/4 x:border-r x:sm:max-w-sm",
        right:
          "x:inset-y-0 x:right-0 x:h-full x:w-3/4 x:border-l x:sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

type SheetContentProps = ArkDialog.ContentProps &
  VariantProps<typeof sheetVariants> & {
    closeButton?: boolean;
  };

export function SheetContent({
  side = "right",
  className,
  children,
  closeButton = true,
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <ArkDialog.Positioner>
        <ArkDialog.Content
          className={cn(
            sheetVariants({ side }),
            "x:p-6",
            "x:border-border/50",
            {
              "x:h-[100dvh]": side === "left" || side === "right",
              "x:h-auto x:max-h-[75vh] x:!w-screen":
                side === "top" || side === "bottom",
              "x:data-[state=closed]:animate-out x:data-[state=open]:animate-in": true,
              "x:data-[state=closed]:slide-out-to-left x:data-[state=open]:slide-in-from-left":
                side === "left",
              "x:data-[state=closed]:slide-out-to-right x:data-[state=open]:slide-in-from-right":
                side === "right",
              "x:data-[state=closed]:slide-out-to-top x:data-[state=open]:slide-in-from-top":
                side === "top",
              "x:data-[state=closed]:slide-out-to-bottom x:data-[state=open]:slide-in-from-bottom":
                side === "bottom",
              "x:data-[state=closed]:duration-300 x:data-[state=open]:duration-300": true,
            },
            className,
          )}
          {...props}
        >
          {children}
          {closeButton && (
            <SheetClose className="x:absolute x:top-4 x:right-4 x:rounded-sm x:opacity-70 x:ring-ring x:hover:opacity-100 x:focus:ring-2 x:focus:ring-offset-2 x:focus:outline-none x:disabled:pointer-events-none">
              <LuX className="x:h-4 x:w-4" />
              <span className="x:sr-only">Close</span>
            </SheetClose>
          )}
        </ArkDialog.Content>
      </ArkDialog.Positioner>
    </SheetPortal>
  );
}

export function SheetHeader({
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

export function SheetFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "x:flex x:flex-col-reverse x:sm:flex-row x:sm:justify-end x:sm:space-x-2",
        className,
      )}
      {...props}
    />
  );
}

export function SheetTitle({ className, ...props }: ArkDialog.TitleProps) {
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

export function SheetDescription({
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
