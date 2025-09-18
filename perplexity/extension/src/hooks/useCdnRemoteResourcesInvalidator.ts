import { useQuery, useQueryClient } from "@tanstack/react-query";
import { storage } from "@wxt-dev/storage";

import {
  invalidateQueryClientCache,
  softCacheBusterKey,
} from "@/data/query-client/utils";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";

export default function useCdnRemoteResourcesInvalidator({
  callback,
}: {
  callback?: () => void;
} = {}) {
  const queryClient = useQueryClient();

  const { data: remoteResourcesCacheBuster } = useQuery({
    ...cplxApiQueries.cacheBuster.detail(),
  });

  useEffect(() => {
    if (!remoteResourcesCacheBuster) return;

    (async () => {
      const softCacheBuster = await storage.getItem<string>(softCacheBusterKey);

      if (
        softCacheBuster == null ||
        softCacheBuster !== remoteResourcesCacheBuster
      ) {
        if (softCacheBuster === "invalidated") {
          await storage.setItem(softCacheBusterKey, remoteResourcesCacheBuster);
          return;
        }

        invalidateQueryClientCache({
          newCacheBuster: remoteResourcesCacheBuster,
        });
        console.log("[CPLX] Cache invalidated");

        callback?.();
      }
    })();
  }, [callback, queryClient, remoteResourcesCacheBuster]);
}
