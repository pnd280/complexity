import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { sleep, waitForElement } from "@/utils/utils";

export default function useWaitForElement({
  id,
  selector,
  timeout = 5000,
  initialDelay,
  checkInterval,
}: {
  id: string;
  selector: string | (() => HTMLElement | Element);
  timeout?: number;
  initialDelay?: number;
  checkInterval?: number;
}) {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["domNode", id],
    queryFn: async () => {
      if (initialDelay != null) await sleep(initialDelay);

      const element = await waitForElement({
        selector,
        timeout,
      });

      if (!element) throw new Error("Dom node not found: " + id);

      return element;
    },
    refetchOnWindowFocus: false,
  });

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (checkInterval == null) return;

    if (data) {
      intervalRef.current = window.setInterval(() => {
        if (!document.body.contains(data)) {
          refetch();
        }
      }, checkInterval);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [data, refetch, checkInterval]);

  return {
    isWaiting: isLoading || isFetching,
    element: data,
  };
}
