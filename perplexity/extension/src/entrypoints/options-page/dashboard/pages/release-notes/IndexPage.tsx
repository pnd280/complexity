import { useQuery } from "@tanstack/react-query";

import ChangelogRenderer from "@/components/changelog/ChangelogRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import { useVersionPagination } from "@/entrypoints/options-page/dashboard/pages/release-notes/hooks/useVersionPagination";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/dom-utils/pplx-scrollbar-classes";

import TablerLoaderCircle from "~icons/tabler/loader-2";

export function IndexPage() {
  const { loadedVersions, hasMore, loadNextVersions, changelogQueries } =
    useVersionPagination();

  const { data: changelogListing } = useQuery(
    cplxApiQueries.changelog.listing.detail(),
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadNextVersions();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadNextVersions, loadedVersions]);

  return (
    <div className="x:flex x:flex-col x:gap-8">
      <div className="x:flex x:flex-col x:gap-2">
        <h1 className="x:text-2xl x:font-bold">Release Notes</h1>
        <p className="x:text-sm x:text-muted-foreground">
          Stay up to date with the latest changes and features.
        </p>
      </div>

      <div
        className={cn("x:relative x:max-w-7xl x:pb-8", PPLX_SCROLLBAR_CLASSES)}
      >
        {loadedVersions.map((version, index) => {
          const changelogQuery = changelogQueries[index];
          const isLoading = changelogQuery?.isLoading;
          const changelog = changelogQuery?.data;
          const releaseDate = changelogListing?.[version];

          return (
            <div
              key={version}
              className="x:relative x:mb-8 x:grid x:grid-cols-1 x:gap-4 x:last:mb-0 x:md:grid-cols-[8rem_1fr] x:md:gap-x-6"
            >
              <div className="x:top-4 x:flex x:h-fit x:flex-col-reverse x:items-start x:gap-2 x:self-start x:md:sticky x:md:flex-col x:md:items-end">
                <div className="x:ml-2 x:text-right x:text-sm x:text-muted-foreground">
                  {releaseDate}
                </div>
                <div className="x:mb-2 x:w-max x:rounded-lg x:border x:border-border/50 x:bg-secondary x:px-2 x:py-1 x:text-left x:font-mono x:text-lg">
                  {version}
                </div>
              </div>

              <div className="x:flex x:flex-col x:gap-4">
                {isLoading && (
                  <div className="x:flex x:flex-col x:gap-8">
                    <div className="x:flex x:flex-col x:gap-2">
                      <Skeleton className="x:mb-2 x:h-6 x:w-32" />
                      <div className="x:flex x:flex-col x:gap-2 x:pl-4">
                        <Skeleton className="x:h-4 x:w-full" />
                        <Skeleton className="x:h-4 x:w-5/6" />
                        <Skeleton className="x:h-4 x:w-3/4" />
                      </div>
                    </div>
                    <div className="x:flex x:flex-col x:gap-2">
                      <Skeleton className="x:mb-2 x:h-6 x:w-32" />
                      <div className="x:flex x:flex-col x:gap-2 x:pl-4">
                        <Skeleton className="x:h-4 x:w-full" />
                        <Skeleton className="x:h-4 x:w-5/6" />
                        <Skeleton className="x:h-4 x:w-7/8" />
                      </div>
                    </div>
                  </div>
                )}
                {changelog && <ChangelogRenderer changelog={changelog} />}
              </div>
            </div>
          );
        })}

        {hasMore && (
          <div
            ref={loadMoreRef}
            className="x:relative x:mx-auto x:flex x:w-fit x:justify-center x:py-4"
          >
            <div className="x:absolute x:top-4 x:left-2 x:z-10 x:flex x:items-center x:justify-center x:rounded-full x:bg-background">
              <TablerLoaderCircle className="x:animate-spin x:text-muted-foreground" />
            </div>
            <div className="x:sr-only">Loading more versions...</div>
          </div>
        )}

        {!hasMore && loadedVersions.length > 0 && (
          <div className="x:relative x:mx-auto x:w-full x:py-4 x:text-center x:text-muted-foreground">
            Wow, you really made it all the way to the end! 🎊
          </div>
        )}
      </div>
    </div>
  );
}
