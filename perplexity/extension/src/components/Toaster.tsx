import type { ComponentProps } from "react";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster({
  viewportProps,
}: {
  viewportProps?: ComponentProps<typeof ToastViewport>;
}) {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        className,
        ...props
      }) {
        return (
          <Toast
            key={id}
            className={cn("x:w-max x:font-sans", className)}
            {...props}
          >
            <div className="x:flex x:flex-col x:items-start x:justify-center x:gap-2">
              {title != null && title !== "" && (
                <ToastTitle>{title}</ToastTitle>
              )}
              {description != null && description !== "" && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport {...viewportProps} />
    </ToastProvider>
  );
}
