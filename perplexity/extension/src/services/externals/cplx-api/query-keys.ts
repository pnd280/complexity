import { queryOptions } from "@tanstack/react-query";
import type { ZodType } from "zod";

import { CplxApiService } from "@/services/externals/cplx-api";

export const cplxApiQueries = {
  all: () => ["cplxApi"] as const,

  changelog: {
    all: () => [...cplxApiQueries.all(), "changelog"] as const,
    detail: (params: { version?: string } = {}) =>
      queryOptions({
        queryKey: [...cplxApiQueries.changelog.all(), params] as const,
        queryFn: () => CplxApiService.fetchChangelog(params),
      }),
    listing: {
      all: () => [...cplxApiQueries.changelog.all(), "listing"] as const,
      detail: () =>
        queryOptions({
          queryKey: [...cplxApiQueries.changelog.listing.all()] as const,
          queryFn: () => CplxApiService.fetchChangelogListing(),
        }),
    },
  },

  remoteResource: {
    all: () => [...cplxApiQueries.all(), "remoteResource"] as const,
    detail: <T>(params: { resourcePath: string; zodSchema: ZodType<T> }) =>
      queryOptions({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: [
          ...cplxApiQueries.remoteResource.all(),
          {
            resourcePath: params.resourcePath,
          },
        ] as const,
        queryFn: () => CplxApiService.fetchRemoteResource(params),
      }),
  },

  versionedRemoteResource: {
    all: () => [...cplxApiQueries.all(), "versionedRemoteResource"] as const,
    detail: <T>(params: { resourcePath: string; zodSchema: ZodType<T> }) =>
      queryOptions({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: [
          ...cplxApiQueries.versionedRemoteResource.all(),
          {
            resourcePath: params.resourcePath,
          },
        ] as const,
        queryFn: () => CplxApiService.fetchVersionedRemoteResource(params),
      }),
  },

  cacheBuster: {
    all: () => [...cplxApiQueries.all(), "cacheBuster"] as const,
    detail: () =>
      queryOptions({
        queryKey: [...cplxApiQueries.cacheBuster.all()] as const,
        queryFn: () => CplxApiService.fetchSoftCacheBuster(),
      }),
  },

  psa: {
    all: () => [...cplxApiQueries.all(), "psa"] as const,
    detail: () =>
      queryOptions({
        queryKey: [...cplxApiQueries.psa.all()] as const,
        queryFn: () => CplxApiService.fetchPsa(),
      }),
  },

  cometPatchTutorial: {
    all: () => [...cplxApiQueries.all(), "cometPatchTutorial"] as const,
    detail: () =>
      queryOptions({
        queryKey: [...cplxApiQueries.cometPatchTutorial.all()] as const,
        queryFn: () => CplxApiService.fetchCometPatchTutorial(),
      }),
  },
};
