import { useQuery } from "@tanstack/react-query";

import PplxApi from "@/services/PplxApi";

export default function usePplxAuth() {
  const query = useQuery({
    queryKey: ["pplxAuth"],
    queryFn: PplxApi.fetchAuthSession,
  });

  const isLoggedIn = query.data != null && Object.keys(query.data).length > 0;

  return {
    ...query,
    isLoggedIn,
  };
}
