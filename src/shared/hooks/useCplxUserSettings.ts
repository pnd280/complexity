import { useMutation, useQuery } from "@tanstack/react-query";

import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import { queryClient } from "@/utils/ts-query-query-client";

export default function useCplxUserSettings() {
  const data = useQuery({
    queryKey: ["cplxUserSettings"],
    queryFn: CplxUserSettings.fetch,
  });

  const mutation = useMutation({
    mutationKey: ["updateCplxUserSettings"],
    mutationFn: CplxUserSettings.set,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["cplxUserSettings"],
      });
    },
  });

  return { data, mutation };
}
