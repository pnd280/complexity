import { QueryObserver } from "@tanstack/react-query";

import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import { queryClient } from "@/services/infra/query-client";
import { persistQueryClient } from "@/services/infra/query-client/utils";

export default async function () {
  new QueryObserver(queryClient, {
    queryKey: pplxApiQueries.spaces.detail().queryKey,
    enabled: false,
  }).subscribe((data) => {
    if (data.status !== "success" || data.fetchStatus !== "idle") return;

    void persistQueryClient({ queryClient });
  });

  new QueryObserver(queryClient, {
    queryKey: pplxApiQueries.threads.infinite.detail({
      searchValue: "",
      initialPageParam: 0,
    }).queryKey,
    enabled: false,
  }).subscribe((data) => {
    if (data.status !== "success" || data.fetchStatus !== "idle") return;

    void persistQueryClient({ queryClient });
  });

  void queryClient.ensureQueryData(pplxApiQueries.spaces.detail());
  void queryClient.ensureInfiniteQueryData(
    pplxApiQueries.threads.infinite.detail({
      searchValue: "",
      initialPageParam: 0,
    }),
  );
}
