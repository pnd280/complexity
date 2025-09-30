import { useQuery } from "@tanstack/react-query";

import { LocalThemesService } from "@/plugins/__core__/custom-theme/indexed-db/service-init.bg-worker";

export function useLocalThemes() {
  return useQuery({
    queryKey: ["localThemes"],
    queryFn: () => LocalThemesService.Instance.getAll(),
  });
}
