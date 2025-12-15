import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";

import ChangelogRenderer from "@/components/changelog/ChangelogRenderer";
import SponsorChannels from "@/components/SponsorChannels";
import { Skeleton } from "@/components/ui/skeleton";
import { H2 } from "@/components/ui/typography";
import { cplxApiQueries } from "@/entrypoints/services/externals/cplx-api/query-keys";

export function FullScreenReleaseNotesPage() {
  const { version } = useLoaderData() as { version: string };

  const { data, isLoading, isError } = useQuery({
    ...cplxApiQueries.changelog.detail({
      version: version,
    }),
  });

  const noChangelog = data != null && !isError && data.length === 0;

  return (
    <div className="x:m-8 x:flex x:max-w-[90vw] x:flex-col x:gap-8 x:xl:mx-auto">
      <H2 className="x:w-max x:rounded-md x:border x:border-border/50 x:bg-secondary x:px-4 x:py-2 x:font-mono x:text-primary">
        v{version}
      </H2>
      {isLoading && (
        <div className="x:flex x:flex-col x:gap-4">
          <div className="x:flex x:flex-col x:gap-2">
            <Skeleton className="x:h-4 x:w-80" />
            <Skeleton className="x:h-4 x:w-50" />
            <Skeleton className="x:h-4 x:w-64" />
          </div>
          <div className="x:flex x:flex-col x:gap-2">
            <Skeleton className="x:h-4 x:w-64" />
            <Skeleton className="x:h-4 x:w-80" />
            <Skeleton className="x:h-4 x:w-50" />
          </div>
        </div>
      )}
      {data && !noChangelog && (
        <div className="x:flex x:flex-col x:gap-8 x:md:flex-row x:md:justify-between">
          <ChangelogRenderer changelog={data} />
          <div className="x:border-foreground-subtle x:md:border-l x:md:pl-8">
            <div className="x:mt-4 x:flex x:flex-col x:gap-4">
              <SponsorChannels />
            </div>
          </div>
        </div>
      )}
      {noChangelog && <div>No changelog for this version</div>}
      {isError && <div>Failed to load changelog for this version</div>}
    </div>
  );
}
