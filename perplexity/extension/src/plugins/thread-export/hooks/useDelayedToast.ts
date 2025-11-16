import { useEffect, useRef } from "react";

import { toast } from "@/components/ui/use-toast";

type DelayedToastParams = {
  title: string;
  description: string;
  delay?: number;
};

type UseDelayedToastReturn = {
  showDelayedToast: (params: DelayedToastParams) => void;
  dismissDelayedToast: () => void;
};

export function useDelayedToast(): UseDelayedToastReturn {
  const toastTimeoutRef = useRef<number | null>(null);
  const toastInstanceRef = useRef<ReturnType<typeof toast> | undefined>(
    undefined,
  );

  const showDelayedToast = ({
    title,
    description,
    delay = 1500,
  }: DelayedToastParams) => {
    toastTimeoutRef.current = window.setTimeout(() => {
      toastInstanceRef.current = toast({
        title,
        description,
        duration: Infinity,
      });
    }, delay);
  };

  const dismissDelayedToast = () => {
    if (toastTimeoutRef.current != null) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    toastInstanceRef.current?.dismiss();
    toastInstanceRef.current = undefined;
  };

  useEffect(() => {
    return () => {
      dismissDelayedToast();
    };
  }, []);

  return {
    showDelayedToast,
    dismissDelayedToast,
  };
}
