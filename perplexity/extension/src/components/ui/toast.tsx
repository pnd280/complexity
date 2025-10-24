import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import TablerX from "~icons/tabler/x";

export const ToastProvider = ToastPrimitives.Provider;

export function ToastViewport({
  className,
  ...props
}: ToastPrimitives.ToastViewportProps) {
  return (
    <ToastPrimitives.Viewport
      className={cn(
        "x:fixed x:top-0 x:left-1/2 x:z-100 x:flex x:max-h-screen x:w-screen x:-translate-x-1/2 x:flex-col-reverse x:items-center x:justify-end x:gap-5 x:p-4 x:md:right-0 x:md:left-[unset] x:md:w-auto x:md:max-w-[420px] x:md:translate-x-[unset]",
        className,
      )}
      {...props}
    />
  );
}

const toastVariants = cva(
  "x:group x:pointer-events-auto x:relative x:flex x:w-full! x:items-center x:justify-between x:overflow-hidden x:rounded-xl x:border x:p-6 x:pr-8 x:shadow-lg x:transition-all x:data-[state=closed]:animate-out x:data-[state=closed]:fade-out-80 x:data-[state=closed]:slide-out-to-right-full x:data-[state=open]:animate-in x:data-[state=open]:slide-in-from-top-full x:data-[swipe=cancel]:translate-x-0 x:data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] x:data-[swipe=end]:animate-out x:data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] x:data-[swipe=move]:transition-none x:data-[state=open]:sm:slide-in-from-top-full",
  {
    variants: {
      variant: {
        default:
          "x:border-border/50 x:bg-secondary x:text-secondary-foreground",
        caution:
          "x:caution x:group x:border-caution x:bg-caution x:text-caution-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Toast({
  className,
  variant = "default",
  ...props
}: ToastPrimitives.ToastProps & {
  variant?: VariantProps<typeof toastVariants>["variant"];
}) {
  return (
    <ToastPrimitives.Root
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
}

export function ToastAction({
  className,
  ...props
}: ToastPrimitives.ToastActionProps) {
  return (
    <ToastPrimitives.Action
      className={cn(
        "x:inline-flex x:h-8 x:shrink-0 x:items-center x:justify-center x:rounded-xl x:border x:border-border/50 x:bg-transparent x:px-3 x:text-sm x:font-medium x:ring-offset-background x:transition-colors x:group-[.caution]:border-muted/40 x:hover:bg-secondary x:group-[.caution]:hover:border-caution/30 x:group-[.caution]:hover:bg-caution x:group-[.caution]:hover:text-caution-foreground x:focus:ring-2 x:focus:ring-ring x:focus:ring-offset-2 x:focus:outline-none x:group-[.caution]:focus:ring-caution x:disabled:pointer-events-none x:disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function ToastClose({
  className,
  ...props
}: ToastPrimitives.ToastCloseProps) {
  return (
    <ToastPrimitives.Close
      className={cn(
        "x:absolute x:top-2 x:right-2 x:rounded-xl x:p-1 x:text-foreground/50 x:opacity-0 x:transition-opacity x:group-hover:opacity-100 x:group-[.caution]:text-red-300 x:hover:text-foreground x:group-[.caution]:hover:text-red-50 x:focus:opacity-100 x:focus:ring-2 x:focus:outline-none x:group-[.caution]:focus:ring-red-400 x:group-[.caution]:focus:ring-offset-red-600",
        className,
      )}
      toast-close=""
      {...props}
    >
      <TablerX className="x:h-4 x:w-4" />
    </ToastPrimitives.Close>
  );
}

export function ToastTitle({
  className,
  ...props
}: ToastPrimitives.ToastTitleProps) {
  return (
    <ToastPrimitives.Title
      className={cn("x:text-sm x:font-semibold x:empty:hidden", className)}
      {...props}
    />
  );
}

export function ToastDescription({
  className,
  ...props
}: ToastPrimitives.ToastDescriptionProps) {
  return (
    <ToastPrimitives.Description
      className={cn("x:text-sm x:opacity-90", className)}
      {...props}
    />
  );
}

export type ToastProps = ComponentProps<typeof Toast>;
export type ToastActionElement = React.ReactElement<typeof ToastAction>;
