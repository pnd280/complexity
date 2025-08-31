import { QueryObserver } from "@tanstack/react-query";

import { queryClient } from "@/data/query-client";
import { persistRemoteResources } from "@/data/query-client/utils";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";

export default async function () {
  new QueryObserver(queryClient, {
    queryKey: pplxApiQueries.spaces.detail().queryKey,
    enabled: false,
  }).subscribe((data) => {
    if (data.status !== "success" || data.fetchStatus !== "idle") return;

    persistRemoteResources({ queryClient });
  });

  new QueryObserver(queryClient, {
    queryKey: pplxApiQueries.threads.infinite.detail({
      searchValue: "",
      initialPageParam: 0,
    }).queryKey,
    enabled: false,
  }).subscribe((data) => {
    if (data.status !== "success" || data.fetchStatus !== "idle") return;

    persistRemoteResources({ queryClient });
  });

  queryClient.ensureQueryData(pplxApiQueries.spaces.detail());
  queryClient.ensureInfiniteQueryData(
    pplxApiQueries.threads.infinite.detail({
      searchValue: "",
      initialPageParam: 0,
    }),
  );
}
