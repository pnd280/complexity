import { useQuery } from "@tanstack/react-query";

import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";

export default function usePplxAuth() {
  const query = useQuery({
    ...pplxApiQueries.auth.detail(),
    staleTime: 60 * 1000,
    gcTime: Infinity,
    refetchOnMount: false,
  });
  const isLoggedIn = query.data != null && Object.keys(query.data).length > 0;
  const orgStatusQuery = useQuery({
    ...pplxApiQueries.auth.orgStatus.detail(),
    enabled: isLoggedIn,
    refetchOnMount: false,
    gcTime: Infinity,
    staleTime: 60 * 1000,
  });
  const isOrgMember = orgStatusQuery.data?.is_in_organization ?? false;

  return {
    isLoggedIn,
    isOrgMember,
  };
}
