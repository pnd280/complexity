import { useMutation, useQueryClient } from "@tanstack/react-query";

import PplxApi from "@/services/PplxApi";
import { UserProfileSettingsApiResponse } from "@/types/pplx-api.types";

export default function useUpdateUserProfileSettings() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["updateUserProfileSettings"],
    mutationFn: PplxApi.updateUserProfileSettings,
    onMutate: (args) => {
      const oldSettings =
        queryClient.getQueryData<UserProfileSettingsApiResponse>([
          "userProfileSettings",
        ]);

      queryClient.setQueryData(
        ["userProfileSettings"],
        (oldSettings: UserProfileSettingsApiResponse) => {
          return {
            ...oldSettings,
            ...args,
          };
        },
      );

      return oldSettings;
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
