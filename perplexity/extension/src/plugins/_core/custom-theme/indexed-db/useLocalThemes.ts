import { useQuery } from "@tanstack/react-query";

import { getLocalThemesProxyService } from "@/plugins/_core/custom-theme/indexed-db/proxy";

export function useLocalThemes() {
  return useQuery({
    queryKey: ["localThemes"],
    queryFn: () => getLocalThemesProxyService().getAll(),
  });
}
