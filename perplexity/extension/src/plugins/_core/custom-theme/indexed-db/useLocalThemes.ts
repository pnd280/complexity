import { useQuery } from "@tanstack/react-query";

import { LocalThemesService } from "@/plugins/_core/custom-theme/indexed-db/service-init.bg-worker";

export function useLocalThemes() {
  return useQuery({
    queryKey: ["localThemes"],
    queryFn: () => LocalThemesService.Instance.getAll(),
  });
}
