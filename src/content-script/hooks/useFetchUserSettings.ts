import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import PplxApi from "@/services/PplxApi";
import { UserSettingsApiResponse } from "@/types/pplx-api.types";

export default function useFetchUserSettings({
  ...props
}: Omit<
  UseQueryOptions<UserSettingsApiResponse>,
  "queryKey" | "queryFn"
> = {}) {
  return useQuery({
    queryKey: ["userSettings"],
    queryFn: PplxApi.fetchUserSettings,
    retry: (failureCount, error) => {
      if (error.name === "ZodError") return false;

      if (failureCount > 3) {
        return false;
      }

      return true;
    },
    ...props,
  });
}
