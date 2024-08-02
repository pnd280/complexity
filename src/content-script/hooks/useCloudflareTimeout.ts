import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";

import PplxApi from "@/services/PplxApi";
import { toast } from "@/shared/toast";

type UseCloudflareTimeoutProps = Pick<UseQueryOptions<boolean>, "enabled">;

export default function useCloudflareTimeout({
  ...props
}: UseCloudflareTimeoutProps = {}) {
  const { error } = useQuery({
    queryKey: ["detectCloudflareTimeout"],
    queryFn: PplxApi.detectCloudflareTimeout,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    retry: false,
    ...props,
  });

  useEffect(() => {
    if (error && error.message === "Cloudflare timeout") {
      toast({
        title: "⚠️ Cloudflare timeout!",
        description: "Refreshing the page...",
        timeout: 3000,
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [error]);
}
