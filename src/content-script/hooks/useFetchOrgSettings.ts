import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import usePplxAuth from "@/content-script/hooks/usePplxAuth";
import PplxApi from "@/services/PplxApi";
import { OrgSettingsApiResponse } from "@/types/pplx-api.types";

export default function useFetchOrgSettings({
  ...props
}: Omit<UseQueryOptions<OrgSettingsApiResponse>, "queryKey" | "queryFn"> = {}) {
  const { isLoggedIn } = usePplxAuth();

  return useQuery({
    queryKey: ["org-settings"],
    queryFn: PplxApi.fetchOrgSettings,
    enabled: isLoggedIn,
    ...props,
  });
}
