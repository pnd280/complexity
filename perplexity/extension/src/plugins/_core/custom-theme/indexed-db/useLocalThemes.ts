import { useQuery } from "@tanstack/react-query";

import { getLocalThemesService } from "@/plugins/_core/custom-theme/indexed-db/get-service";

export function useLocalThemes() {
  return useQuery({
    queryKey: ["localThemes"],
    queryFn: () => getLocalThemesService().getAll(),
  });
}
