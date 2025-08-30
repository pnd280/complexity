import { queryOptions } from "@tanstack/react-query";

import { getBetterCodeBlocksFineGrainedOptionsProxyService } from "@/plugins/thread-better-code-blocks/indexed-db/proxy";

export const betterCodeBlocksFineGrainedOptionsQueries = {
  all: () => ["betterCodeBlocksFineGrainedOptions"] as const,

  list: {
    all: () =>
      [...betterCodeBlocksFineGrainedOptionsQueries.all(), "list"] as const,
    detail: () =>
      queryOptions({
        queryKey: [
          ...betterCodeBlocksFineGrainedOptionsQueries.list.all(),
        ] as const,
        queryFn: () =>
          getBetterCodeBlocksFineGrainedOptionsProxyService().getAll(),
      }),
  },

  get: {
    all: () =>
      [...betterCodeBlocksFineGrainedOptionsQueries.all(), "get"] as const,
    detail: (language: string) =>
      queryOptions({
        queryKey: [
          ...betterCodeBlocksFineGrainedOptionsQueries.get.all(),
          { language },
        ] as const,
        queryFn: () =>
          getBetterCodeBlocksFineGrainedOptionsProxyService().get(language),
      }),
  },
};
