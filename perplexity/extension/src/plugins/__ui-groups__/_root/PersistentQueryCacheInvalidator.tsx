import { useQuery } from "@tanstack/react-query";
import { storage } from "@wxt-dev/storage";

import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache/index.lib-loader";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";

export function PersistentQueryCacheInvalidator() {
  const [enabled, setEnabled] = useState(true);

  const { data: remoteResourcesCacheBuster } = useQuery({
    ...cplxApiQueries.cacheBuster.detail(),
    enabled,
  });

  useEffect(() => {
    if (!remoteResourcesCacheBuster || !enabled) return;

    if (persistentQueryClient.currentSeshSoftCacheBuster == null) {
      void storage.setItem(
        persistentQueryClient.softCacheBusterKey,
        remoteResourcesCacheBuster,
      );

      return;
    }

    if (
      persistentQueryClient.currentSeshSoftCacheBuster !==
      remoteResourcesCacheBuster
    ) {
      setEnabled(false);

      void storage.setItem(
        persistentQueryClient.softCacheBusterKey,
        remoteResourcesCacheBuster,
      );
      void persistentQueryClient.wipeQueryCache();

      console.log(`[CPLX:PersistentQueryClient] Cache invalidated`);
    }
  }, [enabled, remoteResourcesCacheBuster]);

  return null;
}
