import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import usePplxAuth from "@/entrypoints/hooks/usePplxAuth";
import type { PplxUserSettingsApiResponse } from "@/entrypoints/services/externals/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/entrypoints/services/externals/pplx-api/query-keys";
import type { ControlledQueryOptions } from "@/types/tanstack-query.types";

const _queryKey = pplxApiQueries.userSettings.all();

export default function usePplxUserSettings({
  ...props
}: ControlledQueryOptions<
  PplxUserSettingsApiResponse,
  typeof _queryKey,
  "enabled"
> = {}): UseQueryResult<PplxUserSettingsApiResponse> {
  const { isLoggedIn } = usePplxAuth();

  const query = useQuery({
    ...pplxApiQueries.userSettings.detail(isLoggedIn),
    ...props,
  });

  return query;
}
