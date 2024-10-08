import { useQuery } from "@tanstack/react-query";

import { waitForElement } from "@/utils/utils";

export default function useWaitForElement({
  id,
  selector,
  timeout = 5000,
}: {
  id: string;
  selector: string | (() => HTMLElement | Element);
  timeout?: number;
}) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["domNode", id],
    queryFn: async () => {
      const messagesContainer = await waitForElement({
        selector,
        timeout,
      });

      if (!messagesContainer) throw new Error("Dom node not found: " + id);

      return messagesContainer;
    },
    refetchOnWindowFocus: false,
  });

  return {
    isWaiting: isLoading || isFetching,
    element: data,
  };
}
