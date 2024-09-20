import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import usePplxAuth from "@/content-script/hooks/usePplxAuth";
import PplxApi from "@/services/PplxApi";
import { UserSettingsApiResponse } from "@/types/pplx-api.types";

export default function useFetchUserSettings({
  ...props
}: Omit<
  UseQueryOptions<UserSettingsApiResponse>,
  "queryKey" | "queryFn" | "enabled"
> = {}) {
  const { isLoggedIn } = usePplxAuth();

  const query = useQuery({
    queryKey: ["userSettings"],
    queryFn: PplxApi.fetchUserSettings,
    retry: (failureCount, error) => {
      if (error.name === "ZodError") return false;

      if (failureCount > 3) {
        console.log("Refreshing page");
        window.location.reload();
      }

      return true;
    },
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    enabled: isLoggedIn,
    ...props,
  });

  return query;
}
