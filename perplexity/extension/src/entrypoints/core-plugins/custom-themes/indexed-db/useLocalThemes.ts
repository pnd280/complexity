import { useQuery } from "@tanstack/react-query";

import { LocalThemesService } from "@/entrypoints/core-plugins/custom-themes/indexed-db/service-init.bg-worker";

export function useLocalThemes() {
  return useQuery({
    queryKey: ["localThemes"],
    queryFn: () => LocalThemesService.Instance.getAll(),
  });
}
