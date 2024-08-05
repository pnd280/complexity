import { Dialog as ArkDialog } from "@ark-ui/react";
import { X } from "lucide-react";
import React from "react";

import Portal from "@/shared/components/Portal";
import { cn } from "@/utils/cn";

const Dialog: React.FC<ArkDialog.RootProps> = ({ ...props }) => {
  return <ArkDialog.Root unmountOnExit={true} lazyMount={true} {...props} />;
};

export type DialogProps = ArkDialog.RootProps;

const DialogTrigger = ArkDialog.Trigger;

const DialogClose = ArkDialog.CloseTrigger;

const DialogOverlay: React.FC<ArkDialog.BackdropProps> = ({
  className,
  ...props
}) => {
  return (
    <ArkDialog.Backdrop
      className={cn(
        "tw-fixed tw-inset-0 tw-z-50 tw-bg-black tw-opacity-80",
        "data-[state=open]:tw-animate-in data-[state=open]:tw-fade-in-0",
        "data-[state=closed]:tw-animate-out data-[state=closed]:tw-fade-out-0",
        className,
      )}
      {...props}
    />
  );
};

DialogOverlay.displayName = "DialogOverlay";

const DialogContent: React.FC<ArkDialog.ContentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Portal>
      <DialogOverlay />
      <ArkDialog.Positioner>
        <ArkDialog.Content
          className={cn(
            "tw-pointer-events-auto tw-fixed tw-left-[50%] tw-top-[50%] tw-z-50 tw-grid tw-w-full tw-max-w-lg tw-translate-x-[-50%] tw-translate-y-[-50%] tw-gap-4 tw-border tw-bg-background tw-p-6 tw-shadow-lg tw-duration-200",
            "data-[state=open]:tw-animate-in data-[state=open]:tw-fade-in-0",
            "data-[state=closed]:tw-animate-out data-[state=closed]:tw-fade-out-0",
            "data-[state=closed]:tw-zoom-out-95 data-[state=open]:tw-zoom-in-95",
            "data-[state=closed]:tw-slide-out-to-left-1/2 data-[state=closed]:tw-slide-out-to-top-[48%]",
            "data-[state=open]:tw-slide-in-from-left-1/2 data-[state=open]:tw-slide-in-from-top-[48%]",
            "sm:tw-rounded-lg",
            className,
          )}
          {...props}
        >
          {children}
          <DialogClose className="tw-absolute tw-right-4 tw-top-4 tw-rounded-sm tw-opacity-70 tw-ring-offset-background tw-transition-opacity hover:tw-opacity-100 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-ring focus:tw-ring-offset-2 disabled:tw-pointer-events-none data-[state=open]:tw-bg-accent data-[state=open]:tw-text-muted-foreground">
            <X className="tw-size-4" />
          </DialogClose>
        </ArkDialog.Content>
      </ArkDialog.Positioner>
    </Portal>
  );
};

DialogContent.displayName = "DialogContent";

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "tw-flex tw-flex-col tw-space-y-1.5 tw-text-center sm:tw-text-left",
      className,
    )}
    {...props}
  />
);

DialogHeader.displayName = "DialogHeader";

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "tw-flex tw-flex-row-reverse sm:tw-flex-row sm:tw-justify-end sm:tw-space-x-2",
      className,
    )}
    {...props}
  />
);

DialogFooter.displayName = "DialogFooter";

const DialogTitle: React.FC<ArkDialog.TitleProps> = ({
  className,
  ...props
}) => {
  return (
    <ArkDialog.Title
      className={cn(
        "tw-text-lg tw-font-semibold tw-leading-none tw-tracking-tight",
        className,
      )}
      {...props}
    />
  );
};

DialogTitle.displayName = "DialogTitle";

const DialogDescription: React.FC<ArkDialog.DescriptionProps> = ({
  className,
  ...props
}) => {
  return (
    <ArkDialog.Description
      className={cn("tw-text-sm tw-text-muted-foreground", className)}
      {...props}
    />
  );
};

DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
};
