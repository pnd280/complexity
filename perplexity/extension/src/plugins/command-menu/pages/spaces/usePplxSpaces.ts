import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { Space } from "@/entrypoints/services/externals/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/entrypoints/services/externals/pplx-api/query-keys";
import type { ControlledQueryOptions } from "@/types/tanstack-query.types";

const _queryKey = pplxApiQueries.spaces.all();

export default function usePplxSpaces({
  ...props
}: ControlledQueryOptions<Space[], typeof _queryKey> = {}) {
  return useQuery({
    ...pplxApiQueries.spaces.detail(),
    placeholderData: keepPreviousData,
    ...props,
  });
}
