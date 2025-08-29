import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import semver from "semver";

import { APP_CONFIG } from "@/app.config";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";

export function useVersionPagination() {
  const { data: changelogListing } = useQuery(
    cplxApiQueries.changelog.listing.detail(),
  );

  const availableVersions = useMemo(() => {
    if (!changelogListing) return [];
    return Object.keys(changelogListing).filter((version) =>
      semver.lte(version, APP_CONFIG.VERSION),
    );
  }, [changelogListing]);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["versionPagination", changelogListing],
    queryFn: ({ pageParam = 0 }) => {
      const startIndex = pageParam as number;
      const count = 1;
      const endIndex = startIndex + count;
      return availableVersions.slice(startIndex, endIndex);
    },
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const startIndex = lastPageParam as number;
      const nextIndex = startIndex + lastPage.length;
      return nextIndex < availableVersions.length ? nextIndex : undefined;
    },
    initialPageParam: 0,
    enabled: availableVersions.length > 0,
  });

  const loadedVersions = useMemo(() => {
    return data?.pages.flat() || [];
  }, [data?.pages]);

  const changelogQueries = useQueries({
    queries: loadedVersions.map((version) => ({
      ...cplxApiQueries.changelog.detail({ version }),
      staleTime: 1000 * 60 * 60,
    })),
  });

  return {
    loadedVersions,
    hasMore: !!hasNextPage,
    loadNextVersions: () => fetchNextPage(),
    changelogQueries,
  };
}
