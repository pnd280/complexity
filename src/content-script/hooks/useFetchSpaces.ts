import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import usePplxAuth from "@/content-script/hooks/usePplxAuth";
import PplxApi from "@/services/PplxApi";
import { Space } from "@/types/space.types";

export default function useFetchSpaces({
  ...props
}: Omit<UseQueryOptions<Space[]>, "queryKey" | "queryFn"> = {}) {
  const { isLoggedIn } = usePplxAuth();

  return useQuery<Space[]>({
    queryKey: ["spaces"],
    queryFn: PplxApi.fetchSpaces,
    enabled: isLoggedIn,
    ...props,
  });
}
