import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import PplxApi from "@/services/PplxApi";
import { UserProfileSettingsApiResponse } from "@/types/pplx-api.types";

export default function useFetchUserProfileSettings({
  ...props
}: Omit<
  UseQueryOptions<UserProfileSettingsApiResponse>,
  "queryKey" | "queryFn"
> = {}) {
  return useQuery<UserProfileSettingsApiResponse>({
    queryKey: ["userProfileSettings"],
    queryFn: PplxApi.fetchUserProfileSettings,
    ...props,
  });
}
