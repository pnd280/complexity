import { useMutation } from "@tanstack/react-query";

import PplxApi from "@/services/PplxApi";
import { UserProfileSettingsApiResponse } from "@/types/pplx-api.types";
import { queryClient } from "@/utils/ts-query-query-client";

export default function useUpdateUserProfileSettings() {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["updateUserProfileSettings"],
    mutationFn: PplxApi.updateUserProfileSettings,
    onMutate: async (args) => {
      await queryClient.cancelQueries({ queryKey: ["userProfileSettings"] });

      const prevSettings =
        queryClient.getQueryData<UserProfileSettingsApiResponse>([
          "userProfileSettings",
        ]);

      queryClient.setQueryData<UserProfileSettingsApiResponse>(
        ["userProfileSettings"],
        (prev) => {
          if (typeof prev === "undefined") return prev;

          return {
            ...prev,
            profile: {
              ...prev.profile,
              ...args,
            },
          };
        },
      );

      return prevSettings;
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["userProfileSettings"], context ?? variables);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfileSettings"],
      });
    },
  });

  return {
    updateUserProfileSettings: mutateAsync,
    isUpdatingUserProfileSettings: isPending,
  };
}
