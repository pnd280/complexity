import { useMutation } from "@tanstack/react-query";

import PplxApi from "@/services/PplxApi";
import { UserAiProfileApiResponse } from "@/types/pplx-api.types";
import { queryClient } from "@/utils/ts-query-query-client";

export default function useUpdateUserAiProfile() {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["updateUserAiProfile"],
    mutationFn: PplxApi.updateUserAiProfile,
    onMutate: async (args) => {
      await queryClient.cancelQueries({ queryKey: ["userAiProfile"] });

      const prevSettings = queryClient.getQueryData<UserAiProfileApiResponse>([
        "userAiProfile",
      ]);

      queryClient.setQueryData<UserAiProfileApiResponse>(
        ["userAiProfile"],
        (prev) => {
          if (typeof prev === "undefined") return prev;

          return {
            ...prev,
            ...args,
          } as UserAiProfileApiResponse;
        },
      );

      return prevSettings;
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["userAiProfile"], context ?? variables);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["userAiProfile"],
      });
    },
  });

  return {
    updateUserAiProfile: mutateAsync,
    isUpdatingUserAiProfile: isPending,
  };
}
