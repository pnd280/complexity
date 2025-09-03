import { useQuery } from "@tanstack/react-query";

import { getLocalThemesService } from "@/plugins/_core/custom-theme/indexed-db/service-init.bg-worker";

export function useLocalThemes() {
  return useQuery({
    queryKey: ["localThemes"],
    queryFn: () => getLocalThemesService().getAll(),
  });
}
