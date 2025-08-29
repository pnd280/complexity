import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";

import ChangelogRenderer from "@/components/changelog/ChangelogRenderer";
import LoadingOverlay from "@/components/LoadingOverlay";
import { H1, H2 } from "@/components/ui/typography";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";

export function DirectReleaseNotesPage() {
  const { version } = useLoaderData() as { version: string };

  const {
    data: changelog,
    isLoading,
    isError,
  } = useQuery({
    ...cplxApiQueries.changelog.detail({
      version: version,
    }),
  });

  if (isLoading) return <LoadingOverlay />;

  return (
    <div className="x:m-8 x:flex x:max-w-[90vw] x:flex-col x:gap-4 x:xl:mx-auto x:xl:min-h-screen">
      <H1>Release Notes</H1>
      <H2 className="x:w-max x:rounded-md x:border x:border-border/50 x:bg-secondary x:px-4 x:py-2 x:font-mono x:text-primary">
        v{version}
      </H2>
      {changelog && <ChangelogRenderer changelog={changelog} />}
      {(!changelog || isError) && (
        <div className="x:flex x:flex-col x:gap-2">
          <p>No changelog found for this version</p>
          <p className="x:text-sm x:text-muted-foreground">
            This version may not have any changelog.
          </p>
        </div>
      )}
    </div>
  );
}
