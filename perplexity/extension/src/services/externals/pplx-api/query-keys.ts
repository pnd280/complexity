import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { PplxApiService } from "@/services/externals/pplx-api";
import type {
  Space,
  ThreadsSearchPayload,
} from "@/services/externals/pplx-api/pplx-api.types";

export const pplxApiQueries = {
  all: () => ["pplxApi"] as const,

  userSettings: {
    all: () => [...pplxApiQueries.all(), "userSettings"] as const,
    detail: (isLoggedIn: boolean) =>
      queryOptions({
        queryKey: [...pplxApiQueries.userSettings.all()] as const,
        queryFn: () => PplxApiService.fetchUserSettings(),
        staleTime: ms("5s"),
        enabled: isLoggedIn,
        gcTime: Infinity,
      }),
  },

  auth: {
    all: () => [...pplxApiQueries.all(), "auth"] as const,
    detail: () =>
      queryOptions({
        queryKey: [...pplxApiQueries.auth.all()] as const,
        queryFn: () => PplxApiService.fetchAuthSession(),
      }),
    orgStatus: {
      all: () => [...pplxApiQueries.auth.all(), "orgStatus"] as const,
      detail: () =>
        queryOptions({
          queryKey: [...pplxApiQueries.auth.orgStatus.all()] as const,
          queryFn: () => PplxApiService.fetchOrgSettings(),
        }),
    },
  },

  thread: {
    all: () => [...pplxApiQueries.all(), "thread"] as const,
    detail: (threadSlug: string) =>
      queryOptions({
        queryKey: [...pplxApiQueries.thread.all(), { threadSlug }] as const,
        queryFn: () => PplxApiService.fetchThread(threadSlug),
      }),
  },

  threads: {
    all: () => [...pplxApiQueries.thread.all(), "all"] as const,
    detail: (params: { searchValue?: string; offset?: number } = {}) =>
      queryOptions({
        queryKey: [...pplxApiQueries.threads.all(), params] as const,
        queryFn: () => PplxApiService.fetchThreads(params),
      }),
    infinite: {
      all: () => [...pplxApiQueries.threads.all(), "infinite"] as const,
      detail: ({
        initialPageParam,
        ...searchParams
      }: {
        initialPageParam?: number;
      } & ThreadsSearchPayload) =>
        infiniteQueryOptions({
          queryKey: [
            ...pplxApiQueries.threads.infinite.all(),
            { ...searchParams },
          ] as const,
          queryFn: (ctx) =>
            // temp hard-coded limit and offset for pagination
            PplxApiService.fetchThreads({
              ...searchParams,
              limit: 20,
              offset: ctx.pageParam * 20,
            }),
          initialPageParam: initialPageParam ?? 0,
          getNextPageParam: (lastPage, allPages) =>
            lastPage[0]?.has_next_page ? allPages.length : undefined,
        }),
    },
  },

  space: {
    all: () => [...pplxApiQueries.all(), "space"] as const,
    detail: (spaceUuid: Space["uuid"]) =>
      queryOptions({
        queryKey: [...pplxApiQueries.space.all(), { spaceUuid }] as const,
        queryFn: () => PplxApiService.fetchSpace(spaceUuid),
      }),
    files: {
      all: (spaceUuid: Space["uuid"]) =>
        [...pplxApiQueries.spaces.all(), "files", { spaceUuid }] as const,
      detail: (spaceUuid: Space["uuid"]) =>
        queryOptions({
          queryKey: [...pplxApiQueries.space.files.all(spaceUuid)] as const,
          queryFn: () => PplxApiService.fetchSpaceFiles(spaceUuid),
        }),
      downloadUrl: {
        all: (spaceUuid: Space["uuid"], fileUuid: string) =>
          [
            ...pplxApiQueries.space.files.all(spaceUuid),
            "downloadUrl",
            { fileUuid },
          ] as const,
        detail: (spaceUuid: Space["uuid"], fileUuid: string) =>
          queryOptions({
            queryKey: [
              ...pplxApiQueries.space.files.downloadUrl.all(
                spaceUuid,
                fileUuid,
              ),
            ] as const,
            queryFn: () =>
              PplxApiService.fetchSpaceFileDownloadUrl({ spaceUuid, fileUuid }),
          }),
      },
    },
    threads: {
      all: (spaceSlug: Space["slug"]) =>
        [...pplxApiQueries.spaces.all(), "threads", { spaceSlug }] as const,
      detail: ({
        spaceSlug,
        offset = 0,
      }: {
        spaceSlug: Space["slug"];
        offset?: number;
      }) =>
        queryOptions({
          queryKey: [
            ...pplxApiQueries.space.threads.all(spaceSlug),
            { offset },
          ] as const,
          queryFn: () =>
            PplxApiService.fetchSpaceThreads({
              spaceSlug,
              limit: 20,
              offset,
            }),
        }),
      infinite: {
        all: (spaceSlug: Space["slug"]) =>
          [...pplxApiQueries.space.threads.all(spaceSlug), "infinite"] as const,
        detail: ({
          spaceSlug,
          initialPageParam,
        }: {
          spaceSlug: Space["slug"];
          initialPageParam: number;
        }) =>
          infiniteQueryOptions({
            queryKey: [
              ...pplxApiQueries.space.threads.infinite.all(spaceSlug),
            ] as const,
            queryFn: ({ pageParam }) =>
              PplxApiService.fetchSpaceThreads({
                spaceSlug,
                limit: 20,
                offset: pageParam as number,
              }),
            initialPageParam,
            getNextPageParam: (lastPage, _, lastPageParam) =>
              lastPage[0]?.has_next_page ? lastPageParam + 20 : undefined,
          }),
      },
    },
  },

  spaces: {
    all: () => [...pplxApiQueries.space.all(), "all"] as const,
    detail: () =>
      queryOptions({
        queryKey: [...pplxApiQueries.spaces.all()] as const,
        queryFn: () => PplxApiService.fetchSpaces(),
      }),
  },
};
