import {
  pplxAuthOrgStatusQueryObserver,
  pplxAuthQueryObserver,
} from "@/plugins/__async-deps__/plugins-guard/store.loader";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import { queryClient } from "@/services/infra/query-client";
import { persistQueryClient } from "@/services/infra/query-client/utils";

export default async function () {
  pplxAuthQueryObserver.subscribe((data) => {
    if (data.status !== "success" || data.fetchStatus !== "idle") return;

    void persistQueryClient({ queryClient });
  });

  pplxAuthOrgStatusQueryObserver.subscribe((data) => {
    if (data.status !== "success" || data.fetchStatus !== "idle") return;

    void persistQueryClient({ queryClient });
  });

  void queryClient.ensureQueryData(pplxApiQueries.auth.detail());
  void queryClient.ensureQueryData(pplxApiQueries.auth.orgStatus.detail());
}
