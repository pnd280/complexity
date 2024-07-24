import { useMutation, useQuery } from "@tanstack/react-query";

import CPLXUserSettings from "@/lib/CPLXUserSettings";
import { queryClient } from "@/utils/ts-query-query-client";

export default function useCPLXUserSettings() {
  const data = useQuery({
    queryKey: ["cplxUserSettings"],
    queryFn: CPLXUserSettings.fetch,
  });

  const mutation = useMutation({
    mutationKey: ["updateCPLXUserSettings"],
    mutationFn: CPLXUserSettings.set,
    onSettled: () => {
      console.log('here');
      
      queryClient.invalidateQueries({
        queryKey: ["cplxUserSettings"],
      });
    },
  });

  return { data, mutation };
}
