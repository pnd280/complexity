import { queryOptions } from "@tanstack/react-query";

import { BetterCodeBlocksFineGrainedService } from "@/plugins/thread-better-code-blocks/indexed-db/service-init.bg-worker";

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
        queryFn: () => BetterCodeBlocksFineGrainedService.Instance.getAll(),
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
          BetterCodeBlocksFineGrainedService.Instance.get(language),
      }),
  },
};
