import { useQuery } from "@tanstack/react-query";
import { storage } from "@wxt-dev/storage";

import { persistentQueryClient } from "@/entrypoints/options-page/persistent-query-client";
import { persistentQueryClient as csPersistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache/index.lib-loader";
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
      void storage.setItem(
        csPersistentQueryClient.softCacheBusterKey,
        remoteResourcesCacheBuster,
      );

      return;
    }

    if (
      persistentQueryClient.currentSeshSoftCacheBuster !==
      remoteResourcesCacheBuster
    ) {
      setEnabled(false);

      void persistentQueryClient.wipeQueryCache();
      void csPersistentQueryClient.wipeQueryCache();
      void storage.setItem(
        persistentQueryClient.softCacheBusterKey,
        remoteResourcesCacheBuster,
      );
      void storage.setItem(
        csPersistentQueryClient.softCacheBusterKey,
        remoteResourcesCacheBuster,
      );

      console.log(`[CPLX:PersistentQueryClient] Cache invalidated`);
    }
  }, [remoteResourcesCacheBuster, enabled]);

  return null;
}
