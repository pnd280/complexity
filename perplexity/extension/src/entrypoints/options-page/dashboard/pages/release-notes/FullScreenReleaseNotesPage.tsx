import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";

import ChangelogRenderer from "@/components/changelog/ChangelogRenderer";
import PplxPro from "@/components/icons/PplxPro";
import SponsorChannels from "@/components/SponsorChannels";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { H2 } from "@/components/ui/typography";
import { persistentQueryClient } from "@/entrypoints/options-page/persistent-query-client";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { cometAffiliateRemoteResourceConfig } from "@/services/externals/cplx-api/remote-resources/comet-affiliate/index.remote-resources";
import { getRemoteResource } from "@/services/externals/cplx-api/remote-resources/utils";

import TablerLink from "~icons/tabler/link";

const cometAffiliateConfig = await getRemoteResource(
  cometAffiliateRemoteResourceConfig,
  persistentQueryClient,
);

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
            <h2 className="x:text-xl x:font-medium">
              Support future development
            </h2>
            <div className="x:mt-4 x:flex x:flex-col x:gap-4">
              {cometAffiliateConfig.enabled && (
                <div className="x:w-full x:space-y-2">
                  <div className="x:text-muted-foreground">
                    <Trans
                      tKey="common.sponsorDialog.cometAffiliate.title"
                      components={[
                        <PplxPro className="x:mx-1 x:inline-block x:text-xl x:text-primary" />,
                      ]}
                    />
                  </div>
                  <Button asChild className="x:group x:w-full x:space-x-2">
                    <a
                      href={`https://${cometAffiliateConfig.link}`}
                      target="_blank"
                      rel="noreferrer"
                      className="x:flex x:items-center"
                    >
                      <TablerLink className="x:size-6" />
                      <span>{cometAffiliateConfig.link}</span>
                    </a>
                  </Button>
                </div>
              )}

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
