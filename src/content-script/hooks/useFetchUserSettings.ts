import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  globalStore,
  useGlobalStore,
} from "@/content-script/session-store/global";
import PplxApi from "@/services/PplxApi";
import { UserSettingsApiResponse } from "@/types/pplx-api.types";

export default function useFetchUserSettings({
  ...props
}: Omit<
  UseQueryOptions<UserSettingsApiResponse>,
  "queryKey" | "queryFn" | "enabled"
> = {}) {
  const isLoggedIn = useGlobalStore((state) => state.isLoggedIn);

  const query = useQuery({
    queryKey: ["userSettings"],
    queryFn: PplxApi.fetchUserSettings,
    retry: (failureCount, error) => {
      if (error.name === "ZodError") return false;

      return failureCount <= 3;
    },
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    enabled: isLoggedIn,
    ...props,
  });

  const { data } = query;

  useEffect(() => {
    if (!data) return;

    const localIsLoggedIn =
      data.subscriptionStatus != null && data.queryCount > 0;

    if (!localIsLoggedIn) {
      console.log("Not logged in, disabling auto-refetch user settings");
    }

    globalStore.setState({ isLoggedIn: localIsLoggedIn });
  }, [data, isLoggedIn]);

  return query;
}
