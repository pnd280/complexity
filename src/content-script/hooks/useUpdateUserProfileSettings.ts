import PPLXApi from '@/services/PPLXApi';
import { UserProfileSettingsApiResponse } from '@/types/PPLXApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateUserProfileSettings() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['updateUserProfileSettings'],
    mutationFn: PPLXApi.updateUserProfileSettings,
    onMutate: (args) => {
      const oldSettings =
        queryClient.getQueryData<UserProfileSettingsApiResponse>([
          'userProfileSettings',
        ]);

      queryClient.setQueryData(
        ['userProfileSettings'],
        (oldSettings: UserProfileSettingsApiResponse) => {
          return {
            ...oldSettings,
            ...args,
          };
        }
      );

      return oldSettings;
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['userProfileSettings'], context ?? variables);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['userProfileSettings'],
      });
    },
  });

  return {
    updateUserProfileSettings: mutateAsync,
    isUpdatingUserProfileSettings: isPending,
  };
}
